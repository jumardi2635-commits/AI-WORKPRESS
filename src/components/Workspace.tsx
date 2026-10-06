import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  AlertCircle,
  BrainCircuit,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  HelpCircle,
  Cpu,
  Key,
  ExternalLink,
  Check,
} from 'lucide-react';
import { AnalysisResult, ExampleCase } from '../types';
import { OutputView } from './OutputView';

interface WorkspaceProps {
  onSaveToHistory: (
    problem: string,
    domain: string,
    context: string,
    constraints: string,
    result: AnalysisResult
  ) => void;
  selectedExample: ExampleCase | null;
  onClearSelectedExample: () => void;
}

const DOMAIN_OPTIONS = [
  'Strategi Bisnis & Keputusan',
  'Arsitektur & Rekayasa Sistem',
  'Efisiensi Finansial & Operasional',
  'Manajemen Risiko & Regulasi',
  'Kustom / Analisis Bebas',
];

export const OPENROUTER_FREE_MODELS = [
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B (Free)',
    tag: 'Flagship Bisnis & Strategi',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Free)',
    tag: 'Penalaran Rantai Logika (CoT)',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash Exp (Free)',
    tag: 'Ultra Cepat & Multitasking',
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct:free',
    name: 'Qwen 2.5 Coder 32B (Free)',
    tag: 'Arsitektur Teknis & Presisi',
  },
  {
    id: 'mistralai/mistral-small-24b-instruct-2501:free',
    name: 'Mistral Small 24B (Free)',
    tag: 'Efisien & Ringkas',
  },
];

export const Workspace: React.FC<WorkspaceProps> = ({
  onSaveToHistory,
  selectedExample,
  onClearSelectedExample,
}) => {
  // Input states
  const [problemStatement, setProblemStatement] = useState('');
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0]);
  const [context, setContext] = useState('');
  const [constraints, setConstraints] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Provider states (Gemini vs OpenRouter Free)
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [openRouterModel, setOpenRouterModel] = useState(OPENROUTER_FREE_MODELS[0].id);
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => {
    return localStorage.getItem('sintesa_openrouter_key') || '';
  });
  const [showKeyField, setShowKeyField] = useState(false);
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Workflow states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [engineUsed, setEngineUsed] = useState<string | undefined>(undefined);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Save OpenRouter key to localStorage
  const handleSaveOpenRouterKey = (key: string) => {
    setOpenRouterKey(key);
    localStorage.setItem('sintesa_openrouter_key', key.trim());
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2000);
  };

  // If example is selected from Landing, populate form
  useEffect(() => {
    if (selectedExample) {
      setProblemStatement(selectedExample.problem);
      setDomain(selectedExample.domain);
      setContext(selectedExample.context);
      setConstraints(selectedExample.constraints);
      setShowAdvanced(true);
      setValidationError(null);
      setError(null);
      setResult(null);

      // Focus textarea
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      onClearSelectedExample();
    }
  }, [selectedExample, onClearSelectedExample]);

  // Dynamic loading messages simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    provider === 'openrouter'
      ? 'Menghubungkan ke OpenRouter Free gateway & memvalidasi model…'
      : 'AI sedang memvalidasi struktur input & kecukupan konteks…',
    'Menghubungkan penalaran mendalam dan memetakan akar masalah…',
    'Menyusun matriks komparasi opsi dan analisis risiko…',
    'Merumuskan 3 pilar rekomendasi dan kalkulasi visualisasi Recharts…',
  ];

  // Client validation
  const validate = (): boolean => {
    const trimmed = problemStatement.trim();
    if (!trimmed) {
      setValidationError('Silakan masukkan permasalahan atau pertanyaan yang ingin dianalisis terlebih dahulu.');
      textareaRef.current?.focus();
      return false;
    }
    if (trimmed.length < 8) {
      setValidationError('Deskripsi terlalu singkat. Mohon tuliskan minimal 8 karakter agar AI memiliki konteks.');
      textareaRef.current?.focus();
      return false;
    }
    if (trimmed.length > 5000) {
      setValidationError('Deskripsi melebihi batas 5.000 karakter. Mohon ringkas permasalahan Anda.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Trigger analysis call to server
  const handleAnalyze = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement: problemStatement.trim(),
          domain,
          context: context.trim(),
          constraints: constraints.trim(),
          provider,
          openRouterModel: provider === 'openrouter' ? openRouterModel : undefined,
          openRouterKey: provider === 'openrouter' && openRouterKey ? openRouterKey.trim() : undefined,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Terjadi masalah saat memproses permintaan. Silakan coba lagi.');
      }

      if (!json.data) {
        throw new Error('Format respon server tidak valid.');
      }

      setResult(json.data);
      setEngineUsed(json.meta?.engine);
      setFallbackNotice(json.meta?.fallbackNotice || null);
      onSaveToHistory(
        problemStatement.trim(),
        domain,
        context.trim(),
        constraints.trim(),
        json.data
      );

      // Smooth scroll to output
      setTimeout(() => {
        const outputElem = document.getElementById('analisis-output');
        outputElem?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.warn('[Sintesa AI Workspace] Info analisis:', err?.message || err);
      setError(
        err.message ||
          'Terjadi masalah saat memproses permintaan. Silakan periksa koneksi atau coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleClear = () => {
    setProblemStatement('');
    setContext('');
    setConstraints('');
    setValidationError(null);
    setError(null);
    setResult(null);
    setEngineUsed(undefined);
    textareaRef.current?.focus();
  };

  return (
    <section
      id="workspace"
      ref={workspaceRef}
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Workspace Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Decision Workspace
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Kirimkan permasalahan untuk diuraikan ke dalam 3 pilar: Hasil, Penjelasan, dan Rekomendasi Aksi.
          </p>
        </div>

        {/* Quick Clear Button */}
        {(problemStatement || result) && (
          <button
            onClick={handleClear}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan Form</span>
          </button>
        )}
      </div>

      {/* Main Workspace Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl p-4 sm:p-6 lg:p-7 space-y-6">
        {/* AI Engine Selector: Gemini vs OpenRouter Free */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pilihan Mesin AI (AI Engine)</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {provider === 'gemini'
                  ? 'Mesin bawaan Google dengan dual-model fallback (3.8 Flash & 3.1 Flash-Lite)'
                  : 'Penyedia multi-model OpenRouter dengan akses model tier gratis'}
              </p>
            </div>

            {/* Segmented Control */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  provider === 'gemini'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Google Gemini
              </button>

              <button
                type="button"
                onClick={() => setProvider('openrouter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  provider === 'openrouter'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OpenRouter Free
              </button>
            </div>
          </div>

          {/* If OpenRouter is chosen, show Model Dropdown and Key Configuration */}
          {provider === 'openrouter' && (
            <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Model selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Pilih Model OpenRouter (Tier Gratis)
                  </label>
                  <select
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {OPENROUTER_FREE_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} — {m.tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Key Settings */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      <Key className="w-3 h-3 text-emerald-400" />
                      <span>Kunci API OpenRouter</span>
                    </label>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Dapatkan Kunci Gratis</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Gunakan kunci server default atau masukkan sk-or-v1-..."
                      value={openRouterKey}
                      onChange={(e) => handleSaveOpenRouterKey(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveOpenRouterKey(openRouterKey)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer shrink-0"
                    >
                      {keySavedToast ? (
                        <span className="flex items-center gap-1 text-white">
                          <Check className="w-3 h-3" />
                          <span>Tersimpan</span>
                        </span>
                      ) : (
                        <span>Simpan</span>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {openRouterKey
                      ? '✓ Kunci tersimpan di peramban lokal Anda.'
                      : '✓ Menggunakan kunci server environment default (siap pakai).'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Domain / Kategori Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Pilih Domain / Kategori Analisis
          </label>
          <div className="flex flex-wrap gap-2">
            {DOMAIN_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDomain(item)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  domain === item
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Input Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="problem-input"
              className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Deskripsi Masalah / Pertanyaan Keputusan</span>
              <span className="text-rose-400">*</span>
            </label>
            <span
              className={`text-[11px] font-mono tabular-nums ${
                problemStatement.length > 4500 ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {problemStatement.length} / 5.000 karakter
            </span>
          </div>

          <div className="relative">
            <textarea
              id="problem-input"
              ref={textareaRef}
              rows={5}
              value={problemStatement}
              onChange={(e) => {
                setProblemStatement(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Contoh: Kami berencana mengubah skema komisi tim penjualan dari 5% flat menjadi tier 3-8% berdasarkan pencapaian target kuartal. Namun kami khawatir akan terjadi kanibalisasi kesepakatan di akhir periode. Bagaimana analisis trade-off dan rekomendasi mitigasinya?"
              className={`w-full p-4 rounded-xl text-sm bg-slate-950/80 border text-slate-100 placeholder-slate-500 focus:outline-none transition-all leading-relaxed ${
                validationError
                  ? 'border-rose-500/80 ring-1 ring-rose-500/50'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40'
              }`}
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 font-medium animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </p>
          )}

          <p className="mt-1.5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tuliskan masalah dengan spesifik untuk memicu penalaran AI yang akurat.</span>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
              Tekan <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700">Enter</kbd> untuk mulai
            </span>
          </p>
        </div>

        {/* Collapsible Advanced Context & Constraints */}
        <div className="pt-2 border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {showAdvanced
                ? 'Sembunyikan Konteks Tambahan & Batasan'
                : '+ Tambah Konteks Latar Belakang & Batasan Spesifik (Opsional)'}
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5 ml-auto" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-auto" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {/* Context */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                  <span>Konteks Latar Belakang / Data Metrik</span>
                  <span title="Informasi relevan seperti jumlah tim, metrik pendapatan, atau histori" className="inline-flex cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Misal: Tim sales terdiri dari 12 akun eksekutif, rata-rata siklus penjualan 45 hari, churn rate Q1 berada di 4.1%..."
                  className="w-full p-3 rounded-xl text-xs bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Constraints */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                  <span>Batasan & Ketentuan (Budget / Waktu / Aturan)</span>
                  <span title="Batasan yang wajib dipatuhi seperti anggaran maksimal, SLA, deadline" className="inline-flex cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="Misal: Anggaran bonus tidak boleh melonjak melebihi 15% dari kuartal lalu; kebijakan harus mulai berlaku 1 Juli..."
                  className="w-full p-3 rounded-xl text-xs bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>
              Engine:{' '}
              <strong className="text-slate-200">
                {provider === 'openrouter'
                  ? `OpenRouter (${OPENROUTER_FREE_MODELS.find((m) => m.id === openRouterModel)?.name || 'Free'})`
                  : 'Google Gemini (Dual Resilient)'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading || (!problemStatement && !context && !constraints)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Hapus
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer min-h-[42px]"
            >
              {isLoading ? (
                <>
                  <BrainCircuit className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>AI Menganalisis…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Mulai Analisis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          LOADING STATE
         ======================================================== */}
      {isLoading && (
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4 animate-fadeIn">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              AI sedang memproses permintaan Anda…
            </h3>
            <p className="mt-1 text-xs text-indigo-300 font-medium">
              {loadingMessages[loadingStep]}
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="max-w-md mx-auto pt-3">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, (loadingStep + 1) * 25)}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-4 text-center text-[10px] text-slate-400 font-mono">
              <span className={loadingStep >= 0 ? 'text-indigo-400 font-medium' : ''}>1. Validasi</span>
              <span className={loadingStep >= 1 ? 'text-indigo-400 font-medium' : ''}>2. Penalaran</span>
              <span className={loadingStep >= 2 ? 'text-indigo-400 font-medium' : ''}>3. Komparasi</span>
              <span className={loadingStep >= 3 ? 'text-indigo-400 font-medium' : ''}>4. Rekomendasi</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ERROR STATE & RETRY
         ======================================================== */}
      {error && !isLoading && (
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-rose-200">
                Terjadi Masalah Saat Memproses Permintaan
              </h4>
              <p className="mt-1 text-xs text-rose-300 leading-relaxed">{error}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Silakan periksa input atau klik tombol "Coba Lagi" untuk mengulang proses analisis.
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* ========================================================
          OUTPUT AREA (SUCCESS STATE)
         ======================================================== */}
      {result && !isLoading && (
        <div id="analisis-output" className="mt-10 pt-4">
          {fallbackNotice && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Pemberitahuan Mesin AI: </span>
                <span>{fallbackNotice}</span>
              </div>
            </div>
          )}
          <OutputView
            data={result}
            domain={domain}
            engine={engineUsed}
            onRegenerate={handleAnalyze}
            onClear={handleClear}
            isRegenerating={isLoading}
          />
        </div>
      )}

      {/* ========================================================
          EMPTY STATE
         ======================================================== */}
      {!result && !isLoading && !error && (
        <div className="mt-10 py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-center">
          <FileQuestion className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-300">Belum Ada Analisis yang Berjalan</h4>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            Masukkan deskripsi masalah atau pilih salah satu studi kasus di atas untuk melihat bagaimana Sintesa AI menyusun evaluasi komprehensif.
          </p>
        </div>
      )}
    </section>
  );
};
