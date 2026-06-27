import React from 'react';
import squatImg from '../assets/images/shredded_squat_1782593043263.jpg';
import pushupImg from '../assets/images/shredded_pushup_1782593054859.jpg';
import plankImg from '../assets/images/shredded_plank_1782593066018.jpg';
import jumpingjackImg from '../assets/images/shredded_jumpingjack_1782593080486.jpg';
import lungeImg from '../assets/images/shredded_lunge_1782593093026.jpg';
import gluteImg from '../assets/images/shredded_glute_1782593103547.jpg';
import crunchImg from '../assets/images/shredded_crunch_1782593126626.jpg';
import dipImg from '../assets/images/shredded_dip_1782593137305.jpg';

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
      <div className={`relative w-[90%] h-[90%] flex items-center justify-center rounded-[inherit] overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#050508]'}`}>
        <img
          src={imgUrl}
          alt={`${pose} diagram`}
          className="w-full h-full object-cover select-none transition-all duration-300"
          referrerPolicy="no-referrer"
        />
      </div>
      {/* Dynamic tech grid or border element to enhance the RPG aesthetics */}
      <div className={`absolute inset-0 border pointer-events-none rounded-inherit ${
        isLight ? 'border-sky-500/5' : 'border-sky-500/20'
      }`} />
    </div>
  );
};
