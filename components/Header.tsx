import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-teal-500 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-center relative">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          PublicNext Curation Studio
        </h1>
      </div>
    </header>
  );
};