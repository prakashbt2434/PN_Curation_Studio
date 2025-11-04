
import React from 'react';

interface HeaderProps {
    onClearSecretKey: () => void;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onClearSecretKey }) => {
  return (
    <header className="bg-gradient-to-r from-teal-500 to-green-500 shadow-md p-4 sticky top-0 z-10 border-b border-white/20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide ml-3">
              PublicNext
            </h1>
        </div>
        <button 
            onClick={onClearSecretKey}
            className="flex items-center text-sm bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
            <LockIcon />
            Change Secret Key
        </button>
      </div>
    </header>
  );
};
