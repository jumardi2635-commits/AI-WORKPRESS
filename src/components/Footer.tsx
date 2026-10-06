import React from 'react';
import { BrainCircuit, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-850 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              <span>Sintesa AI</span>
            </div>
            <p className="text-xs text-slate-400">
              Platform Intelijen Analisis & Solusi Strategis Terstruktur
            </p>
          </div>
        </div>

        {/* Security and privacy badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Server-Side Isolated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-Halusinasi & Faktual</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Sintesa AI. Dibangun untuk kebutuhan penalaran strategis dan pemecahan masalah kompleks.
      </div>
    </footer>
  );
};
