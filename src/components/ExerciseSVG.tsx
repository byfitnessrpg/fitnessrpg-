import React from 'react';

import squatImg from '../assets/images/squat_exercise_1782318778947.jpg';
import pushupImg from '../assets/images/pushup_exercise_1782318840082.jpg';
import plankImg from '../assets/images/plank_exercise_1782318917661.jpg';
import jumpingjackImg from '../assets/images/jumpingjack_exercise_1782318932645.jpg';
import lungeImg from '../assets/images/lunge_exercise_1782318948023.jpg';
import gluteImg from '../assets/images/glute_exercise_1782318962922.jpg';
import crunchImg from '../assets/images/crunch_exercise_1782318976830.jpg';
import dipImg from '../assets/images/dip_exercise_1782318990232.jpg';

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
  const mColor = color || '#ef4444';
  const imgUrl = imageMap[pose];
  const info = labelMap[pose] || { tip: 'EXECUTE COM ATENÇÃO', muscles: '' };

  if (imgUrl) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-2 w-full">
        <span className="text-[11px] text-slate-400 font-mono tracking-wider animate-pulse text-center px-4">
          {info.tip}
        </span>
        <div 
          className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 bg-white shadow-xl transition-all"
          style={{ borderColor: mColor, boxShadow: `0 0 25px ${mColor}30` }}
        >
          <img
            src={imgUrl}
            alt={`${pose} diagram`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        {info.muscles && (
          <span className="text-[10px] text-center font-bold tracking-widest font-mono" style={{ color: mColor }}>
            {info.muscles}
          </span>
        )}
      </div>
    );
  }

  // Fallback if image map entry isn't found
  return null;
};
