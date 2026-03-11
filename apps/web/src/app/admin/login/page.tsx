'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.uid,
        email: user.email,
        name: user.displayName || 'Admin'
      }));

      router.push('/admin');
    } catch (err: any) {
      console.error('Login Error:', err);
      setError('Authentication failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white border border-black/[0.05] rounded-3xl p-10 shadow-2xl shadow-slate-200 animate-fade-in">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[var(--admin-accent)] border border-orange-100 shadow-xl shadow-orange-500/10">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h1 className="font-bebas text-4xl tracking-widest text-slate-900 leading-none">
            DASH <span className="text-[var(--admin-accent)]">ADMIN</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mt-3">Enterprise Access Point</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest mb-8 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Universal ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dashdelivery.com"
                className="w-full bg-[#F8FAFC] border border-slate-200 py-4 pl-12 pr-5 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-[var(--admin-accent)] focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Protocol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border border-slate-200 py-4 pl-12 pr-5 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-[var(--admin-accent)] focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--admin-accent-gradient)] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-2xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 group"
          >
            {loading ? 'Decrypting...' : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
