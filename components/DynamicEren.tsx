
import React from 'react';
import { ErenMood, AppTheme } from '../types';

interface DynamicErenProps {
  mood: ErenMood;
  theme: AppTheme;
}

const themeImages: Record<AppTheme, string> = {
  'إيرين': "https://i.pinimg.com/736x/8e/3c/6e/8e3c6e4e0a7a3b3f6e1f3a2c2b3e4f5a.jpg",
  'ساكورا': "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop",
  'ليل': "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
  'محيط': "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop"
};

const DynamicEren: React.FC<DynamicErenProps> = ({ mood, theme }) => {
  const currentImage = themeImages[theme] || themeImages['إيرين'];

  return (
    <div className="eren-bg-container">
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none z-[5]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-[1]"></div>
      
      {/* Background Image with transitions */}
      <img 
        src={currentImage} 
        alt="Yassin Theme Background" 
        className={`eren-image eren-float transition-all duration-1000 ease-in-out eren-mood-${mood}`}
      />

      {/* Theme specific overlays */}
      {theme === 'ساكورا' && <div className="absolute inset-0 z-[2] bg-pink-500/5 mix-blend-soft-light pointer-events-none"></div>}
      {theme === 'محيط' && <div className="absolute inset-0 z-[2] bg-blue-500/10 mix-blend-overlay pointer-events-none"></div>}
      {theme === 'ليل' && <div className="absolute inset-0 z-[2] bg-indigo-900/10 mix-blend-multiply pointer-events-none"></div>}

      {/* Mood specific effects */}
      {mood === 'intense' && <div className="absolute inset-0 z-[3] bg-red-600/10 mix-blend-overlay animate-pulse pointer-events-none"></div>}
      {mood === 'epic' && <div className="absolute inset-0 z-[3] bg-yellow-500/10 mix-blend-color-dodge animate-pulse pointer-events-none"></div>}
      {mood === 'dark' && <div className="absolute inset-0 z-[3] bg-black/40 mix-blend-multiply pointer-events-none"></div>}

      <div className="absolute inset-0 z-[4] shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none"></div>
    </div>
  );
};

export default DynamicEren;
