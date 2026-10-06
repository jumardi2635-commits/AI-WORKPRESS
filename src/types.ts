export interface ChartDataPoint {
  nama: string;
  nilaiUtama: number;
  nilaiPembanding?: number;
  satuan: string;
}

export interface VisualizationData {
  judul: string;
  deskripsi: string;
  tipeGrafik: 'bar' | 'line' | 'radar' | 'area';
  labelUtama: string;
  labelPembanding?: string;
  dataPoin: ChartDataPoint[];
}

export interface AnalysisResult {
  isDataInsufficient?: boolean;
  insufficientDataReason?: string;
  hasil: {
    ringkasanEksekutif: string;
    analisisInti: string;
    poinKunci: string[];
    verdict: string;
  };
  penjelasan: {
    akarMasalah: string;
    faktorKritis: string[];
    tabelKomparasi: {
      judul: string;
      kolom: string[];
      baris: string[][];
    };
    elaborasiMendalam: string;
  };
  rekomendasi: {
    rencanaAksi: {
      prioritas: 'Tinggi' | 'Sedang' | 'Rendah' | string;
      langkah: string;
      dampak: string;
      estimasiWaktu: string;
    }[];
    mitigasiRisiko: string[];
    catatanStrategis: string;
  };
  visualisasiData?: VisualizationData;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  problemStatement: string;
  domain: string;
  context?: string;
  constraints?: string;
  result: AnalysisResult;
}

export interface ExampleCase {
  id: string;
  title: string;
  domain: string;
  badge: string;
  description: string;
  problem: string;
  context: string;
  constraints: string;
}
