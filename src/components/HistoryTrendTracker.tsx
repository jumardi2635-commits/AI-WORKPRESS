import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

interface HistoryTrendTrackerProps {
  items: AnalysisHistoryItem[];
  onSelectItem?: (item: AnalysisHistoryItem) => void;
}

// Compute numerical complexity score (0-100) based on analysis depth
function computeComplexityScore(item: AnalysisHistoryItem): number {
  const factorsCount = item.result.penjelasan?.faktorKritis?.length || 3;
  const tableRowsCount = item.result.penjelasan?.tabelKomparasi?.baris?.length || 3;
  const actionsCount = item.result.rekomendasi?.rencanaAksi?.length || 3;
  const risksCount = item.result.rekomendasi?.mitigasiRisiko?.length || 2;
  const textLengthBonus = Math.min(20, Math.floor(item.problemStatement.length / 150));

  const rawScore = 30 + factorsCount * 5 + tableRowsCount * 5 + actionsCount * 4 + risksCount * 4 + textLengthBonus;
  return Math.min(96, Math.max(35, rawScore));
}

// Compute strategic sentiment / feasibility score (0-100) based on verdict & urgency
function computeSentimentScore(item: AnalysisHistoryItem): number {
  const verdict = (item.result.hasil?.verdict || '').toLowerCase();
  let baseScore = 65;

  if (verdict.includes('layak') || verdict.includes('prioritas') || verdict.includes('eksekusi') || verdict.includes('optimasi')) {
    baseScore += 18;
  }
  if (verdict.includes('syarat') || verdict.includes('tinjau') || verdict.includes('hati-hati')) {
    baseScore -= 6;
  }
  if (verdict.includes('hindari') || verdict.includes('kritis') || verdict.includes('risiko tinggi')) {
    baseScore -= 24;
  }
  if (item.result.isDataInsufficient) {
    baseScore -= 15;
  }

  // Factor in action plan priorities
  const highPriorityActions = item.result.rekomendasi?.rencanaAksi?.filter((a) =>
    (a.prioritas || '').toLowerCase().includes('tinggi')
  ).length || 1;

  baseScore += highPriorityActions * 3;
  return Math.min(95, Math.max(30, baseScore));
}

// Simulated data if history is empty or only 1 item
const SIMULATED_DATA = [
  {
    id: 'sim-1',
    nama: 'Kasus 1',
    labelLengkap: 'Evaluasi Model Freemium SaaS',
    domain: 'Strategi Bisnis',
    kompleksitas: 58,
    sentimen: 74,
    verdict: 'Layak dengan Paywall',
    tanggal: '1 Okt',
  },
  {
    id: 'sim-2',
    nama: 'Kasus 2',
    labelLengkap: 'Audit Lonjakan AWS EKS',
    domain: 'Efisiensi Operasional',
    kompleksitas: 84,
    sentimen: 62,
    verdict: 'Prioritas Audit Segera',
    tanggal: '3 Okt',
  },
  {
    id: 'sim-3',
    nama: 'Kasus 3',
    labelLengkap: 'Migrasi Monolith ke Microservices',
    domain: 'Arsitektur Sistem',
    kompleksitas: 92,
    sentimen: 48,
    verdict: 'Tinjau Ulang & Modular Monolith',
    tanggal: '5 Okt',
  },
  {
    id: 'sim-4',
    nama: 'Kasus 4',
    labelLengkap: 'Intervensi Churn Pelanggan B2B',
    domain: 'Strategi Bisnis',
    kompleksitas: 72,
    sentimen: 81,
    verdict: 'Program 30 Hari Pertama',
    tanggal: '6 Okt',
  },
];

export const HistoryTrendTracker: React.FC<HistoryTrendTrackerProps> = ({
  items,
  onSelectItem,
}) => {
  const [activeView, setActiveView] = useState<'timeline' | 'domain'>('timeline');
  const [useSimulation, setUseSimulation] = useState(items.length < 2);

  // Process historical items into chart data points (chronological order)
  const chartData = useMemo(() => {
    if (useSimulation || items.length === 0) {
      return SIMULATED_DATA;
    }

    // Clone & reverse to have chronological left-to-right timeline
    const chronological = [...items].reverse();

    return chronological.map((item, index) => {
      const date = new Date(item.timestamp);
      const shortDate = `${date.getDate()} ${date.toLocaleDateString('id-ID', { month: 'short' })}`;
      const snippet = item.problemStatement.slice(0, 32) + (item.problemStatement.length > 32 ? '…' : '');

      return {
        id: item.id,
        rawItem: item,
        nama: `#${index + 1} (${shortDate})`,
        labelLengkap: snippet,
        domain: item.domain,
        kompleksitas: computeComplexityScore(item),
        sentimen: computeSentimentScore(item),
        verdict: item.result.hasil?.verdict || 'Selesai',
        tanggal: shortDate,
      };
    });
  }, [items, useSimulation]);

  // Aggregate domain data for Domain Bar Chart
  const domainData = useMemo(() => {
    const domainMap: Record<string, { total: number; sumKompleksitas: number; sumSentimen: number }> = {};

    chartData.forEach((d) => {
      const dom = d.domain.split('&')[0].trim();
      if (!domainMap[dom]) {
        domainMap[dom] = { total: 0, sumKompleksitas: 0, sumSentimen: 0 };
      }
      domainMap[dom].total += 1;
      domainMap[dom].sumKompleksitas += d.kompleksitas;
      domainMap[dom].sumSentimen += d.sentimen;
    });

    return Object.entries(domainMap).map(([dom, val]) => ({
      domain: dom,
      rataKompleksitas: Math.round(val.sumKompleksitas / val.total),
      rataSentimen: Math.round(val.sumSentimen / val.total),
      jumlahKasus: val.total,
    }));
  }, [chartData]);

  // Summary Metrics
  const avgComplexity = Math.round(
    chartData.reduce((acc, curr) => acc + curr.kompleksitas, 0) / (chartData.length || 1)
  );
  const avgSentiment = Math.round(
    chartData.reduce((acc, curr) => acc + curr.sentimen, 0) / (chartData.length || 1)
  );

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs max-w-xs space-y-1.5">
          <p className="font-semibold text-white border-b border-slate-800 pb-1">
            {dataPoint.labelLengkap || dataPoint.domain}
          </p>
          <p className="text-[11px] text-slate-400">
            Domain: <span className="text-slate-200">{dataPoint.domain}</span>
          </p>
          {dataPoint.verdict && (
            <p className="text-[11px] text-indigo-300">
              Vonis: <span className="text-slate-200">{dataPoint.verdict}</span>
            </p>
          )}
          <div className="pt-1 border-t border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-indigo-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Kompleksitas:
              </span>
              <span className="font-mono tabular-nums font-bold text-white">
                {dataPoint.kompleksitas || dataPoint.rataKompleksitas} / 100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sentimen / Kelayakan:
              </span>
              <span className="font-mono tabular-nums font-bold text-white">
                {dataPoint.sentimen || dataPoint.rataSentimen} / 100
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Pelacak Tren Kompleksitas & Sentimen Riwayat
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Visualisasi perkembangan derajat kompleksitas masalah dan optimisme kelayakan keputusan antar analisis.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {items.length < 2 && (
            <button
              type="button"
              onClick={() => setUseSimulation(!useSimulation)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                useSimulation
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
              title="Aktifkan simulasi tren untuk preview"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{useSimulation ? 'Mode Simulasi' : 'Data Riil'}</span>
            </button>
          )}

          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Kronologis</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('domain')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'domain'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Domain</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Rata-Rata Kompleksitas
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-indigo-400">
            {avgComplexity} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Indeks Sentimen / Kelayakan
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-emerald-400">
            {avgSentiment} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Total Kasus Dianalisis
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-slate-200">
            {items.length}{' '}
            <span className="text-[10px] text-slate-500 font-normal">
              {useSimulation && items.length < 2 ? '(+Simulasi)' : 'Kasus'}
            </span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Arah Pola Keputusan
          </p>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-indigo-300">
            {avgSentiment >= 70 ? 'Cenderung Optimis' : avgSentiment >= 50 ? 'Moderat Terukur' : 'Konservatif'}
          </p>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-64 sm:h-72 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'timeline' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="gradComplexity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradSentiment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="nama"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={0}
                textAnchor="middle"
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="kompleksitas"
                name="Skor Kompleksitas Masalah"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gradComplexity)"
              />
              <Area
                type="monotone"
                dataKey="sentimen"
                name="Indeks Sentimen / Kelayakan Solusi"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gradSentiment)"
              />
            </AreaChart>
          ) : (
            <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="domain" stroke="#64748b" fontSize={11} tickLine={false} interval={0} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
              <Bar
                dataKey="rataKompleksitas"
                name="Rata-rata Kompleksitas"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="rataSentimen"
                name="Rata-rata Sentimen / Kelayakan"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Explanatory footer notice */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>
          Skor dihitung dari jumlah variabel kritis, kedalaman matriks opsi, dan polaritas vonis keputusan strategis.
        </span>
      </div>
    </div>
  );
};
