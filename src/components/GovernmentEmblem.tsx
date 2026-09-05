import React from 'react';

export const GovernmentEmblem: React.FC<{
  className?: string;
  size?: number;
  mono?: boolean;
  color?: string;
  white?: boolean;
}> = ({ className = 'w-16 h-16', size = 64, mono = false, color, white = false }) => {
  const isWhite = white || color === '#ffffff' || color === 'white';

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/sindh_logo.svg"
        alt="Government of Sindh Coat of Arms"
        width={size}
        height={size}
        className={`object-contain transition-all ${
          isWhite ? 'brightness-0 invert' : mono ? 'contrast-200 grayscale' : ''
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: `${size}px`,
          maxHeight: `${size}px`,
        }}
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};
