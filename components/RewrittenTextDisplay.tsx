import React, { useState } from 'react';

interface RewrittenTextDisplayProps {
  rewrittenText: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const renderFormattedText = (text: string) => {
    // Regex to capture ### titles and **bold** text
    const regex = /(### .*|\*\*.*?\*\*)/g;
    const parts = text.split(regex).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-semibold text-green-800 mt-4 mb-2">{part.substring(4)}</h3>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-green-900">{part.substring(2, part.length - 2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

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
    <div className="w-full h-56 p-4 border border-gray-300 rounded-xl shadow-sm bg-green-50/50 relative overflow-y-auto">
      {rewrittenText && !isLoading && (
         <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
              isCopied
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            aria-label={isCopied ? 'Copied' : 'Copy rewritten text'}
            title={isCopied ? 'Copied!' : 'Copy'}
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !error && !rewrittenText && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">Rewrite suggestions will appear here.</p>
        </div>
      )}
       {!isLoading && error && (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      )}
      {!isLoading && rewrittenText && (
        <div className="text-lg leading-relaxed whitespace-pre-wrap pr-8">
          {renderFormattedText(rewrittenText)}
        </div>
      )}
    </div>
  );
};