
import React, { useState } from 'react';
import type { KeywordsResponse } from '../types';

interface KeywordDisplayProps {
  keywords: KeywordsResponse | null;
  isLoading: boolean;
  error: string | null;
}

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

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4 p-2">
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
    <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-32"></div>
        <div className="h-6 bg-gray-200 rounded-full w-40"></div>
        <div className="h-6 bg-gray-200 rounded-full w-28"></div>
    </div>
  </div>
);

export const KeywordDisplay: React.FC<KeywordDisplayProps> = ({ keywords, isLoading, error }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleCopy = () => {
        if (!keywords) return;

        const allKeywords = [
            ...keywords.shortTailKeywords,
            ...keywords.longTailKeywords
        ];
        const keywordString = allKeywords.join(', ');

        navigator.clipboard.writeText(keywordString).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy keywords:', err);
            alert('Failed to copy keywords.');
        });
    };

    return (
        <div className="w-full min-h-[180px] p-4 border border-gray-300 rounded-xl shadow-sm bg-indigo-50/50 relative">
            {isLoading && <LoadingSkeleton />}
            {!isLoading && !error && !keywords && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">SEO keywords will appear here.</p>
                </div>
            )}
            {!isLoading && error && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-red-500 text-center">{error}</p>
                </div>
            )}
            {!isLoading && keywords && (
                <>
                    <button
                        onClick={handleCopy}
                        className={`absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200 text-xs flex items-center ${
                            isCopied
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        aria-label="Copy all keywords"
                        title="Copy all keywords"
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                        <span className="ml-1.5">{isCopied ? 'Copied' : 'Copy All'}</span>
                    </button>
                    <div className="space-y-4 pr-16">
                        <div>
                            <h4 className="font-semibold text-indigo-800 mb-2">Short-tail Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywords.shortTailKeywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-800 mb-2">Long-tail Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywords.longTailKeywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
