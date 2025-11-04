
import React from 'react';
import { Spinner } from './Spinner';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center justify-center h-14 w-64 text-lg bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
    >
      {isLoading ? (
        <>
          <Spinner />
          <span className="ml-3">Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
