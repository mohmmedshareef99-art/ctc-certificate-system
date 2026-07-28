import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function CTCLogo({ className = '', size = 96 }: LogoProps) {
  return (
    <img
      src="/ctc-logo.png"
      alt="Continental Training Center Logo"
      crossOrigin="anonymous"
      width={size}
      height={size}
      className={`object-contain aspect-square shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, objectFit: 'contain', aspectRatio: '1 / 1' }}
    />
  );
}
