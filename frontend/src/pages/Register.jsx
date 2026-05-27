import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect target
  const redirect = searchParams.get('redirect') || '/';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect away if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast('Please enter all registration fields.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      toast('Password must be at least 6 characters.', 'warning');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      toast('Welcome to Aura! Account created successfully.', 'success');
      navigate(redirect, { replace: true });
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      
      {/* Background decoration */}
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
            ⚡ AURA STORE
          </Link>
          <h2 className="text-2xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
            CREATE ACCOUNT
          </h2>
          <p className="text-xs font-semibold text-slate-450 dark:text-slate-400">
            Sign up to persist shopping cart backups and order tracking
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary-500" /> FULL NAME
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
            />
          </div>

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
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Password inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary-500" /> PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary-500" /> CONFIRM
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Match password"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              />
            </div>
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
                <UserPlus className="w-4.5 h-4.5" />
                CREATE ACCOUNT
              </>
            )}
          </button>

        </form>

        <hr className="border-slate-200 dark:border-slate-800 my-6" />

        {/* Redirect Login */}
        <div className="text-center text-xs font-semibold text-slate-450 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to={`/login?redirect=${redirect}`}
            className="text-primary-500 hover:underline inline-flex items-center gap-0.5 font-bold uppercase"
          >
            Sign In Here
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default Register;
