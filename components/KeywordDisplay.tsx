
import React, { useState } from 'react';
import type { KeywordsResponse } from '../types';
import { CopyIcon, CheckIcon, TagIcon } from './Icons';

interface KeywordDisplayProps {
  keywords: KeywordsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
    <div className="flex flex-wrap gap-2">
        <div className="h-7 bg-gray-200 rounded-full w-20"></div>
        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
        <div className="h-7 bg-gray-200 rounded-full w-16"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mt-4 mb-3"></div>
    <div className="flex flex-wrap gap-2">
        <div className="h-7 bg-gray-200 rounded-full w-32"></div>
        <div className="h-7 bg-gray-200 rounded-full w-40"></div>
        <div className="h-7 bg-gray-200 rounded-full w-28"></div>
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
        <div className="w-full bg-white/50 border border-indigo-200/80 rounded-xl shadow-sm overflow-hidden">
             <div className="flex items-center justify-between p-4 bg-indigo-50/70 border-b border-indigo-200/80">
                <div className="flex items-center">
                    <TagIcon className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-700 ml-3">SEO Keywords</h2>
                </div>
                 {keywords && !isLoading && (
                    <button
                        onClick={handleCopy}
                        className={`p-2 rounded-full transition-all duration-200 ${
                            isCopied
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300/80'
                        }`}
                        aria-label="Copy all keywords"
                        title="Copy all keywords"
                    >
                        {isCopied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                    </button>
                 )}
            </div>
            <div className="p-4 min-h-[180px]">
                {isLoading && <LoadingSkeleton />}
                {!isLoading && !error && !keywords && (
                    <div className="flex items-center justify-center h-full min-h-[150px]">
                        <p className="text-gray-500 text-center">SEO keywords will appear here.</p>
                    </div>
                )}
                {!isLoading && error && (
                    <div className="flex items-center justify-center h-full min-h-[150px]">
                        <p className="text-red-500 text-center">{error}</p>
                    </div>
                )}
                {!isLoading && keywords && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Short-tail Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywords.shortTailKeywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full border border-indigo-200/80">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Long-tail Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywords.longTailKeywords.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full border border-purple-200/80">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
