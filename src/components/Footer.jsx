import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { personalData } from '../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-gray-400 py-10 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-white font-display">
            {personalData.name}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-xs font-mono text-green-400">
            Dental Billing VA
          </span>
        </div>

        {/* Center note */}
        <div className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-green-400" />
          <span>100% HIPAA Compliant Healthcare Billing</span>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-green-400 transition-colors"
        >
          <span>Back to Top</span>
          <div className="w-7 h-7 rounded-full border border-white/10 group-hover:border-green-400/40 flex items-center justify-center transition-colors">
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>

      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 mt-6 pt-5 border-t border-white/[0.04] text-center text-[10px] text-gray-600 font-mono">
        © {new Date().getFullYear()} {personalData.name}. All rights reserved. Precision Dental Revenue Cycle Management.
      </div>
    </footer>
  );
}
