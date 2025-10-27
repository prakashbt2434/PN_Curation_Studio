import React from 'react';

interface HeaderProps {
    onClearSecretKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearSecretKey }) => {
  return (
    <header className="bg-teal-500 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-center relative">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          PublicNext Curation Studio
        </h1>
        <button 
            onClick={onClearSecretKey}
            className="absolute right-0 text-sm bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
            Change Secret Key
        </button>
      </div>
    </header>
  );
};