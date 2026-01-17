
import React, { useEffect, useState } from 'react';

interface SaharGreetingProps {
  onComplete: () => void;
}

const SaharGreeting: React.FC<SaharGreetingProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Allow fade-out animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
      <div className="text-center">
        <h1 className="surprise-text text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 drop-shadow-2xl mb-4">
          مرحبا يا سهر
        </h1>
        <p className="surprise-text delay-500 opacity-0 text-gray-400 text-lg mt-2">
          ياسين مستنيكي في عالم الأنمي..
        </p>
      </div>
    </div>
  );
};

export default SaharGreeting;
