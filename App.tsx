
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputTextArea } from './components/InputTextArea';
import { InputText } from './components/InputText';
import { SubmitButton } from './components/SubmitButton';
import { OutputDisplay } from './components/OutputDisplay';
import { RewrittenTextDisplay } from './components/RewrittenTextDisplay';
import { HeadlineDisplay } from './components/HeadlineDisplay';
import { KeywordDisplay } from './components/KeywordDisplay';
import { LoginPage } from './components/LoginPage';
import { SecretKeyModal } from './components/ApiKeyModal';
import { correctKannadaSpelling, rewriteKannadaText, generateKannadaHeadline, generateKeywords } from './services/geminiService';
import type { CorrectionResponse, KeywordsResponse } from './types';
import { NewspaperIcon, PencilIcon, SparklesIcon, LightBulbIcon, TagIcon, CheckBadgeIcon } from './components/Icons';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSecretKeySet, setIsSecretKeySet] = useState<boolean>(!!localStorage.getItem('gemini-secret-key'));
  
  const [originalHeadline, setOriginalHeadline] = useState<string>('');
  const [inputBody, setInputBody] = useState<string>('');
  
  const [correctedHeadlineData, setCorrectedHeadlineData] = useState<CorrectionResponse | null>(null);
  const [correctedBodyData, setCorrectedBodyData] = useState<CorrectionResponse | null>(null);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [headlines, setHeadlines] = useState<string[] | null>(null);
  const [keywords, setKeywords] = useState<KeywordsResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [correctedHeadlineError, setCorrectedHeadlineError] = useState<string | null>(null);
  const [correctedBodyError, setCorrectedBodyError] = useState<string | null>(null);
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  const [headlineError, setHeadlineError] = useState<string | null>(null);
  const [keywordsError, setKeywordsError] = useState<string | null>(null);

  const resetOutputs = () => {
    setCorrectedHeadlineData(null);
    setCorrectedBodyData(null);
    setRewrittenText(null);
    setHeadlines(null);
    setKeywords(null);
    setCorrectedHeadlineError(null);
    setCorrectedBodyError(null);
    setRewriteError(null);
    setHeadlineError(null);
    setKeywordsError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!originalHeadline.trim() && !inputBody.trim()) {
      return;
    }
    setIsLoading(true);
    resetOutputs();

    const tasks: Promise<any>[] = [];

    // Task for processing the headline
    if (originalHeadline.trim()) {
      const headlineTask = correctKannadaSpelling(originalHeadline)
        .then(setCorrectedHeadlineData)
        .catch(err => {
          console.error("Headline Correction Error:", err);
          setCorrectedHeadlineError(err instanceof Error ? err.message : "Failed to correct headline.");
        });
      tasks.push(headlineTask);
    }

    // Task for processing the body and its dependent operations
    if (inputBody.trim()) {
      const bodyTask = (async () => {
        try {
          const correctionResult = await correctKannadaSpelling(inputBody);
          setCorrectedBodyData(correctionResult);

          if (correctionResult?.correctedText) {
            const rewrittenResult = await rewriteKannadaText(correctionResult.correctedText);
            setRewrittenText(rewrittenResult);

            if (rewrittenResult) {
              const [headlineOutcome, keywordOutcome] = await Promise.allSettled([
                generateKannadaHeadline(rewrittenResult),
                generateKeywords(rewrittenResult),
              ]);

              if (headlineOutcome.status === 'fulfilled') {
                setHeadlines(headlineOutcome.value);
              } else {
                setHeadlineError('Failed to generate headlines.');
                console.error("Headline Generation Error:", headlineOutcome.reason);
              }

              if (keywordOutcome.status === 'fulfilled') {
                setKeywords(keywordOutcome.value);
              } else {
                setKeywordsError('Failed to generate keywords.');
                console.error("Keyword Generation Error:", keywordOutcome.reason);
              }
            }
          }
        } catch (err) {
          console.error("Body Processing Error:", err);
          setCorrectedBodyError(err instanceof Error ? err.message : "Failed to process body text.");
        }
      })();
      tasks.push(bodyTask);
    }

    await Promise.all(tasks);
    setIsLoading(false);
  }, [originalHeadline, inputBody]);
  
  const handleExample = () => {
    const exampleHeadline = "ತಂತ್ರಜ್ಞಾನ ಶೃಂಗಸಭೆಯಲ್ಲಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಚರ್ಚೆ";
    const exampleBody = "ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಡೆದ ತಂತ್ರಜ್ಞಾನ ಶೃಂಗಸಭೆಯಲ್ಲಿ, ಪ್ರಖ್ಯಾತ ವಿಜ್ಞಾನಿ ಡಾ. ರಮೇಶ್ ಅವರು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯ ಭವಿಷ್ಯದ ಬಗ್ಗೆ ಮಾತನಾಡಿದರು. ಅವರ ಭಾಷಣವು ಸಭಿಕರನ್ನು ಮಂತ್ರಮುಗ್ಧರನ್ನಾಗಿಸಿತು. ಅವರು ನವೀನ ತಂತ್ರಜ್ಞಾನಗಳ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಒತ್ತಿ ಹೇಳಿದರು.";
    setOriginalHeadline(exampleHeadline);
    setInputBody(exampleBody);
    resetOutputs();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSecretKeySubmit = (secretKey: string) => {
    localStorage.setItem('gemini-secret-key', secretKey);
    setIsSecretKeySet(true);
  };

  const handleClearSecretKey = () => {
    localStorage.removeItem('gemini-secret-key');
    setIsSecretKeySet(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (!isSecretKeySet) {
    return <SecretKeyModal onSubmit={handleSecretKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 text-gray-800">
      <Header onClearSecretKey={handleClearSecretKey} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-screen-xl mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200/50">
          <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Curation Studio</h1>
              <p className="text-gray-600 mt-2 text-base md:text-lg max-w-4xl mx-auto">
                Enter news headline and content, and get corrected, rewritten, and suggested engaging headlines.
              </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {/* Column 1: Input */}
            <div className="flex flex-col space-y-8">
               <div className="bg-white/50 border border-gray-200/80 rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                      <NewspaperIcon className="h-6 w-6 text-teal-600" />
                      <h2 className="text-xl font-semibold text-gray-700 ml-3">Original News Content</h2>
                  </div>
                  <div className="flex flex-col space-y-4">
                      <InputText
                        value={originalHeadline}
                        onChange={(e) => setOriginalHeadline(e.target.value)}
                        placeholder="Enter headline here (ಶೀರ್ಷಿಕೆ)..."
                        disabled={isLoading}
                        aria-label="Original News Headline"
                      />
                       <div className="flex justify-end items-center -mt-2 mb-2">
                         <button 
                          onClick={handleExample}
                          className="flex items-center text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors disabled:opacity-50"
                          disabled={isLoading}
                          >
                          <SparklesIcon className="h-4 w-4 mr-1.5" />
                          Load Example
                        </button>
                      </div>
                      <InputTextArea
                        value={inputBody}
                        onChange={(e) => setInputBody(e.target.value)}
                        placeholder="Enter body text here (ಸುದ್ದಿ)..."
                        disabled={isLoading}
                        aria-label="Original News Body"
                      />
                  </div>
               </div>
            </div>

            {/* Column 2: Outputs */}
            <div className="flex flex-col space-y-8">
              <HeadlineDisplay
                headlines={headlines}
                isLoading={isLoading && !!inputBody.trim() && !headlines}
                error={headlineError}
              />
              <RewrittenTextDisplay
                  rewrittenText={rewrittenText}
                  isLoading={isLoading && !!correctedBodyData && !rewrittenText}
                  error={rewriteError}
              />
               <KeywordDisplay
                  keywords={keywords}
                  isLoading={isLoading && !!rewrittenText && !keywords}
                  error={keywordsError}
              />
               <OutputDisplay
                  title="Corrected Headline"
                  icon={<CheckBadgeIcon className="h-6 w-6 text-emerald-600" />}
                  correctionData={correctedHeadlineData}
                  isLoading={isLoading && !!originalHeadline.trim() && !correctedHeadlineData && !correctedHeadlineError}
                  error={correctedHeadlineError}
              />
              <OutputDisplay
                  title="Corrected Body"
                  icon={<CheckBadgeIcon className="h-6 w-6 text-emerald-600" />}
                  correctionData={correctedBodyData}
                  isLoading={isLoading && !!inputBody.trim() && !correctedBodyData && !correctedBodyError}
                  error={correctedBodyError}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center">
            <SubmitButton
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={(!originalHeadline.trim() && !inputBody.trim()) || isLoading}
            >
              Process Content
            </SubmitButton>
            {correctedBodyError && !isLoading && !correctedBodyData && !correctedHeadlineData && (
              <p className="text-red-600 mt-4 text-center">{correctedBodyError}</p>
            )}
          </div>
        </div>
        <footer className="text-center mt-10 space-y-1">
          <p className="text-gray-500 text-sm">© 2025 PublicNext</p>
          <p className="text-gray-400 text-xs">Version 1.0.3</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
