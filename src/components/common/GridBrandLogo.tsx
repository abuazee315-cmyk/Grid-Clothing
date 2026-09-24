import React, { useState } from 'react';

interface GridBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GridBrandLogo: React.FC<GridBrandLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
    xl: 'w-14 h-14',
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} rounded bg-black border border-neutral-700/80 overflow-hidden flex items-center justify-center shrink-0 shadow-md group-hover:border-cyan-400 transition-all duration-200 ${className}`}
    >
      {!imgError ? (
        <img
          src="/grid-logo.jpg"
          alt="GRID CLOTHING"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1 select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="100" height="100" fill="#080808" />
          <g transform="skewX(-10) translate(8, 0)">
            <text
              x="45"
              y="48"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="38"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-1"
            >
              GRID
            </text>
            <text
              x="45"
              y="80"
              textAnchor="middle"
              fill="#22d3ee"
              fontSize="19"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.5"
            >
              CLOTHING
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};
