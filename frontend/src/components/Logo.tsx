import vermerLogoFull from 'figma:asset/9ff15ae8c40c117941b9a2e4108fd0cf3e6a7edf.png';
import vermerLogoIcon from 'figma:asset/2cbbe27ae20e8f5f2307fcbc1f4fafe08a8774e9.png';

interface LogoProps {
  variant?: 'icon' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: variant === 'icon' ? 'h-6 w-6' : 'h-6',
    md: variant === 'icon' ? 'h-8 w-8' : 'h-8', 
    lg: variant === 'icon' ? 'h-10 w-10' : 'h-10',
    xl: variant === 'icon' ? 'h-12 w-12' : 'h-12',
  };

  const logoSrc = variant === 'icon' ? vermerLogoIcon : vermerLogoFull;

  return (
    <img 
      src={logoSrc} 
      alt="VERMER - Microcréditos Rurales" 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
