import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, Flame, Sparkles, User, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import fitnessRpgLogo from '../assets/images/fitness_rpg_exact_logo_1782332014254.jpg';

interface AuthScreenProps {
  onSuccess: (user: any) => void;
  onShowModal: (msg: string) => void;
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onShowModal, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [charName, setCharName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        onSuccess(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!charName.trim()) {
      setErrorMsg('Por favor, escolha o seu Nome de Caçador.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            char_name: charName.trim(),
          }
        }
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        if (data?.session) {
          onSuccess(data.user);
        } else {
          onShowModal('Cadastro realizado com sucesso! Faça login para começar a sua jornada no FitnessRPG.');
          setIsRegistering(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 flex flex-col justify-between overflow-hidden relative font-sans">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-[#0a0f18]/90 border border-sky-400/30 text-sky-400 hover:text-sky-300 transition-all active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.2)] flex items-center justify-center"
          title="Voltar para a Avaliação"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      {/* Decorative background grid and soft glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. DARK HORIZONTAL BANNER WITH GLOWING NEON CYAN RINGS (Just like the user's uploaded image) */}
      <div className="w-full bg-[#0a0f18] border-y border-slate-900/50 relative h-48 flex items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9),_0_10px_30px_rgba(0,0,0,0.06)] shrink-0">
        {/* Futuristic glowing neon rings */}
        <div className="absolute w-[280px] h-[280px] rounded-full border border-sky-400/25 blur-[1.5px] -left-10 top-[-60px] animate-[pulse_6s_infinite_ease-in-out] pointer-events-none" />
        <div className="absolute w-[240px] h-[240px] rounded-full border border-cyan-400/20 blur-[2px] -right-6 bottom-[-50px] pointer-events-none" />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-blue-400/10 blur-[1px] left-1/4 top-4 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent pointer-events-none" />

        {/* Logo sitting centered over the dark banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-40 h-40 bg-[#020204] rounded-[2rem] overflow-hidden flex items-center justify-center shadow-[0_12px_45px_rgba(14,165,233,0.45),_0_0_20px_rgba(14,165,233,0.15)] border border-sky-400/30 relative z-20"
        >
          <img 
            src={fitnessRpgLogo} 
            alt="Fitness RPG Logo" 
            className="w-full h-full object-cover scale-[1.03]" 
            referrerPolicy="no-referrer" 
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-[2rem] border border-dashed border-sky-400/20 m-1.5 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* 2. BRAND TITLES & SWORD SEPARATOR (Matching style image) */}
      <div className="flex flex-col items-center text-center mt-6 relative z-10 shrink-0">
        <h2 className="text-base font-black tracking-[0.35em] text-[#0f172a] uppercase font-sans">
          FITNESS
        </h2>
        
        {/* Custom exquisite vector sword separator */}
        <svg viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-60 h-5 text-slate-800 my-1 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          <path d="M 10,10 L 110,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
          
          <path d="M 190,10 L 290,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <circle cx="290" cy="10" r="1.5" fill="currentColor" opacity="0.5" />

          {/* Sword detail */}
          <circle cx="120" cy="10" r="1.5" fill="currentColor" />
          <line x1="122" y1="10" x2="132" y2="10" stroke="currentColor" strokeWidth="2" />
          <path d="M 132,5 L 132,15 M 131,5 L 129,4 M 131,15 L 129,16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 132,8 L 175,8 L 180,10 L 175,12 L 132,12 Z" fill="currentColor" />
          <line x1="132" y1="10" x2="175" y2="10" stroke="white" strokeWidth="0.5" opacity="0.4" />
        </svg>

        <h1 className="text-5xl font-extrabold font-serif italic text-slate-900 tracking-wide select-none">
          RPG
        </h1>
        
        <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase mt-2">
          SISTEMA DE TREINAMENTO ATIVO
        </p>
      </div>

      {/* 3. SLEEK OBSIDIAN FORM CARD */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 relative z-10 mt-8">
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="w-full max-w-sm bg-[#06080d]/95 border border-slate-900 rounded-[2rem] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35),_0_0_25px_rgba(14,165,233,0.06)] relative text-slate-100"
        >
          {/* Top category pill */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-sky-500/30 px-4 py-0.5 rounded-full text-[9px] font-bold font-mono text-sky-400 tracking-widest uppercase flex items-center gap-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            <Flame className="w-3 h-3 text-sky-400 animate-pulse" />
            {isRegistering ? 'REGISTRAR NOVO HERÓI' : 'ACESSAR JORNADA'}
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4 pt-2">
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 mb-1 uppercase">
                  Nome de Caçador (Como quer ser chamado?)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Seu codinome lendário"
                    value={charName}
                    onChange={(e) => setCharName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-[#0d111a] border border-slate-800/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-xs text-white placeholder-slate-600 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 mb-1 uppercase">
                E-mail do Guerreiro
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="exemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0d111a] border border-slate-800/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-xs text-white placeholder-slate-600 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono font-bold tracking-wider text-slate-400 mb-1 uppercase">
                Chave de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Digite sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0d111a] border border-slate-800/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-xs text-white placeholder-slate-600 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-xl text-center font-mono leading-relaxed"
              >
                {errorMsg}
              </motion.div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              {!isRegistering ? (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black font-mono text-xs tracking-widest uppercase rounded-xl shadow-[0_4px_15px_rgba(14,165,233,0.35)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        INICIAR JORNADA
                        <Flame className="w-3.5 h-3.5 fill-current text-white" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setErrorMsg('');
                    }}
                    className="w-full py-2.5 bg-transparent hover:bg-slate-900/50 border border-slate-800/80 text-sky-400 hover:text-sky-300 font-bold rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer"
                  >
                    Registrar Nova Licença
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black font-mono text-xs tracking-widest uppercase rounded-xl shadow-[0_4px_15px_rgba(14,165,233,0.35)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        CRIAR PERSONAGEM
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setErrorMsg('');
                    }}
                    className="w-full py-2.5 bg-transparent hover:bg-slate-900/50 border border-slate-800/80 text-slate-400 hover:text-slate-300 font-bold rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer"
                  >
                    Voltar para o Login
                  </button>
                </>
              )}
            </div>
          </form>
        </motion.div>

        {/* Game Master warning decree */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="w-full max-w-sm mt-4 bg-amber-400 border border-amber-500 rounded-2xl p-3.5 text-center relative overflow-hidden shadow-[0_6px_20px_rgba(245,158,11,0.15)]"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-[30px] pointer-events-none" />
          
          <div className="flex items-center justify-center gap-1.5 text-amber-950 mb-1">
            <Shield className="w-3.5 h-3.5 animate-pulse text-amber-950" />
            <span className="text-[9px] font-black font-mono tracking-wider uppercase">
              DIRETRIZ DO MESTRE DO JOGO
            </span>
          </div>
          <p className="text-[10.5px] text-slate-950 font-bold leading-relaxed">
            "Sua força na vida real é o que move seu personagem. Trapacear clicando sem treinar é sabotar sua própria evolução legítima. Treine de verdade, vença de verdade!"
          </p>
        </motion.div>
      </div>

      {/* Decorative footer message */}
      <div className="text-center text-[9px] font-mono tracking-widest text-slate-400 flex items-center justify-center gap-1.5 z-10 py-4 uppercase shrink-0">
        <Sparkles className="w-3 h-3 text-sky-500 animate-pulse" />
        SISTEMA DE SEGURANÇA ATIVO · FITNESSRPG 2026
      </div>
    </div>
  );
};
