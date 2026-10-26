import React from 'react';
import { AudioManager } from '../../core/AudioManager';

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'wood' | 'ghost';
  size?: 'md' | 'lg' | 'xl';
  soundEffect?: boolean;
}

export const BigButton: React.FC<BigButtonProps> = ({
  children,
  variant = 'primary',
  size = 'lg',
  soundEffect = true,
  onClick,
  className = '',
  disabled = false,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEffect && !disabled) {
      AudioManager.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const VARIANT_STYLES = {
    primary:
      'bg-amber-400 hover:bg-amber-500 text-storybook-wood border-b-4 border-amber-600 active:border-b-0 active:translate-y-1',
    secondary:
      'bg-sky-400 hover:bg-sky-500 text-white border-b-4 border-sky-600 active:border-b-0 active:translate-y-1',
    success:
      'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1',
    wood:
      'bg-amber-100 hover:bg-amber-200 text-storybook-wood border-2 border-amber-300 border-b-4 border-b-amber-400 active:border-b-2 active:translate-y-0.5',
    ghost:
      'bg-white/80 hover:bg-white text-storybook-wood border border-amber-200 shadow-sm active:scale-95',
  };

  const SIZE_STYLES = {
    md: 'min-h-[52px] px-5 py-2.5 text-lg font-bold rounded-2xl',
    lg: 'min-h-[64px] px-7 py-3.5 text-xl font-bold rounded-3xl',
    xl: 'min-h-[76px] px-9 py-4.5 text-2xl font-extrabold rounded-3xl',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 select-none touch-manipulation
        transition-all duration-100 ease-out outline-none
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale pointer-events-none' : 'cursor-pointer active:scale-[0.98]'}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};
