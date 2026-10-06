import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Table,
  Target,
  FileCheck2,
  CheckCircle2,
  Zap,
  Sparkles,
} from 'lucide-react';
import { EXAMPLE_CASES } from '../data/examples';
import { ExampleCase } from '../types';

interface LandingHeroProps {
  onStartNow: () => void;
  onSelectExample: (example: ExampleCase) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartNow,
  onSelectExample,
}) => {
  // 3D Glass interactive tilt state
  const stageRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState<'hasil' | 'matriks' | 'aksi'>('hasil');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Subtle 3D tilt angle
    const rX = ((y / height) - 0.5) * -12;
    const rY = ((x / width) - 0.5) * 12;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0c101d] to-[#0b0f19]">
      {/* Ambient background glows for chromatic glass refraction */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[650px] h-[400px] bg-indigo-600/15 blur-[150px] pointer-events-none rounded-full animate-glass-glow" />
      <div className="absolute top-24 right-1/4 w-[500px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            3D GLASS ANIMATION SHOWCASE CONTAINER (TEXT INSIDE GLASS)
           ======================================================== */}
        <div className="max-w-5xl mx-auto py-4">
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative perspective-1200 cursor-crosshair select-none my-2"
          >
            {/* Backlight Refraction Glow Layer */}
            <div className="absolute inset-2 sm:inset-4 rounded-3xl bg-gradient-to-tr from-indigo-600/25 via-cyan-500/15 to-emerald-500/20 blur-3xl opacity-75 -z-10 animate-glass-glow" />

            {/* Main 3D Frosted Glass Prism Card */}
            <div
              style={{
                transform: isHovered
                  ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`
                  : undefined,
                transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.8s ease-in-out',
              }}
              className={`relative rounded-3xl border border-white/20 bg-slate-900/55 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.4)] p-6 sm:p-10 lg:p-12 text-center preserve-3d ${
                !isHovered ? 'animate-glass-float' : ''
              }`}
            >
              {/* Specular Diagonal Sheen Sweep */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-glass-sheen" />
              </div>

              {/* Glass Top Console Toolbar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-300 tracking-wider">
                    SINTESA AI · INTELLIGENCE ENGINE
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>ONLINE · V2.5 PRODUCTION</span>
                </div>
              </div>

              {/* 1. KICKER (Inside 3D Glass) */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-3">
                <span>PENALARAN KAUSALITAS</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>MATRIKS KOMPARATIF</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>RENCANA AKSI TERUKUR</span>
              </div>

              {/* 2. HEADLINE (Inside 3D Glass) */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.18] text-balance mb-4">
                Platform Intelijen Analisis &{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-emerald-300 bg-clip-text text-transparent">
                  Solusi Strategis Terstruktur
                </span>
              </h1>

              {/* 3. VALUE PROPOSITION BODY (Inside 3D Glass) */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8 text-pretty">
                Urai kompleksitas keputusan bisnis, arsitektur rekayasa sistem, dan dilema operasional ke dalam{' '}
                <strong className="text-white font-medium">Hasil Inti & Vonis</strong>,{' '}
                <strong className="text-white font-medium">Matriks Komparasi Opsi</strong>, serta{' '}
                <strong className="text-white font-medium">Rencana Aksi Berprioritas</strong> yang didukung visualisasi data kuantitatif.
              </p>

              {/* 4. PRIMARY ACTIONS (Inside 3D Glass) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
                <button
                  onClick={onStartNow}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[46px]"
                >
                  <span>Mulai Analisis Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#contoh-kasus"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer min-h-[46px]"
                >
                  <span>Lihat Studi Kasus Nyata</span>
                </a>
              </div>

              {/* 5. INTERACTIVE LIVE DECISION PREVIEW (Inside 3D Glass) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/10 text-left space-y-3.5 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Simulasi Penalaran Kausalitas
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      Modernisasi Microservices vs Modular Monolith: Evaluasi Trade-Off
                    </p>
                  </div>

                  {/* Preview Selector Tabs */}
                  <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-white/10 text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTabPreview('hasil')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        activeTabPreview === 'hasil'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1. Hasil & Vonis
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabPreview('matriks')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        activeTabPreview === 'matriks'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      2. Matriks Opsi
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabPreview('aksi')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        activeTabPreview === 'aksi'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3. Rencana Aksi
                    </button>
                  </div>
                </div>

                {/* Preview Tab Dynamic Content */}
                {activeTabPreview === 'hasil' && (
                  <div className="space-y-2.5 text-xs animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Perbandingan Efektivitas Solusi</span>
                      <span className="text-indigo-400 font-mono">Skor 88 / 100</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                          <span className="font-medium text-white">Opsi Rekomendasi (Modular Monolith)</span>
                          <span className="font-mono text-indigo-300 font-semibold">88% Efektivitas</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full w-[88%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                          <span>Opsi Alternatif (Full Microservices Rewrite)</span>
                          <span className="font-mono text-slate-400">54% Efektivitas</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500/70 h-full rounded-full w-[54%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTabPreview === 'matriks' && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs animate-fadeIn pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                      <p className="text-[10px] text-slate-400">Modular Monolith</p>
                      <p className="mt-1 font-bold text-emerald-400 text-xs">Risiko Rendah</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Biaya Terkendali</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                      <p className="text-[10px] text-slate-400">Microservices Murni</p>
                      <p className="mt-1 font-bold text-amber-400 text-xs">Risiko Tinggi</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Overhead Jaringan</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                      <p className="text-[10px] text-slate-400">Status Quo</p>
                      <p className="mt-1 font-bold text-rose-400 text-xs">Stagnasi</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Hambatan Rilis</p>
                    </div>
                  </div>
                )}

                {activeTabPreview === 'aksi' && (
                  <div className="space-y-1.5 text-xs animate-fadeIn pt-1">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-slate-200">Minggu 1: Isolasi batas domain inti (bounded contexts)</span>
                      <span className="ml-auto text-[10px] text-indigo-400 font-mono">Prioritas Tinggi</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="text-slate-300">Minggu 2-3: Refactor internal event-driven communication</span>
                      <span className="ml-auto text-[10px] text-slate-400 font-mono">Prioritas Sedang</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3D Floating Layer 1: Vonis Badge (Top Right) */}
              <div
                style={{
                  transform: 'translateZ(60px)',
                }}
                className="hidden sm:flex absolute -top-3.5 right-4 sm:right-6 backdrop-blur-xl bg-slate-800/95 border border-emerald-400/40 rounded-2xl px-3.5 py-2.5 shadow-[0_15px_30px_rgba(0,0,0,0.7)] items-center gap-2.5 animate-glass-float-layer1"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                <div className="text-left">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                    Vonis Strategis
                  </p>
                  <p className="text-xs font-bold text-white whitespace-nowrap">
                    Layak Dieksekusi Bertahap
                  </p>
                </div>
              </div>

              {/* 3D Floating Layer 2: Metric Badge (Bottom Left) */}
              <div
                style={{
                  transform: 'translateZ(65px)',
                }}
                className="hidden sm:flex absolute -bottom-3.5 left-4 sm:left-6 backdrop-blur-xl bg-slate-800/95 border border-indigo-400/40 rounded-2xl px-3.5 py-2.5 shadow-[0_15px_30px_rgba(0,0,0,0.7)] items-center gap-2.5 animate-glass-float-layer2"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">
                    Dampak Terukur (14 Hari)
                  </p>
                  <p className="text-xs font-bold text-white whitespace-nowrap">
                    +38% Efisiensi Alokasi Biaya
                  </p>
                </div>
              </div>

              {/* 3D Floating Layer 3: Anti-Hallucination Tag (Top Left) */}
              <div
                style={{
                  transform: 'translateZ(45px)',
                }}
                className="hidden md:flex absolute -top-3.5 left-6 backdrop-blur-xl bg-slate-800/90 border border-cyan-400/40 rounded-2xl px-3 py-2 shadow-[0_15px_30px_rgba(0,0,0,0.7)] items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                  Anti-Halusinasi & Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3 PILLARS & CORE CAPABILITIES
           ======================================================== */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Struktur 3 Pilar Baku</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Laporan terbagi rapi ke dalam Hasil Inti, Penjelasan mendalam, dan Rekomendasi aksi terukur.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Verifikasi Kelayakan Data</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Jika konteks data belum cukup, AI tidak berasumsi dan meminta data tambahan secara transparan.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <Table className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Matriks Evaluasi Komparatif</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Membandingkan kelebihan, kekurangan, dan risiko setiap opsi dalam tabel terstruktur.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Rencana Tindak Lanjut & KPI</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Rencana aksi berprioritas (Tinggi/Sedang/Rendah) dengan indikator dampak dan estimasi timeline.
            </p>
          </div>
        </div>

        {/* ========================================================
            REAL CASE EXAMPLES (1-CLICK LOAD)
           ======================================================== */}
        <div id="contoh-kasus" className="mt-12 pt-8 border-t border-slate-800/80 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Contoh Studi Kasus Siap Uji (1-Klik)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pilih salah satu skenario di bawah ini untuk menguji daya analisis sistem ke dalam Workspace secara instan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {EXAMPLE_CASES.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectExample(item)}
                className="group p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium text-indigo-400">{item.badge}</span>
                    <span className="text-[11px] text-slate-500 group-hover:text-indigo-300 flex items-center gap-0.5 transition-colors">
                      Muat <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-500">
                  {item.domain}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
