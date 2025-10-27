
import React from 'react';

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

export const HeadlineDisplay: React.FC<HeadlineDisplayProps> = ({ headlines, isLoading, error }) => {
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
             <div key={index} className="flex items-start space-x-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${headlineTypes[index]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {headlineTypes[index]?.title || `Option ${index + 1}`}
                </span>
                <p className="flex-1 font-semibold text-cyan-900 text-sm md:text-base">
                    {headline}
                </p>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};