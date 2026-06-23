import React from 'react';

interface ExerciseSVGProps {
  pose: 'pushup' | 'squat' | 'plank' | 'jumpingjack' | 'crunch' | 'lunge' | 'glute' | 'dip';
  color: string;
}

export const ExerciseSVG: React.FC<ExerciseSVGProps> = ({ pose, color }) => {
  const mColor = color || '#ef4444';

  switch (pose) {
    case 'pushup':
      return (
        <svg viewBox="0 0 200 160" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <text x="100" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            MANTENHA O CORPO RETO
          </text>
          <g className="animate-[pushup_2s_ease-in-out_infinite]">
            <circle cx="100" cy="50" r="14" fill="#f3f4f6" />
            <line x1="100" y1="64" x2="100" y2="100" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="100" y1="78" x2="65" y2="95" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="78" x2="135" y2="95" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="65" y1="95" x2="58" y2="115" stroke={mColor} strokeWidth="4" strokeLinecap="round" />
            <line x1="135" y1="95" x2="142" y2="115" stroke={mColor} strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="100" x2="80" y2="130" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="100" y1="100" x2="120" y2="130" stroke="#f3f4f6" strokeWidth="5" />
            <circle cx="80" cy="133" r="5" fill="#f3f4f6" />
            <circle cx="120" cy="133" r="5" fill="#f3f4f6" />
          </g>
          <text x="100" y="155" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            PEITO · TRÍCEPS · OMBROS
          </text>
        </svg>
      );

    case 'squat':
      return (
        <svg viewBox="0 0 200 170" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <text x="100" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            JOELHOS ALINHADOS COM OS PÉS
          </text>
          <g className="animate-[squat_2s_ease-in-out_infinite]">
            <circle cx="100" cy="45" r="14" fill="#f3f4f6" />
            <line x1="100" y1="59" x2="100" y2="95" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="100" y1="75" x2="72" y2="90" stroke="#f3f4f6" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="75" x2="128" y2="90" stroke="#f3f4f6" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="95" x2="78" y2="125" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="95" x2="122" y2="125" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="78" y1="125" x2="68" y2="150" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="122" y1="125" x2="132" y2="150" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <circle cx="68" cy="153" r="5" fill="#f3f4f6" />
            <circle cx="132" cy="153" r="5" fill="#f3f4f6" />
          </g>
          <text x="100" y="168" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            QUADRÍCEPS · GLÚTEOS
          </text>
        </svg>
      );

    case 'plank':
      return (
        <svg viewBox="0 0 220 130" className="w-52 h-36 drop-shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          <text x="110" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            CORPO RETO COMO UMA PRANCHA
          </text>
          <g className="animate-[pulse_2s_ease-in-out_infinite]">
            <circle cx="170" cy="55" r="14" fill="#f3f4f6" />
            <line x1="156" y1="55" x2="55" y2="75" stroke={mColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="115" y1="65" x2="100" y2="90" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="85" y1="70" x2="70" y2="95" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="55" y1="75" x2="45" y2="100" stroke="#f3f4f6" strokeWidth="5" />
            <circle cx="45" cy="103" r="5" fill="#f3f4f6" />
            <circle cx="100" cy="93" r="5" fill="#f3f4f6" />
          </g>
          <text x="110" y="125" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            CORE · ABDÔMEN · LOMBAR
          </text>
        </svg>
      );

    case 'jumpingjack':
      return (
        <svg viewBox="0 0 200 180" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(59,130,246,0.2)]">
          <text x="100" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            MANTENHA O RITMO CONSTANTE
          </text>
          <circle cx="100" cy="42" r="14" fill="#f3f4f6" />
          <line x1="100" y1="56" x2="100" y2="105" stroke="#f3f4f6" strokeWidth="5" />
          <g className="animate-[jjArms_1s_ease-in-out_infinite] origin-[100px_72px]">
            <line x1="100" y1="72" x2="58" y2="55" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="72" x2="142" y2="55" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
          </g>
          <g className="animate-[jjLegs_1s_ease-in-out_infinite] origin-[100px_105px]">
            <line x1="100" y1="105" x2="72" y2="145" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="105" x2="128" y2="145" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <circle cx="72" cy="148" r="5" fill="#f3f4f6" />
            <circle cx="128" cy="148" r="5" fill="#f3f4f6" />
          </g>
          <text x="100" y="170" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            CORPO TODO · CARDIO
          </text>
        </svg>
      );

    case 'crunch':
      return (
        <svg viewBox="0 0 220 150" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          <text x="110" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            FOQUE NO ABDÔMEN
          </text>
          <g className="animate-[crunchRotate_2s_ease-in-out_infinite] origin-[130px_90px]">
            <circle cx="165" cy="70" r="14" fill="#f3f4f6" />
            <line x1="155" y1="82" x2="110" y2="95" stroke={mColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="165" y1="75" x2="148" y2="62" stroke="#f3f4f6" strokeWidth="4" />
            <line x1="165" y1="75" x2="178" y2="62" stroke="#f3f4f6" strokeWidth="4" />
          </g>
          <line x1="110" y1="95" x2="50" y2="100" stroke="#f3f4f6" strokeWidth="6" strokeLinecap="round" />
          <line x1="80" y1="98" x2="65" y2="125" stroke="#f3f4f6" strokeWidth="5" />
          <line x1="60" y1="99" x2="45" y2="125" stroke="#f3f4f6" strokeWidth="5" />
          <circle cx="65" cy="128" r="5" fill="#f3f4f6" />
          <circle cx="45" cy="128" r="5" fill="#f3f4f6" />
          <text x="110" y="145" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            ABDÔMEN · CORE
          </text>
        </svg>
      );

    case 'lunge':
      return (
        <svg viewBox="0 0 200 180" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <text x="100" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            JOELHO TRASEIRO PRÓXIMO AO CHÃO
          </text>
          <g className="animate-[lungeDown_2s_ease-in-out_infinite]">
            <circle cx="100" cy="45" r="14" fill="#f3f4f6" />
            <line x1="100" y1="59" x2="100" y2="100" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="100" y1="75" x2="72" y2="88" stroke="#f3f4f6" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="75" x2="128" y2="88" stroke="#f3f4f6" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="100" x2="125" y2="135" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="125" y1="135" x2="135" y2="160" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="100" x2="75" y2="120" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="75" y1="120" x2="60" y2="155" stroke="#f3f4f6" strokeWidth="5" strokeLinecap="round" />
            <circle cx="135" cy="163" r="5" fill="#f3f4f6" />
            <circle cx="60" cy="158" r="5" fill="#f3f4f6" />
          </g>
          <text x="100" y="176" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            QUADRÍCEPS · GLÚTEOS · ISQUIOTIBIAIS
          </text>
        </svg>
      );

    case 'glute':
      return (
        <svg viewBox="0 0 220 150" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <text x="110" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            CONTRAIA OS GLÚTEOS NO TOPO
          </text>
          <g className="animate-[gluteUp_2s_ease-in-out_infinite]">
            <line x1="50" y1="95" x2="170" y2="90" stroke="#f3f4f6" strokeWidth="6" strokeLinecap="round" />
            <circle cx="170" cy="90" r="14" fill="#f3f4f6" />
            <rect x="78" y="80" width="60" height="20" rx="8" fill={mColor} />
            <line x1="80" y1="95" x2="65" y2="125" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="110" y1="95" x2="110" y2="128" stroke="#f3f4f6" strokeWidth="5" />
            <circle cx="65" cy="128" r="5" fill="#f3f4f6" />
            <circle cx="110" cy="131" r="5" fill="#f3f4f6" />
            <line x1="50" y1="95" x2="38" y2="115" stroke="#f3f4f6" strokeWidth="4" />
            <circle cx="38" cy="118" r="5" fill="#f3f4f6" />
          </g>
          <text x="110" y="147" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            GLÚTEOS · ISQUIOTIBIAIS · LOMBAR
          </text>
        </svg>
      );

    case 'dip':
      return (
        <svg viewBox="0 0 220 170" className="w-48 h-36 drop-shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <text x="110" y="18" textAnchor="middle" fontSize="11" fill="#9ca3af" className="font-mono tracking-wider animate-pulse">
            FORÇA NOS TRÍCEPS PARA SUBIR
          </text>
          <rect x="30" y="110" width="35" height="50" rx="4" fill="#1e1b4b" stroke="#4b5563" strokeWidth="2" />
          <rect x="155" y="110" width="35" height="50" rx="4" fill="#1e1b4b" stroke="#4b5563" strokeWidth="2" />
          <g className="animate-[dipDown_2s_ease-in-out_infinite]">
            <circle cx="110" cy="50" r="14" fill="#f3f4f6" />
            <line x1="110" y1="64" x2="110" y2="100" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="110" y1="78" x2="65" y2="100" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="110" y1="78" x2="155" y2="100" stroke={mColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="65" y1="100" x2="65" y2="115" stroke={mColor} strokeWidth="5" />
            <line x1="155" y1="100" x2="155" y2="115" stroke={mColor} strokeWidth="5" />
            <line x1="110" y1="100" x2="88" y2="135" stroke="#f3f4f6" strokeWidth="5" />
            <line x1="110" y1="100" x2="132" y2="135" stroke="#f3f4f6" strokeWidth="5" />
            <circle cx="88" cy="138" r="5" fill="#f3f4f6" />
            <circle cx="132" cy="138" r="5" fill="#f3f4f6" />
          </g>
          <text x="110" y="167" textAnchor="middle" fontSize="10" fill={mColor} className="font-bold tracking-widest font-mono">
            TRÍCEPS · OMBROS
          </text>
        </svg>
      );

    default:
      return null;
  }
};
