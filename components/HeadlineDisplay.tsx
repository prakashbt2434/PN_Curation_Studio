
import React, { useState } from 'react';
import { CopyIcon, CheckIcon, LightBulbIcon } from './Icons';

interface HeadlineDisplayProps {
  headlines: string[] | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse w-full space-y-4 p-4">
    <div className="h-5 bg-gray-200 rounded w-5/6"></div>
    <div className="h-5 bg-gray-200 rounded w-4/6"></div>
    <div className="h-5 bg-gray-200 rounded w-full"></div>
  </div>
);

export const HeadlineDisplay: React.FC<HeadlineDisplayProps> = ({ headlines, isLoading, error }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Failed to copy headline: ', err);
      alert('Failed to copy headline.');
    });
  };

  return (
    <div className="w-full bg-white/50 border border-cyan-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center p-4 bg-cyan-50/70 border-b border-cyan-200/80">
            <LightBulbIcon className="h-6 w-6 text-cyan-600"/>
            <h2 className="text-lg font-semibold text-gray-700 ml-3">Suggested Headlines</h2>
        </div>
        <div className="p-4 min-h-[150px]">
            {isLoading && <LoadingSkeleton />}
            {!isLoading && !error && !headlines && (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <p className="text-gray-500 text-center">Engaging headlines will appear here.</p>
              </div>
            )}
            {!isLoading && error && (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}
            {!isLoading && headlines && headlines.length > 0 && (
              <ul className="w-full space-y-3">
                {headlines.map((headline, index) => (
                   <li key={index} className="flex items-center space-x-3 p-3 bg-cyan-50/50 rounded-lg border border-cyan-200/60">
                      <span className="flex-shrink-0 text-sm font-bold text-cyan-700 bg-cyan-100/80 h-6 w-6 flex items-center justify-center rounded-full">
                          {index + 1}
                      </span>
                      <p className="flex-1 font-medium text-cyan-900 text-sm md:text-base">
                          {headline}
                      </p>
                      <button
                          onClick={() => handleCopy(headline, index)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                              copiedIndex === index
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-200/80 text-gray-500 hover:bg-gray-300/80'
                          }`}
                          aria-label={copiedIndex === index ? 'Copied' : `Copy headline ${index + 1}`}
                          title={copiedIndex === index ? 'Copied!' : 'Copy'}
                      >
                          {copiedIndex === index ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                      </button>
                   </li>
                ))}
              </ul>
            )}
        </div>
    </div>
  );
};
