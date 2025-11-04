
import React, { useState } from 'react';

interface SecretKeyModalProps {
  onSubmit: (secretKey: string) => void;
}

export const SecretKeyModal: React.FC<SecretKeyModalProps> = ({ onSubmit }) => {
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey.trim()) {
      onSubmit(secretKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <div className="flex flex-col items-center justify-center mb-6">
             <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Enter Your Secret Key
            </h2>
            <p className="text-center text-gray-500 mt-1">
              Please provide your Secret Key to use the Curation Studio.
            </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="secret-key"
              className="sr-only"
            >
              Secret Key
            </label>
            <input
              id="secret-key"
              name="secret-key"
              type="password"
              required
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300/80 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center"
              placeholder="Enter your Secret Key here"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-105"
            >
              Save and Continue
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center space-y-2">
            <p>Your Secret Key is stored locally in your browser and is not sent to our servers.</p>
            <p className="font-medium text-gray-600">To get a Secret Key, please contact your company administrator.</p>
        </div>
      </div>
    </div>
  );
};
