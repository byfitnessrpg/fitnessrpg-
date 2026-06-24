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
          onShowModal('Cadastro realizado com sucesso! Faça login para começar a sua jornada no Arise Workout.');
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
    <div className="min-h-screen bg-[#08070c] text-slate-100 flex flex-col justify-between px-6 py-12 font-sans overflow-hidden relative">
      {/* Decorative top-right and bottom-left atmospheric glows */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col items-center text-center mt-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-red-600 to-amber-500 rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgba(220,38,38,0.3)] border border-red-500/30 mb-6 relative"
        >
          <Shield className="w-10 h-10 text-white" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl border border-dashed border-amber-300/30 m-1"
          />
        </motion.div>

        <h1 className="text-4xl font-extrabold font-display tracking-tight bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm mb-2">
          FITNESS RPG
        </h1>
        <p className="text-slate-400 text-sm max-w-[280px]">
          Transforme seus treinos em uma jornada de RPG lendária
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-sm mx-auto bg-[#12101a] border border-red-950/40 rounded-3xl p-6 shadow-2xl relative z-10 my-8"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-950/80 border border-red-600/30 px-4 py-0.5 rounded-full text-[10px] font-bold font-mono text-red-400 tracking-widest uppercase flex items-center gap-1">
          <Flame className="w-3 h-3 text-red-500 animate-pulse" />
          {isRegistering ? 'Forjar Nova Conta' : 'Área de Conexão'}
        </div>

        <form className="space-y-4 pt-2">
          {isRegistering && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-xs font-mono font-bold tracking-wider text-slate-400 mb-1.5 uppercase">
                Nome do Caçador / Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Seu nome lendário"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#191624] border border-red-950 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200"
                  required
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold tracking-wider text-slate-400 mb-1.5 uppercase">
              E-mail do Guerreiro
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#191624] border border-red-950 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold tracking-wider text-slate-400 mb-1.5 uppercase">
              Chave de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#191624] border border-red-950 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-lg text-center"
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
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm shadow-[0_4px_15px_rgba(220,38,38,0.2)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Entrar na Arena
                      <Flame className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg('');
                  }}
                  className="w-full py-3 bg-transparent hover:bg-slate-900 border border-red-600/30 hover:border-red-600 text-red-500 hover:text-red-400 font-semibold rounded-xl text-sm transition-all duration-200"
                >
                  Forjar Nova Conta
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-[0_4px_15px_rgba(168,85,247,0.2)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.3)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Forjar Conta e Entrar
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg('');
                  }}
                  className="w-full py-3 bg-transparent hover:bg-slate-900 border border-purple-600/30 hover:border-purple-600 text-purple-400 hover:text-purple-300 font-semibold rounded-xl text-sm transition-all duration-200"
                >
                  Voltar ao Login
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>

      {/* Decorative footer message */}
      <div className="text-center text-[10px] font-mono tracking-widest text-slate-500 flex items-center justify-center gap-1.5 z-10">
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
        SESSÃO SECRETA DE TREINAMENTO RPG
      </div>
    </div>
  );
};
