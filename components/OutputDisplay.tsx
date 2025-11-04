
import React, { useState } from 'react';
import type { CorrectionResponse } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface OutputDisplayProps {
  title: string;
  icon: React.ReactNode;
  correctionData: CorrectionResponse | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3 p-4">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ title, icon, correctionData, isLoading, error }) => {
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
    
    const originalWordsQueue = new Map<string, string[]>();
    corrections.forEach(c => {
        const originals = originalWordsQueue.get(c.corrected) || [];
        originals.push(c.original);
        originalWordsQueue.set(c.corrected, originals);
    });

    const wordsAndDelimiters = correctedText.split(/(\s+|[.,!?;:])/).filter(Boolean);

    return wordsAndDelimiters.map((part, index) => {
      const originals = originalWordsQueue.get(part);

      if (originals && originals.length > 0) {
        const originalWord = originals.shift(); 
        return (
          <span key={index} className="bg-yellow-200 text-yellow-900 rounded-md px-1 py-0.5 font-medium cursor-pointer relative group">
            {part}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Original: {originalWord}
            </span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full bg-white/50 border border-emerald-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-emerald-50/70 border-b border-emerald-200/80">
            <div className="flex items-center">
                {icon}
                <h2 className="text-lg font-semibold text-gray-700 ml-3">{title}</h2>
            </div>
            {correctionData && !isLoading && (
                 <button
                    onClick={handleCopy}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isCopied
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300/80'
                    }`}
                    aria-label={isCopied ? 'Copied' : 'Copy corrected text'}
                    title={isCopied ? 'Copied!' : 'Copy'}
                  >
                    {isCopied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                </button>
            )}
        </div>
        <div className="p-4 min-h-[120px] max-h-56 overflow-y-auto">
            {isLoading && <LoadingSkeleton />}
            {!isLoading && !error && !correctionData && (
              <div className="flex items-center justify-center h-full min-h-[80px]">
                <p className="text-gray-500 text-center">Corrected text will appear here.</p>
              </div>
            )}
             {!isLoading && error && (
              <div className="flex items-center justify-center h-full min-h-[80px]">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}
            {!isLoading && correctionData && (
              <div className="text-base md:text-lg leading-relaxed">
                {correctionData.corrections.length > 0 ? (
                   <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-r-lg text-sm">
                      <p><span className="font-semibold">{correctionData.corrections.length}</span> corrections made. Hover over highlights to see original.</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-r-lg text-sm">
                      <p className="font-semibold">No spelling errors found!</p>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{renderHighlightedText()}</div>
              </div>
            )}
        </div>
    </div>
  );
};
