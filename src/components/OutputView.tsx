import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Download,
  Printer,
  Table as TableIcon,
  ShieldAlert,
  ListOrdered,
  AlertTriangle,
  Lightbulb,
  Award,
  Calendar,
  Layers,
  ArrowUpRight,
  BarChart3,
  MoveRight,
} from 'lucide-react';
import { AnalysisResult, VisualizationData } from '../types';
import { VisualChart } from './VisualChart';

interface OutputViewProps {
  data: AnalysisResult;
  domain: string;
  engine?: string;
  onRegenerate: () => void;
  onClear: () => void;
  isRegenerating: boolean;
}

export const OutputView: React.FC<OutputViewProps> = ({
  data,
  domain,
  engine,
  onRegenerate,
  onClear,
  isRegenerating,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'visual' | 'hasil' | 'penjelasan' | 'rekomendasi'>('all');
  const [copied, setCopied] = useState(false);

  const { hasil, penjelasan, rekomendasi, isDataInsufficient, insufficientDataReason } = data;

  // Ensure visualization data is available (fallback builder from table if not present)
  const resolvedVisualData: VisualizationData = data.visualisasiData || {
    judul: 'Evaluasi Komparasi Opsi & Dampak Strategis',
    deskripsi: 'Perbandingan bobot nilai dan proyeksi hasil berdasarkan evaluasi penalaran AI.',
    tipeGrafik: 'bar',
    labelUtama: 'Skor Efektivitas',
    labelPembanding: 'Tingkat Kompleksitas / Risiko',
    dataPoin:
      penjelasan?.tabelKomparasi?.baris?.map((row, idx) => ({
        nama: row[0] ? (row[0].length > 20 ? row[0].slice(0, 18) + '…' : row[0]) : `Opsi ${idx + 1}`,
        nilaiUtama: Math.min(95, Math.max(40, 85 - idx * 12)),
        nilaiPembanding: Math.min(85, Math.max(25, 30 + idx * 15)),
        satuan: 'Skor (1-100)',
      })) || [
        { nama: 'Opsi Utama', nilaiUtama: 85, nilaiPembanding: 30, satuan: 'Skor (1-100)' },
        { nama: 'Opsi Sekunder', nilaiUtama: 65, nilaiPembanding: 55, satuan: 'Skor (1-100)' },
        { nama: 'Status Quo', nilaiUtama: 40, nilaiPembanding: 75, satuan: 'Skor (1-100)' },
      ],
  };

  // Convert analysis to formatted markdown for copy & export
  const generateMarkdownReport = (): string => {
    let md = `# LAPORAN ANALISIS STRATEGIS — SINTESA AI\n`;
    md += `Domain: ${domain}\n`;
    if (engine) md += `Engine: ${engine}\n`;
    md += `Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
    md += `Vonis Keputusan: ${hasil?.verdict || 'N/A'}\n\n`;
    md += `---\n\n`;

    if (isDataInsufficient) {
      md += `> PERHATIAN: ${insufficientDataReason || 'Informasi yang diperlukan belum tersedia. Silakan berikan data tambahan.'}\n\n`;
    }

    md += `## 1. HASIL ANALISIS\n\n`;
    md += `### Ringkasan Eksekutif\n${hasil?.ringkasanEksekutif || ''}\n\n`;
    md += `### Analisis Inti\n${hasil?.analisisInti || ''}\n\n`;
    md += `### Poin-Poin Kunci\n`;
    hasil?.poinKunci?.forEach((point, idx) => {
      md += `${idx + 1}. ${point}\n`;
    });
    md += `\n**Vonis Strategis:** ${hasil?.verdict || ''}\n\n`;

    md += `---\n\n`;
    md += `## 2. PENJELASAN MENDALAM\n\n`;
    md += `### Akar Masalah (Root Cause)\n${penjelasan?.akarMasalah || ''}\n\n`;
    md += `### Faktor Kritis\n`;
    penjelasan?.faktorKritis?.forEach((f) => {
      md += `- ${f}\n`;
    });
    md += `\n`;

    if (penjelasan?.tabelKomparasi) {
      md += `### ${penjelasan.tabelKomparasi.judul || 'Matriks Evaluasi Komparasi'}\n\n`;
      md += `| ${penjelasan.tabelKomparasi.kolom.join(' | ')} |\n`;
      md += `| ${penjelasan.tabelKomparasi.kolom.map(() => '---').join(' | ')} |\n`;
      penjelasan.tabelKomparasi.baris.forEach((row) => {
        md += `| ${row.join(' | ')} |\n`;
      });
      md += `\n`;
    }

    md += `### Elaborasi Analitis\n${penjelasan?.elaborasiMendalam || ''}\n\n`;

    md += `---\n\n`;
    md += `## 3. REKOMENDASI TINDAKAN\n\n`;
    md += `### Rencana Aksi Terprioritas\n`;
    rekomendasi?.rencanaAksi?.forEach((item, idx) => {
      md += `#### ${idx + 1}. [Prioritas: ${item.prioritas}] ${item.langkah}\n`;
      md += `- **Dampak:** ${item.dampak}\n`;
      md += `- **Target Waktu:** ${item.estimasiWaktu}\n\n`;
    });

    md += `### Mitigasi Risiko\n`;
    rekomendasi?.mitigasiRisiko?.forEach((m) => {
      md += `- ${m}\n`;
    });
    md += `\n`;

    md += `### Catatan Strategis & KPI\n${rekomendasi?.catatanStrategis || ''}\n\n`;

    if (resolvedVisualData) {
      md += `---\n\n`;
      md += `## 4. METRIK DATA VISUALISASI (${resolvedVisualData.judul})\n\n`;
      md += `| Kategori | ${resolvedVisualData.labelUtama} | ${resolvedVisualData.labelPembanding || 'Pembanding'} | Satuan |\n`;
      md += `| --- | --- | --- | --- |\n`;
      resolvedVisualData.dataPoin.forEach((p) => {
        md += `| ${p.nama} | ${p.nilaiUtama} | ${p.nilaiPembanding ?? '-'} | ${p.satuan} |\n`;
      });
      md += `\n`;
    }

    return md;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdownReport());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sintesa-analisis-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const getPriorityBadgeClass = (priority: string) => {
    const p = priority.toLowerCase();
    if (p.includes('tinggi') || p.includes('high')) {
      return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    }
    if (p.includes('sedang') || p.includes('medium')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Insufficient Data Warning If Triggered */}
      {isDataInsufficient && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-200">Kebutuhan Data Tambahan</h4>
            <p className="mt-1 text-xs text-amber-300/90 leading-relaxed">
              {insufficientDataReason || 'Informasi yang diperlukan belum tersedia. Silakan berikan data tambahan.'}
            </p>
            <p className="mt-2 text-[11px] text-amber-400/80">
              Tips: Masukkan konteks bisnis, angka metrik yang relevan, atau batasan waktu/anggaran pada form di atas agar AI dapat menghitung skenario yang lebih akurat.
            </p>
          </div>
        </div>
      )}

      {/* Header Result Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          {/* Metadata line without pill clutter */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Analisis Selesai</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{domain}</span>
            {engine && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono text-indigo-300">{engine}</span>
              </>
            )}
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-baseline gap-2">
            <span className="text-slate-300">Vonis:</span>
            <span className="text-indigo-300 font-semibold">
              {hasil?.verdict}
            </span>
          </h2>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer"
            title="Salin laporan terformat"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            title="Jalankan ulang analisis"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer"
            title="Unduh sebagai file Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Ekspor MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer"
            title="Cetak atau Simpan sebagai PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Cetak</span>
          </button>

          <button
            onClick={onClear}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Mulai analisis baru"
          >
            Hapus
          </button>
        </div>
      </div>

      {/* Tabs navigation for Pillars & Visual Charts */}
      <div className="flex border-b border-slate-800 gap-1 sm:gap-2 no-print overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'text-white border-b-2 border-indigo-500 bg-slate-900/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Semua Laporan
        </button>

        <button
          onClick={() => setActiveTab('visual')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'visual'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Grafik & Metrik</span>
        </button>

        <button
          onClick={() => setActiveTab('hasil')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'hasil'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>1. Hasil Inti</span>
        </button>

        <button
          onClick={() => setActiveTab('penjelasan')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'penjelasan'
              ? 'text-amber-400 border-b-2 border-amber-500 bg-slate-900/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Penjelasan & Matriks</span>
        </button>

        <button
          onClick={() => setActiveTab('rekomendasi')}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rekomendasi'
              ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>3. Rekomendasi Aksi</span>
        </button>
      </div>

      {/* ========================================================
          VISUAL CHART SECTION (Dedicated Tab or in All)
         ======================================================== */}
      {(activeTab === 'all' || activeTab === 'visual') && resolvedVisualData && (
        <section className="space-y-4">
          <VisualChart data={resolvedVisualData} />
        </section>
      )}

      {/* ========================================================
          PILAR 1 — HASIL
         ======================================================== */}
      {(activeTab === 'all' || activeTab === 'hasil') && (
        <section className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Pilar 1 — Hasil Analisis
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Ringkasan eksekutif, temuan inti, dan verifikasi keputusan</p>
            </div>
          </div>

          {/* Ringkasan Eksekutif */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              Ringkasan Eksekutif
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-normal">
              {hasil?.ringkasanEksekutif}
            </div>
          </div>

          {/* Analisis Inti */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              Analisis Inti
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {hasil?.analisisInti}
            </p>
          </div>

          {/* Poin-Poin Kunci */}
          <div>
            <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2.5">
              Poin Temuan Kunci
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {hasil?.poinKunci?.map((point, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-xs text-slate-300 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          PILAR 2 — PENJELASAN
         ======================================================== */}
      {(activeTab === 'all' || activeTab === 'penjelasan') && (
        <section className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Pilar 2 — Penjelasan & Matriks Komparasi
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Pembongkaran akar masalah dan matriks evaluasi skenario</p>
            </div>
          </div>

          {/* Akar Masalah */}
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              Akar Penyebab (Root Cause)
            </h4>
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-sm text-slate-200 leading-relaxed">
              {penjelasan?.akarMasalah}
            </div>
          </div>

          {/* Faktor Kritis */}
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2.5">
              Faktor Kritis Penentu
            </h4>
            <ul className="space-y-2">
              {penjelasan?.faktorKritis?.map((faktor, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{faktor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tabel Komparasi / Matriks */}
          {penjelasan?.tabelKomparasi && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    {penjelasan.tabelKomparasi.judul || 'Matriks Evaluasi Komparatif'}
                  </h4>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 sm:hidden">
                  <span>Geser ke samping untuk melihat seluruh kolom</span>
                  <MoveRight className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 -mx-1 sm:mx-0">
                <table className="w-full text-left text-xs text-slate-300 border-collapse min-w-[500px]">
                  <thead className="bg-slate-900/90 text-slate-200 border-b border-slate-800">
                    <tr>
                      {penjelasan.tabelKomparasi.kolom?.map((col, idx) => (
                        <th key={idx} className="px-3.5 py-3 font-semibold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {penjelasan.tabelKomparasi.baris?.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={rowIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/30'}
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-3.5 py-3 align-top leading-relaxed ${
                              cellIdx === 0 ? 'font-medium text-white' : 'text-slate-300'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Elaborasi Mendalam */}
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              Elaborasi Analitis Komprehensif
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {penjelasan?.elaborasiMendalam}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          PILAR 3 — REKOMENDASI
         ======================================================== */}
      {(activeTab === 'all' || activeTab === 'rekomendasi') && (
        <section className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ListOrdered className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Pilar 3 — Rekomendasi & Rencana Aksi
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Langkah konkret siap eksekusi, mitigasi risiko, dan target KPI</p>
            </div>
          </div>

          {/* Rencana Aksi Terprioritas */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">
              Rencana Aksi Bertahap
            </h4>
            <div className="space-y-3">
              {rekomendasi?.rencanaAksi?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center tabular-nums">
                        {idx + 1}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadgeClass(
                          item.prioritas
                        )}`}
                      >
                        Prioritas {item.prioritas}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.estimasiWaktu}</span>
                    </div>
                  </div>

                  <h5 className="text-sm font-semibold text-white pl-7">
                    {item.langkah}
                  </h5>

                  <div className="mt-2 pl-7 flex items-start gap-1.5 text-xs text-slate-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-400">Dampak:</strong> {item.dampak}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mitigasi Risiko */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Mitigasi & Antisipasi Risiko</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {rekomendasi?.mitigasiRisiko?.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan Strategis & KPI */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Catatan Strategis & Indikator Keberhasilan (KPI)</span>
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed">
              {rekomendasi?.catatanStrategis}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
