import React from 'react';
import { BrainCircuit, History, ArrowRight, TrendingUp } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenTrends: () => void;
  onScrollToWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onOpenTrends,
  onScrollToWorkspace,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">Sintesa AI</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Analisis Strategis & Rekomendasi Terstruktur</p>
          </div>
        </div>

        {/* Engine status indicator & Quick links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 mr-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Gemini Dual Engine</span>
            <span aria-hidden="true">·</span>
            <span>OpenRouter Free Ready</span>
          </div>

          {/* Trends Button */}
          <button
            onClick={onOpenTrends}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Lihat Pelacak Tren Sentimen & Kompleksitas"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tren Riwayat</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Buka Riwayat Analisis"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tabular-nums">
                {historyCount}
              </span>
            )}
          </button>

          {/* CTA to Workspace */}
          <button
            onClick={onScrollToWorkspace}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>Mulai Analisis</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
