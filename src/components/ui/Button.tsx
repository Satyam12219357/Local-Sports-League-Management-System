import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ease-in-out';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 border-transparent text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 border-transparent text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 border-transparent text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 border-transparent text-white focus:ring-red-500',
    outline: 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${(disabled || isLoading) ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;