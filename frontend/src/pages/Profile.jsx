import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { User, Lock, Mail, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Prefill user details
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords matching
    if (password && password !== confirmPassword) {
      toast('Passwords do not match.', 'error');
      return;
    }

    if (password && password.length < 6) {
      toast('Password must be at least 6 characters.', 'warning');
      return;
    }

    setLoading(true);
    const profileData = { name, email };
    if (password) {
      profileData.password = password;
    }

    const res = await updateProfile(profileData);
    setLoading(false);

    if (res.success) {
      toast('Account profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide">
          USER PROFILE ACCOUNT
        </h1>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
          Manage your contact credentials and security tokens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Account role details */}
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-5 backdrop-blur-md flex flex-col gap-4 items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-violet-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-850 dark:text-white uppercase">{user?.name}</h3>
            <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 lowercase">{user?.email}</p>
          </div>

          <hr className="w-full border-slate-200 dark:border-slate-850" />

          {/* Account Role Badge */}
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AURA ROLE LEVEL</span>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold border border-primary-500/20 bg-primary-500/10 text-primary-500 uppercase tracking-widest">
              {user?.role} ACCOUNT
            </span>
          </div>
        </div>

        {/* Right Column: Profile modifier form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/15 backdrop-blur-md flex flex-col gap-5"
          >
            
            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary-500" /> Name Description
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary-500" /> Email Credentials
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
              />
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-1" />

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <p className="text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                SECURITY UPGRADE: Leave password fields blank if you do not want to change your current security login parameters.
              </p>
            </div>

            {/* Password Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary-500" /> New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary-500" /> Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Match password"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'COMMIT PROFILE CHANGES'}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
