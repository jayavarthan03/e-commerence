import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect target
  const redirect = searchParams.get('redirect') || '/';

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password.', 'warning');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast('Welcome back to Aura!', 'success');
      navigate(redirect, { replace: true });
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      
      {/* Background glowing design details */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-violet-500/5 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-slate-200/50 dark:border-white/10 glass-panel-heavy p-8 shadow-2xl relative z-10"
      >
        
        {/* Portal Header */}
        <div className="text-center flex flex-col gap-2 mb-8">
          <Link to="/" className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-violet-500 uppercase">
            ⚡ AURA SHOP
          </Link>
          <h2 className="text-2xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            WELCOME BACK
          </h2>
          <p className="text-xs font-semibold text-slate-450 dark:text-slate-400">
            Sign in using your developer credentials
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-primary-500" /> EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@aura.com"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary-500" /> SECURE PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-3.5 rounded-xl text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5" />
                AUTHORIZE LOGIN
              </>
            )}
          </button>

        </form>

        <hr className="border-slate-200 dark:border-slate-800 my-6" />

        {/* Redirect sign up */}
        <div className="text-center text-xs font-semibold text-slate-450 dark:text-slate-400">
          New to Aura?{' '}
          <Link
            to={`/register?redirect=${redirect}`}
            className="text-primary-500 hover:underline inline-flex items-center gap-0.5 font-bold uppercase"
          >
            Create an Account
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default Login;
