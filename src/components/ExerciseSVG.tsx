import React from 'react';

import squatImg from '../assets/images/shredded_squat_1782593043263.jpg';
import pushupImg from '../assets/images/shredded_pushup_1782593054859.jpg';
import plankImg from '../assets/images/shredded_plank_1782593066018.jpg';
import jumpingjackImg from '../assets/images/shredded_jumpingjack_1782593080486.jpg';
import lungeImg from '../assets/images/shredded_lunge_1782593093026.jpg';
import gluteImg from '../assets/images/shredded_glute_1782593103547.jpg';
import crunchImg from '../assets/images/shredded_crunch_1782593126626.jpg';
import dipImg from '../assets/images/shredded_dip_1782593137305.jpg';

interface ExerciseSVGProps {
  pose: 'pushup' | 'squat' | 'plank' | 'jumpingjack' | 'crunch' | 'lunge' | 'glute' | 'dip';
  color: string;
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

const labelMap: Record<string, { tip: string; muscles: string }> = {
  pushup: { tip: 'MANTENHA O CORPO RETO', muscles: 'PEITO · TRÍCEPS · OMBROS' },
  squat: { tip: 'JOELHOS ALINHADOS COM OS PÉS', muscles: 'QUADRÍCEPS · GLÚTEOS' },
  plank: { tip: 'CORPO RETO COMO UMA PRANCHA', muscles: 'CORE · ABDÔMEN · LOMBAR' },
  jumpingjack: { tip: 'MANTENHA O RITMO CONSTANTE', muscles: 'CORPO TODO · CARDIO' },
  crunch: { tip: 'FOQUE NO ABDÔMEN', muscles: 'ABDÔMEN · CORE' },
  lunge: { tip: 'JOELHO TRASEIRO PRÓXIMO AO CHÃO', muscles: 'QUADRÍCEPS · GLÚTEOS · ISQUIOTIBIAIS' },
  glute: { tip: 'CONTRAIA OS GLÚTEOS NO TOPO', muscles: 'GLÚTEOS · ISQUIOTIBIAIS · LOMBAR' },
  dip: { tip: 'FORÇA NOS TRÍCEPS PARA SUBIR', muscles: 'TRÍCEPS · OMBROS' },
};

export const ExerciseSVG: React.FC<ExerciseSVGProps> = ({ pose, color }) => {
  const mColor = color || '#00d8ff';
  const imgUrl = imageMap[pose];
  const info = labelMap[pose] || { tip: 'EXECUTE COM ATENÇÃO', muscles: '' };

  if (imgUrl) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-2 w-full">
        <span className="text-[11px] text-slate-400 font-mono tracking-wider animate-pulse text-center px-4 uppercase">
          {info.tip}
        </span>
        <div 
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 bg-black/40 shadow-2xl transition-all"
          style={{ borderColor: mColor, boxShadow: `0 0 25px ${mColor}20` }}
        >
          <img
            src={imgUrl}
            alt={`${pose} diagram`}
            className="w-full h-full object-contain select-none bg-black"
            referrerPolicy="no-referrer"
          />
        </div>
        {info.muscles && (
          <span className="text-[10px] text-center font-bold tracking-widest font-mono uppercase" style={{ color: mColor }}>
            {info.muscles}
          </span>
        )}
      </div>
    );
  }

  // Fallback if image map entry isn't found
  return null;
};
