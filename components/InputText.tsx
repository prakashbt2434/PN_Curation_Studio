
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
      className="w-full p-4 border border-gray-300/80 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-200 text-base md:text-lg leading-relaxed bg-white/80 disabled:bg-gray-100/80 disabled:cursor-not-allowed placeholder-gray-400"
      {...rest}
    />
  );
};
