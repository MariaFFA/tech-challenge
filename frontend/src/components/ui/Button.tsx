import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = clsx(
      'inline-flex items-center justify-center font-medium rounded-lg',
      'border border-transparent',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-all duration-200 ease-in-out',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      'relative',
      {
        'px-2.5 py-1.5 text-xs': size === 'xs',
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-2 text-sm': size === 'md',
        'px-4 py-2 text-base': size === 'lg',
        'px-6 py-3 text-lg': size === 'xl',
      },
      {
        // Primary
        'bg-primary-600 text-white shadow-sm': variant === 'primary',
        'hover:bg-primary-700 hover:shadow-md': variant === 'primary' && !disabled && !isLoading,
        'active:bg-primary-800': variant === 'primary' && !disabled && !isLoading,

        // Secondary
        'bg-secondary-100 text-secondary-900 border-secondary-200': variant === 'secondary',
        'hover:bg-secondary-200 hover:border-secondary-300': variant === 'secondary' && !disabled && !isLoading,
        'active:bg-secondary-300': variant === 'secondary' && !disabled && !isLoading,

        // Outline
        'bg-transparent text-primary-700 border-primary-300': variant === 'outline',
        'hover:bg-primary-50 hover:border-primary-400': variant === 'outline' && !disabled && !isLoading,
        'active:bg-primary-100': variant === 'outline' && !disabled && !isLoading,

        // Ghost
        'bg-transparent text-secondary-700': variant === 'ghost',
        'hover:bg-secondary-100 hover:text-secondary-900': variant === 'ghost' && !disabled && !isLoading,
        'active:bg-secondary-200': variant === 'ghost' && !disabled && !isLoading,

        // Danger
        'bg-error-600 text-white shadow-sm': variant === 'danger',
        'hover:bg-error-700 hover:shadow-md': variant === 'danger' && !disabled && !isLoading,
        'focus:ring-error-500': variant === 'danger',
        'active:bg-error-800': variant === 'danger' && !disabled && !isLoading,

        // CORREÇÃO FINAL: Chaves de foco combinadas para evitar duplicação
        'focus:ring-primary-500': variant === 'primary' || variant === 'outline',
        'focus:ring-secondary-500': variant === 'secondary' || variant === 'ghost',
      },
      { 'w-full': fullWidth },
      { 'cursor-wait': isLoading },
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {leftIcon && !isLoading && (
          <span className="mr-2 -ml-0.5 flex-shrink-0">
            {leftIcon}
          </span>
        )}

        <span className={clsx(isLoading && 'invisible')}>
          {children}
        </span>

        {rightIcon && !isLoading && (
          <span className="ml-2 -mr-0.5 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;