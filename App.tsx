import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputTextArea } from './components/InputTextArea';
import { SubmitButton } from './components/SubmitButton';
import { OutputDisplay } from './components/OutputDisplay';
import { RewrittenTextDisplay } from './components/RewrittenTextDisplay';
import { HeadlineDisplay } from './components/HeadlineDisplay';
import { LoginPage } from './components/LoginPage';
import { correctKannadaSpelling, rewriteKannadaText, generateKannadaHeadline } from './services/geminiService';
import type { CorrectionResponse } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [inputText, setInputText] = useState<string>('');
  
  const [correctionData, setCorrectionData] = useState<CorrectionResponse | null>(null);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [headlines, setHeadlines] = useState<string[] | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  const [headlineError, setHeadlineError] = useState<string | null>(null);

  const resetOutputs = () => {
    setCorrectionData(null);
    setRewrittenText(null);
    setHeadlines(null);
    setError(null);
    setRewriteError(null);
    setHeadlineError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some Kannada text to process.');
      return;
    }
    setIsLoading(true);
    resetOutputs();

    try {
      const correctionResult = await correctKannadaSpelling(inputText);
      setCorrectionData(correctionResult);

      if (correctionResult.correctedText) {
        const rewrittenResult = await rewriteKannadaText(correctionResult.correctedText);
        setRewrittenText(rewrittenResult);

        if (rewrittenResult) {
            try {
                const headlineResult = await generateKannadaHeadline(rewrittenResult);
                setHeadlines(headlineResult);
            } catch (err) {
                setHeadlineError('Failed to generate headlines.');
                console.error(err);
            }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);
  
  const handleExample = () => {
    const exampleText = "ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಡೆದ ತಂತ್ರಜ್ಞಾನ ಶೃಂಗಸಭೆಯಲ್ಲಿ, ಪ್ರಖ್ಯಾತ ವಿಜ್ಞಾನಿ ಡಾ. ರಮೇಶ್ ಅವರು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯ ಭವಿಷ್ಯದ ಬಗ್ಗೆ ಮಾತನಾಡಿದರು. ಅವರ ಭಾಷಣವು ಸಭಿಕರನ್ನು ಮಂತ್ರಮುಗ್ಧರನ್ನಾಗಿಸಿತು. ಅವರು ನವೀನ ತಂತ್ರಜ್ಞಾನಗಳ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಒತ್ತಿ ಹೇಳಿದರು.";
    setInputText(exampleText);
    resetOutputs();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-screen-xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
          <p className="text-center text-gray-600 mb-8 text-base md:text-lg max-w-4xl mx-auto">
            Enter news content, and our AI will correct, rewrite, and suggest headlines.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Column 1: Input */}
            <div className="flex flex-col">
               <div className="flex flex-col space-y-4 h-full">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-teal-700">Original Text</h2>
                     <button 
                      onClick={handleExample}
                      className="text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
                      >
                      Load Example
                    </button>
                  </div>
                  <InputTextArea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="ನಿಮ್ಮ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ..."
                    disabled={isLoading}
                  />
               </div>
            </div>

            {/* Column 2: Outputs */}
            <div className="flex flex-col space-y-6">
                 <div className="flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-cyan-700">Suggested Headlines</h2>
                    <HeadlineDisplay
                        headlines={headlines}
                        isLoading={isLoading && !!rewrittenText && !headlines}
                        error={headlineError}
                    />
                </div>
                 <div className="flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-green-700">Suggested Rewrite</h2>
                    <RewrittenTextDisplay
                        rewrittenText={rewrittenText}
                        isLoading={isLoading && !!correctionData && !rewrittenText}
                        error={rewriteError}
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-emerald-700">Corrected Text</h2>
                    <OutputDisplay
                        correctionData={correctionData}
                        isLoading={isLoading && !correctionData}
                        error={error}
                    />
                </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <SubmitButton
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!inputText.trim() || isLoading}
            >
              Process Text
            </SubmitButton>
            {error && !isLoading && !correctionData && (
              <p className="text-red-500 mt-4 text-center">{error}</p>
            )}
          </div>
        </div>
        <footer className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2025. PublicNext</p>
        </footer>
      </main>
    </div>
  );
};

export default App;