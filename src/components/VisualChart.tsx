import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  Layers,
  Info,
} from 'lucide-react';
import { VisualizationData } from '../types';

interface VisualChartProps {
  data: VisualizationData;
}

export const VisualChart: React.FC<VisualChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'bar' | 'area' | 'line' | 'radar'>(
    data.tipeGrafik || 'bar'
  );

  if (!data || !data.dataPoin || data.dataPoin.length === 0) {
    return null;
  }

  const { judul, deskripsi, labelUtama, labelPembanding, dataPoin } = data;
  const primaryUnit = dataPoin[0]?.satuan || '';

  // Calculate quick metrics for summary cards
  const values = dataPoin.map((p) => p.nilaiUtama);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const avgVal = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

  // Custom Dark Mode Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="font-semibold text-white mb-1.5 border-b border-slate-800 pb-1">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-white">
                {entry.value} <span className="text-[11px] font-normal text-slate-400">{primaryUnit}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Visualisasi Data Pendukung
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-semibold">{judul}</p>
          {deskripsi && (
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">{deskripsi}</p>
          )}
        </div>

        {/* Chart Type Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartType === 'bar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Grafik Batang"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Batang</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartType === 'area'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Grafik Area Tren"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartType === 'line'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Grafik Garis"
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Garis</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('radar')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chartType === 'radar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Grafik Radar Dimensi"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Radar</span>
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={dataPoin} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="nama"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar
                dataKey="nilaiUtama"
                name={labelUtama || 'Nilai Utama'}
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
              {dataPoin.some((d) => d.nilaiPembanding !== undefined) && (
                <Bar
                  dataKey="nilaiPembanding"
                  name={labelPembanding || 'Pembanding / Risiko'}
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              )}
            </BarChart>
          ) : chartType === 'area' ? (
            <AreaChart data={dataPoin} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <defs>
                <linearGradient id="areaGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="areaGradientSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
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
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="nilaiUtama"
                name={labelUtama || 'Nilai Utama'}
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaGradientPrimary)"
              />
              {dataPoin.some((d) => d.nilaiPembanding !== undefined) && (
                <Area
                  type="monotone"
                  dataKey="nilaiPembanding"
                  name={labelPembanding || 'Pembanding / Risiko'}
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#areaGradientSecondary)"
                />
              )}
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart data={dataPoin} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="nama"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="nilaiUtama"
                name={labelUtama || 'Nilai Utama'}
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#1e1b4b' }}
                activeDot={{ r: 6 }}
              />
              {dataPoin.some((d) => d.nilaiPembanding !== undefined) && (
                <Line
                  type="monotone"
                  dataKey="nilaiPembanding"
                  name={labelPembanding || 'Pembanding / Risiko'}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#10b981' }}
                />
              )}
            </LineChart>
          ) : (
            <RadarChart data={dataPoin} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="nama" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis stroke="#64748b" fontSize={10} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Radar
                name={labelUtama || 'Nilai Utama'}
                dataKey="nilaiUtama"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.4}
              />
              {dataPoin.some((d) => d.nilaiPembanding !== undefined) && (
                <Radar
                  name={labelPembanding || 'Pembanding / Risiko'}
                  dataKey="nilaiPembanding"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              )}
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Nilai Puncak (Max)
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-indigo-400">
            {maxVal} <span className="text-[10px] text-slate-400 font-normal">{primaryUnit}</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Nilai Terendah (Min)
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-emerald-400">
            {minVal} <span className="text-[10px] text-slate-400 font-normal">{primaryUnit}</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Rata-Rata (Avg)
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-amber-400">
            {avgVal} <span className="text-[10px] text-slate-400 font-normal">{primaryUnit}</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Titik Data
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono tabular-nums font-bold text-slate-200">
            {dataPoin.length} <span className="text-[10px] text-slate-400 font-normal">Kategori</span>
          </p>
        </div>
      </div>

      {/* Micro-insight footline */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>
          Grafik dirender secara dinamis berbasis kalkulasi metrik penalaran AI untuk mendukung evaluasi kuantitatif.
        </span>
      </div>
    </div>
  );
};
