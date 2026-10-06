/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { Workspace } from './components/Workspace';
import { Footer } from './components/Footer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HistoryTrendTracker } from './components/HistoryTrendTracker';
import { AnalysisHistoryItem, ExampleCase, AnalysisResult } from './types';
import { TrendingUp } from 'lucide-react';

const STORAGE_KEY = 'sintesa_ai_history_v1';

export default function App() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'list' | 'trends'>('list');
  const [selectedExample, setSelectedExample] = useState<ExampleCase | null>(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Gagal menyimpan riwayat ke localStorage:', e);
    }
  }, [history]);

  const handleSaveToHistory = (
    problem: string,
    domain: string,
    context: string,
    constraints: string,
    result: AnalysisResult
  ) => {
    const newItem: AnalysisHistoryItem = {
      id: `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      problemStatement: problem,
      domain,
      context,
      constraints,
      result,
    };

    setHistory((prev) => [newItem, ...prev.slice(0, 19)]); // Simpan 20 riwayat terakhir
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat analisis?')) {
      setHistory([]);
    }
  };

  const handleScrollToWorkspace = () => {
    const workspaceElem = document.getElementById('workspace');
    workspaceElem?.scrollIntoView({ behavior: 'smooth' });
    const textarea = document.getElementById('problem-input');
    textarea?.focus();
  };

  const handleSelectExample = (example: ExampleCase) => {
    setSelectedExample(example);
    const workspaceElem = document.getElementById('workspace');
    workspaceElem?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRestoreFromHistory = (item: AnalysisHistoryItem) => {
    setSelectedExample({
      id: item.id,
      title: 'Riwayat Analisis',
      domain: item.domain,
      badge: 'Riwayat',
      description: item.problemStatement,
      problem: item.problemStatement,
      context: item.context || '',
      constraints: item.constraints || '',
    });
    const workspaceElem = document.getElementById('workspace');
    workspaceElem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        historyCount={history.length}
        onOpenHistory={() => {
          setHistoryTab('list');
          setIsHistoryOpen(true);
        }}
        onOpenTrends={() => {
          setHistoryTab('trends');
          setIsHistoryOpen(true);
        }}
        onScrollToWorkspace={handleScrollToWorkspace}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* STEP 1: Landing */}
        <LandingHero
          onStartNow={handleScrollToWorkspace}
          onSelectExample={handleSelectExample}
        />

        {/* STEP 2: AI Workspace */}
        <Workspace
          onSaveToHistory={handleSaveToHistory}
          selectedExample={selectedExample}
          onClearSelectedExample={() => setSelectedExample(null)}
        />

        {/* STEP 3: Integrated Historical Trends Section */}
        <section id="tren-riwayat" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-850/80">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Pelacak Tren Sentimen & Kompleksitas Analisis
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Visualisasi data Recharts memantau riwayat kedalaman evaluasi dan polaritas keputusan Anda.
              </p>
            </div>

            <button
              onClick={() => {
                setHistoryTab('trends');
                setIsHistoryOpen(true);
              }}
              className="self-start sm:self-auto text-xs font-medium text-indigo-400 hover:text-indigo-300 py-1"
            >
              Buka Analitik Penuh →
            </button>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <HistoryTrendTracker
              items={history}
              onSelectItem={handleRestoreFromHistory}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelectItem={handleRestoreFromHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
        initialTab={historyTab}
      />
    </div>
  );
}
