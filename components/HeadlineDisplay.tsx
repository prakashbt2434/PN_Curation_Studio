import React, { useState } from 'react';

interface HeadlineDisplayProps {
  headlines: string[] | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse w-full space-y-3 p-2">
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
  </div>
);

const headlineTypes = [
    { title: 'Option 1', color: 'bg-teal-100 text-teal-800' },
    { title: 'Option 2', color: 'bg-cyan-100 text-cyan-800' },
    { title: 'Option 3', color: 'bg-emerald-100 text-emerald-800' },
];

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
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
    <div className="w-full min-h-[72px] p-4 border border-gray-300 rounded-xl shadow-sm bg-cyan-50/50 relative flex items-center justify-center">
      {isLoading && <LoadingSkeleton />}
      {!isLoading && !error && !headlines && (
        <p className="text-gray-500 text-center">Catchy headlines will appear here.</p>
      )}
      {!isLoading && error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
      {!isLoading && headlines && headlines.length > 0 && (
        <div className="w-full space-y-3">
          {headlines.map((headline, index) => (
             <div key={index} className="flex items-center space-x-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${headlineTypes[index]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {headlineTypes[index]?.title || `Option ${index + 1}`}
                </span>
                <p className="flex-1 font-semibold text-cyan-900 text-sm md:text-base">
                    {headline}
                </p>
                <button
                    onClick={() => handleCopy(headline, index)}
                    className={`p-1.5 rounded-md transition-all duration-200 ${
                        copiedIndex === index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                    aria-label={copiedIndex === index ? 'Copied' : `Copy headline ${index + 1}`}
                    title={copiedIndex === index ? 'Copied!' : 'Copy'}
                >
                    {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                </button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};