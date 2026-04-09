import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'secondary', className = '', children, ...props }: ButtonProps): JSX.Element {
  const base = 'w-full rounded-xl px-3 py-2 text-sm font-medium transition-opacity disabled:opacity-50';
  const styles: Record<string, string> = {
    primary: 'bg-white text-black border border-border',
    secondary: 'bg-transparent text-text border border-border',
    danger: 'bg-transparent text-red-400 border border-[#7a1a1a]',
  };

  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
