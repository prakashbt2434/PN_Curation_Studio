
import React from 'react';

interface InputTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Add any custom props here if needed
}

export const InputTextArea: React.FC<InputTextAreaProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  ...rest
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full h-full min-h-[400px] p-4 border border-gray-300/80 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-200 resize-none text-base md:text-lg leading-relaxed bg-white/80 disabled:bg-gray-100/80 disabled:cursor-not-allowed placeholder-gray-400"
      {...rest}
    />
  );
};
