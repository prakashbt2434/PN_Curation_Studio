
import React, { useState } from 'react';
import { CopyIcon, CheckIcon, PencilIcon } from './Icons';

interface RewrittenTextDisplayProps {
  rewrittenText: string | null;
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

const renderFormattedText = (text: string) => {
    const regex = /(### .*|\*\*.*?\*\*)/g;
    const parts = text.split(regex).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith('### ')) {
            return <h3 key={index} className="text-base font-semibold text-green-800 mt-4 mb-2">{part.substring(4)}</h3>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-green-900 bg-green-100/80 px-1 rounded">{part.substring(2, part.length - 2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

export const RewrittenTextDisplay: React.FC<RewrittenTextDisplayProps> = ({ rewrittenText, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (rewrittenText) {
      navigator.clipboard.writeText(rewrittenText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text.');
      });
    }
  };

  return (
     <div className="w-full bg-white/50 border border-green-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-green-50/70 border-b border-green-200/80">
            <div className="flex items-center">
                <PencilIcon className="h-6 w-6 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-700 ml-3">Suggested Rewrite</h2>
            </div>
            {rewrittenText && !isLoading && (
                 <button
                    onClick={handleCopy}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isCopied
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300/80'
                    }`}
                    aria-label={isCopied ? 'Copied' : 'Copy rewritten text'}
                    title={isCopied ? 'Copied!' : 'Copy'}
                  >
                    {isCopied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                </button>
            )}
        </div>
        <div className="p-4 min-h-[150px] max-h-56 overflow-y-auto">
            {isLoading && <LoadingSkeleton />}
            {!isLoading && !error && !rewrittenText && (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <p className="text-gray-500 text-center">Rewrite suggestions will appear here.</p>
              </div>
            )}
             {!isLoading && error && (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}
            {!isLoading && rewrittenText && (
              <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {renderFormattedText(rewrittenText)}
              </div>
            )}
        </div>
    </div>
  );
};
