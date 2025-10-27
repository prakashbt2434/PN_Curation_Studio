
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
      className="w-full h-full min-h-[576px] p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200 resize-none text-lg leading-relaxed bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      {...rest}
    />
  );
};