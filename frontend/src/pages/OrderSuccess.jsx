import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6 select-none">
      
      {/* Animated Big Green Checkmark */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-5xl"
      >
        <CheckCircle2 className="w-16 h-16" />
      </motion.div>

      <div>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-3xl font-extrabold uppercase text-slate-800 dark:text-white tracking-wide"
        >
          ORDER CONFIGURED SUCCESSFULLY
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2"
        >
          Thank you for choosing AURA. Your secure credit card payment has been successfully captured and processed.
        </motion.p>
      </div>

      {/* Glassmorphic Order ID container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex flex-col gap-2"
      >
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRANSACTION REFERENCE ORDER ID</span>
        <span className="text-sm font-mono font-bold text-primary-500 select-all tracking-wider break-all">
          {id}
        </span>
        <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide mt-1">
          💡 A confirmation receipt has been sent to your registered developer email address.
        </span>
      </motion.div>

      {/* Navigation options */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4"
      >
        <Link
          to="/orders"
          className="btn-gradient w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 flex-grow"
        >
          <ShoppingBag className="w-4 h-4" />
          TRACK SHIPMENT STATUS
        </Link>
        <Link
          to="/shop"
          className="btn-gradient-secondary w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
        >
          CONTINUE SHOPPING
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

    </div>
  );
};

export default OrderSuccess;
