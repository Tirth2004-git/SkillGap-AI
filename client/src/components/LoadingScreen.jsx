import React from 'react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0B0F19] z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
        {/* Inner reverse spinning ring */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-500/10 border-t-blue-400 animate-spin [animation-direction:reverse]"></div>
        {/* Center glowing dot */}
        <div className="absolute w-4 h-4 rounded-full bg-pink-500 animate-ping"></div>
      </div>
      <p className="mt-8 text-lg font-medium text-gray-300 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;
