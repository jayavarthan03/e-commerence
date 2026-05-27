import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Global trigger function to make toast invocation dead-simple across the codebase
export const toast = (message, type = 'success') => {
  const event = new CustomEvent('toast_message', {
    detail: { id: Math.random().toString(), message, type },
  });
  window.dispatchEvent(event);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { id, message, type } = e.detail;
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto dismiss after 3.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    window.addEventListener('toast_message', handleToast);
    return () => window.removeEventListener('toast_message', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 shadow-emerald-500/5 bg-slate-900/90 text-slate-100';
      case 'error':
        return 'border-rose-500/20 shadow-rose-500/5 bg-slate-900/90 text-slate-100';
      case 'warning':
        return 'border-amber-500/20 shadow-amber-500/5 bg-slate-900/90 text-slate-100';
      case 'info':
      default:
        return 'border-sky-500/20 shadow-sky-500/5 bg-slate-900/90 text-slate-100';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            layout
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${getColorClass(
              t.type
            )}`}
          >
            <div className="flex items-center gap-3">
              {getIcon(t.type)}
              <p className="text-sm font-medium">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
