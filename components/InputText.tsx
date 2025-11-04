
import React from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Custom props can be added here if needed in the future
}

export const InputText: React.FC<InputTextProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  ...rest
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200 text-lg leading-relaxed bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      {...rest}
    />
  );
};
