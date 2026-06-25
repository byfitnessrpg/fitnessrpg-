import React from 'react';
import squatImg from '../assets/images/squat_exercise_1782318778947.jpg';
import pushupImg from '../assets/images/pushup_exercise_1782318840082.jpg';
import plankImg from '../assets/images/plank_exercise_1782318917661.jpg';
import jumpingjackImg from '../assets/images/jumpingjack_exercise_1782318932645.jpg';
import lungeImg from '../assets/images/lunge_exercise_1782318948023.jpg';
import gluteImg from '../assets/images/glute_exercise_1782318962922.jpg';
import crunchImg from '../assets/images/crunch_exercise_1782318976830.jpg';
import dipImg from '../assets/images/dip_exercise_1782318990232.jpg';

interface ExerciseIconProps {
  pose: 'pushup' | 'squat' | 'plank' | 'jumpingjack' | 'crunch' | 'lunge' | 'glute' | 'dip' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

const imageMap: Record<string, string> = {
  squat: squatImg,
  pushup: pushupImg,
  plank: plankImg,
  jumpingjack: jumpingjackImg,
  lunge: lungeImg,
  glute: gluteImg,
  crunch: crunchImg,
  dip: dipImg,
};

export const ExerciseIcon: React.FC<ExerciseIconProps> = ({ pose, className = '', size = 'md', theme = 'dark' }) => {
  const imgUrl = imageMap[pose] || imageMap.pushup;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  const isLight = theme === 'light';

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden border shrink-0 ${sizeClasses[size]} ${
        isLight 
          ? 'border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]' 
          : 'border-sky-500/20 bg-black/60 shadow-[0_0_8px_rgba(14,165,233,0.1)]'
      } ${className}`}
    >
      <div className={`relative w-[90%] h-[90%] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-black'}`}>
        <img
          src={imgUrl}
          alt={`${pose} diagram`}
          className="w-full h-full object-contain select-none transition-all duration-300"
          style={{
            filter: isLight
              ? 'grayscale(100%) contrast(300%)' // Converts red highlights and black lines to solid black outlines on white background
              : 'grayscale(100%) contrast(300%) invert(1)', // Converts red and outlines to crisp white outlines on black background
          }}
          referrerPolicy="no-referrer"
        />
        {isLight ? (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: '#1e3a8a', // Deep intense dark blue (blue-900) to make the outlines perfectly solid, clear dark blue
              mixBlendMode: 'screen',
            }}
          />
        ) : (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: '#00d8ff', // Bright, intense Solo Leveling style neon cyan-blue
              mixBlendMode: 'multiply',
            }}
          />
        )}
      </div>
      {/* Dynamic tech grid or border element to enhance the RPG aesthetics */}
      <div className={`absolute inset-0 border pointer-events-none rounded-inherit ${
        isLight ? 'border-sky-500/5' : 'border-sky-500/10'
      }`} />
    </div>
  );
};
