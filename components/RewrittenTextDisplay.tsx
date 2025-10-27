
import React from 'react';

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


export const RewrittenTextDisplay: React.FC<RewrittenTextDisplayProps> = ({ rewrittenText, isLoading, error }) => {
  return (
    <div className="w-full h-56 p-4 border border-gray-300 rounded-xl shadow-sm bg-green-50/50 relative overflow-y-auto">
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
        <div className="text-lg leading-relaxed whitespace-pre-wrap">
          {renderFormattedText(rewrittenText)}
        </div>
      )}
    </div>
  );
};