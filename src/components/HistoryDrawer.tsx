import React, { useState } from 'react';
import { History, X, Trash2, ArrowRight, Calendar, Search, TrendingUp, ListFilter } from 'lucide-react';
import { AnalysisHistoryItem } from '../types';
import { HistoryTrendTracker } from './HistoryTrendTracker';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: AnalysisHistoryItem[];
  onSelectItem: (item: AnalysisHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  initialTab?: 'list' | 'trends';
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onDeleteItem,
  onClearAll,
  initialTab = 'list',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'trends'>(initialTab);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) =>
    item.problemStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.result.hasil.verdict.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-60 flex justify-end bg-slate-950/75 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl lg:max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Riwayat & Analitik Analisis</h3>
            <span className="text-xs text-slate-400 tabular-nums">
              ({items.length} kasus)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup panel riwayat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: List vs Trends */}
        <div className="px-4 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Daftar Riwayat ({items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'trends'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tren Sentimen & Kompleksitas</span>
            </button>
          </div>

          {items.length > 0 && activeTab === 'list' && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer py-1"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Tab 1: List View */}
        {activeTab === 'list' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/20">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kata kunci masalah, domain, atau vonis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <History className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Belum ada riwayat analisis tersimpan.</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Jalankan analisis pertama Anda di workspace atau buka tab <strong>"Tren Sentimen & Kompleksitas"</strong> untuk melihat visualisasi simulasi.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('trends')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-700/50 hover:bg-indigo-900/40 transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Lihat Simulasi Grafik Tren</span>
                  </button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400">Tidak ada hasil pencarian yang cocok.</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group p-4 rounded-xl bg-slate-950/50 hover:bg-slate-850 border border-slate-800 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span className="font-medium text-indigo-400 text-xs">
                          {item.domain}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 tabular-nums font-mono">
                          <Calendar className="w-2.5 h-2.5 text-slate-500" />
                          {new Date(item.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-white line-clamp-2 mt-1">
                        {item.problemStatement}
                      </p>

                      <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="text-slate-400">Vonis:</span>
                        <span className="text-slate-200">{item.result.hasil.verdict}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onSelectItem(item);
                          onClose();
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer py-1"
                      >
                        <span>Muat ke Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="text-slate-400 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                        title="Hapus riwayat ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Recharts Trend Tracker View */}
        {activeTab === 'trends' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <HistoryTrendTracker
              items={items}
              onSelectItem={(item) => {
                onSelectItem(item);
                onClose();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
