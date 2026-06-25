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

export const ExerciseIcon: React.FC<ExerciseIconProps> = ({ pose, className = '', size = 'md' }) => {
  const imgUrl = imageMap[pose] || imageMap.pushup;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden border border-sky-500/20 bg-black/60 shadow-[0_0_8px_rgba(14,165,233,0.1)] shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <img
        src={imgUrl}
        alt={`${pose} diagram`}
        className="w-[90%] h-[90%] object-contain select-none transition-all duration-300"
        style={{
          // Expert CSS Filter:
          // 1. Inverts the colors (white background -> black, black lines -> white)
          // 2. Sepia turns it warm yellow/brown
          // 3. Saturate increases the intensity
          // 4. Hue-rotate shifts the color to a beautiful cybernetic neon cyan/sky-blue
          filter: 'invert(1) sepia(1) saturate(8) hue-rotate(170deg) brightness(0.9) contrast(1.1)',
        }}
        referrerPolicy="no-referrer"
      />
      {/* Dynamic tech grid or border element to enhance the RPG aesthetics */}
      <div className="absolute inset-0 border border-sky-500/10 pointer-events-none rounded-inherit" />
    </div>
  );
};
