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
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-teal-600 mb-2">
          Enter Your Secret Key
        </h2>
        <p className="text-center text-gray-500 mb-6">
          To use the Curating Studio, please provide your Secret Key.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="secret-key"
              className="block text-sm font-medium text-gray-700 sr-only"
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
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your Secret Key here"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-105"
            >
              Save and Continue
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center space-y-2">
            <p>Your Secret Key is stored in your browser's local storage for convenience and is never sent to our servers.</p>
            <p className="font-medium text-gray-600">To get a Secret Key, please contact your company administrator.</p>
        </div>
      </div>
    </div>
  );
};