
import React, { useState } from 'react';
import type { CorrectionResponse } from '../types';

interface OutputDisplayProps {
  correctionData: CorrectionResponse | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ correctionData, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (correctionData?.correctedText) {
      navigator.clipboard.writeText(correctionData.correctedText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy corrected text.');
      });
    }
  };

  const renderHighlightedText = () => {
    if (!correctionData) return null;

    const { correctedText, corrections } = correctionData;
    if (corrections.length === 0) {
      return <p>{correctedText}</p>;
    }
    
    // Create a map of corrected words for quick lookup
    const correctionMap = new Map<string, string>();
    corrections.forEach(c => correctionMap.set(c.corrected, c.original));

    // A simple regex to split text by spaces and punctuation, keeping the delimiters
    const wordsAndDelimiters = correctedText.split(/(\s+|[.,!?;:])/).filter(Boolean);

    return wordsAndDelimiters.map((part, index) => {
      if (correctionMap.has(part)) {
        return (
          <span key={index} className="bg-yellow-200 text-yellow-900 rounded-md px-1 py-0.5 font-medium cursor-pointer" title={`Original: ${correctionMap.get(part)}`}>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full h-56 p-4 border border-gray-300 rounded-xl shadow-sm bg-emerald-50/50 relative overflow-y-auto">
      {correctionData && !isLoading && (
         <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
              isCopied
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            aria-label={isCopied ? 'Copied' : 'Copy corrected text'}
            title={isCopied ? 'Copied!' : 'Copy'}
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !error && !correctionData && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">Corrected text will appear here.</p>
        </div>
      )}
       {!isLoading && error && (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      )}
      {!isLoading && correctionData && (
        <div className="text-lg leading-relaxed pr-8">
          {correctionData.corrections.length > 0 ? (
             <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-r-lg">
                <p className="font-semibold">Corrections Made: {correctionData.corrections.length}</p>
                <p className="text-sm">Hover over highlighted words to see the original.</p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-r-lg">
                <p className="font-semibold">No spelling errors found!</p>
            </div>
          )}
          <div className="whitespace-pre-wrap">{renderHighlightedText()}</div>
        </div>
      )}
    </div>
  );
};
