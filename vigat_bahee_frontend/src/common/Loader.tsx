// src/components/common/Loader.tsx
import React from 'react';
import { FourSquare } from 'react-loading-indicators';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  colors?: string[];
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  colors = ["#32cd32", "#327fcd", "#cd32cd", "#cd8032"],
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const sizeMap = {
    small: 30,
    medium: 50,
    large: 80
  };

  const loaderSize = sizeMap[size];

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <FourSquare 
        color={colors}
        size={loaderSize}
        speedPlus={-1}
      />
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
export default Loader;