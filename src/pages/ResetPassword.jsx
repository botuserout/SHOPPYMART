import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Password Recovery</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
          If you followed a valid password reset link from your email, your credentials can now be updated.
        </p>
        
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all"
        >
          Proceed to Login
        </button>

        <div className="mt-4">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-brand-500">
            Return to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
