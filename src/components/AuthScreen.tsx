import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, Flame, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthScreenProps {
  onSuccess: (user: any) => void;
  onShowModal: (msg: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onShowModal }) => {
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
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-between px-6 py-12 font-sans overflow-hidden relative">
      {/* Decorative top-right and bottom-left atmospheric glows */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col items-center text-center mt-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-black to-[#09090c] rounded-3xl flex items-center justify-center shadow-[0_0_25px_rgba(14,165,233,0.3)] border border-sky-500/40 mb-6 relative"
        >
          <Shield className="w-10 h-10 text-sky-400" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl border border-dashed border-sky-400/30 m-1"
          />
        </motion.div>

        <h1 className="text-4xl font-black font-display tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] mb-2 uppercase">
          FitnessRPG
        </h1>
        <p className="text-slate-400 text-xs font-mono max-w-[280px] uppercase tracking-wider">
          SISTEMA DE TREINAMENTO ATIVO
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-sm mx-auto bg-[#0a0a0d] border border-sky-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8),_0_0_20px_rgba(14,165,233,0.15)] relative z-10 my-8"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black border border-sky-500/40 px-4 py-0.5 rounded-full text-[10px] font-bold font-mono text-sky-400 tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
          <Flame className="w-3 h-3 text-sky-400 animate-pulse" />
          {isRegistering ? 'REGISTRAR CAÇADOR' : 'ACESSAR SISTEMA'}
        </div>

        <form className="space-y-4 pt-2">
          {isRegistering && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 mb-1.5 uppercase">
                Nome do Caçador
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Seu nome lendário"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#111116] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200"
                  required
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 mb-1.5 uppercase">
              E-mail do Guerreiro
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#111116] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 mb-1.5 uppercase">
              Chave de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#111116] border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-lg text-center font-mono"
            >
              {errorMsg}
            </motion.div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            {!isRegistering ? (
              <>
                <button
                  type="submit"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3.5 bg-white hover:bg-slate-200 text-black font-black font-display text-sm tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Iniciar Quest
                      <Flame className="w-4 h-4 text-black fill-current" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg('');
                  }}
                  className="w-full py-3 bg-transparent hover:bg-slate-900 border border-sky-500/20 hover:border-sky-500 text-sky-400 hover:text-sky-300 font-bold rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200"
                >
                  Registar Nova Conta
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3.5 bg-white hover:bg-slate-200 text-black font-black font-display text-sm tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Cadastrar e Entrar
                      <Sparkles className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg('');
                  }}
                  className="w-full py-3 bg-transparent hover:bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200"
                >
                  Voltar ao Login
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>

      {/* Decorative footer message */}
      <div className="text-center text-[9px] font-mono tracking-widest text-slate-600 flex items-center justify-center gap-1.5 z-10">
        <Sparkles className="w-3 h-3 text-sky-500 animate-pulse" />
        SESSÃO ATIVA · SISTEMA FITNESSRPG
      </div>
    </div>
  );
};
