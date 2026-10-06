import { ExampleCase } from '../types';

export const EXAMPLE_CASES: ExampleCase[] = [
  {
    id: 'saas-pricing',
    title: 'Strategi Penetapan Harga SaaS B2B vs Model Freemium',
    domain: 'Strategi Bisnis & Keputusan',
    badge: 'Bisnis & Produk',
    description: 'Evaluasi perpindahan dari freemium ke model tier berbasis nilai pemakaian (usage-based).',
    problem: 'Startup SaaS kami mengalami kenaikan pengguna gratis hingga 85%, namun konversi ke langganan berbayar stagnan di angka 1.2%. Server cost membengkak sedangkan runway tersisa 7 bulan. Apakah kami harus membatasi fitur gratis secara agresif atau beralih sepenuhnya ke free trial 14 hari dengan tiered pricing?',
    context: 'Produk adalah alat kolaborasi tim dengan 45.000 pengguna aktif bulanan (MAU), 540 pelanggan berbayar ($29/bln). Biaya infrastruktur saat ini mencapai $4.200/bln.',
    constraints: 'Tim pengembang hanya 4 engineer; tidak boleh kehilangan basis pengguna organik secara drastis dalam 60 hari ke depan.',
  },
  {
    id: 'cloud-cost',
    title: 'Audit & Penurunan Lonjakan Tagihan Cloud Infrastructure',
    domain: 'Efisiensi Finansial & Operasional',
    badge: 'Finansial & Devops',
    description: 'Analisis pemborosan arsitektur cloud dan mitigasi biaya tanpa menurunkan reliabilitas.',
    problem: 'Biaya cloud bulanan (AWS) meningkat dari $8.000 menjadi $26.000 dalam 3 bulan terakhir tanpa ada lonjakan traffic pengguna yang sebanding. Diduga terdapat unindexed database queries, over-provisioned Kubernetes clusters, dan snapshot penyimpanan data yang tidak dibersihkan. Bagaimana urutan prioritas investigasi dan tindakan pemangkasan biaya?',
    context: 'Aplikasi melayani 200 req/sec puncak. Cluster EKS menjalankan 18 node m5.2xlarge terus-menerus. Database RDS Postgres Multi-AZ berukuran 1.2 TB.',
    constraints: 'SLA uptime minimum 99.9% wajib tetap terjaga; tidak boleh terjadi downtime di jam operasional bisnis.',
  },
  {
    id: 'architecture-migration',
    title: 'Dilema Migrasi Arsitektur Monolith ke Microservices',
    domain: 'Arsitektur & Rekayasa Sistem',
    badge: 'Teknologi & Sistem',
    description: 'Analisis risiko, kompleksitas operasional, dan timing pemecahan arsitektur monolitik.',
    problem: 'Tim engineering berencana memecah aplikasi monolitik backend yang berumur 4 tahun menjadi 12 microservices mandiri dengan alasan deploy blocking antar tim. Namun tim kami belum memiliki tim platform SRE berpengalaman, dan observabilitas masih minim. Apakah sekarang waktu yang tepat atau ada alternatif perantara (modular monolith)?',
    context: 'Tim beranggotakan 14 engineer dalam 3 squad produk. Waktu build-and-test saat ini 28 menit. Frekuensi deploy rata-rata 2 kali per minggu.',
    constraints: 'Target roadmap Q3 mengharuskan peluncuran 2 modul fitur baru untuk klien korporat dalam 45 hari.',
  },
  {
    id: 'churn-retention',
    title: 'Strategi Intervensi Churn Pelanggan E-commerce B2B',
    domain: 'Strategi Bisnis & Keputusan',
    badge: 'Retensi & Konsumen',
    description: 'Menganalisis pemicu pembatalan langganan berulang dan merumuskan sistem retensi proaktif.',
    problem: 'Tingkat churn pelanggan bisnis segmen mid-market naik dari 3.1% menjadi 7.8% dalam kuartal terakhir. Dari exit interview, 40% mengeluhkan onboarding yang lambat dan respons tim support di atas 12 jam, sementara 35% beralih ke kompetitor dengan integrasi ERP lokal. Bagaimana merancang program intervensi retensi 30 hari pertama?',
    context: 'ACV (Annual Contract Value) rata-rata $12.000. Tiap 1% churn setara dengan potensi kehilangan pendapatan tahunan sebesar $180.000.',
    constraints: 'Rekrutmen personil tambahan dibekukan hingga Q4; solusi harus memanfaatkan optimasi alur kerja dan otomatisasi.',
  },
];
