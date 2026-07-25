# Dokumentasi Komponen Dashboard - Bang Jelantah PWK

Dokumentasi ini merangkum semua komponen dashboard yang terdapat di folder `src/components/dashboard/`. Setiap komponen dirancang untuk menampilkan data real-time dari Supabase dengan visualisasi yang informatif dan interaktif.

---

## 📋 Daftar Komponen

| No  | Komponen                           | File                                   | Deskripsi Singkat                                                      |
| --- | ---------------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| 1   | **KPICard**                        | `KPICard.astro`                        | Kartu KPI stok komoditas gudang (6 item) dengan mutasi harian realtime |
| 2   | **LeaderboardMitra**               | `LeaderboardMitra.astro`               | Leaderboard Top 5 Mitra berdasarkan total setoran per bulan            |
| 3   | **DepositMitraRealtime**           | `DepositMitraRealtime.astro`           | Monitor realtime saldo deposit mitra (DP) dengan tabel detail          |
| 4   | **PengeluaranMetricsWithProgress** | `PengeluaranMetricsWithProgress.astro` | Rekap pengeluaran harian/bulanan dengan progress bar per kategori      |
| 5   | **PembelianMetricsWithProgress**   | `PembelianMetricsWithProgress.astro`   | Rekap pembelian lunas harian/bulanan dengan progress bar per mitra     |
| 6   | **StatistikHarga**                 | `StatistikHarga.astro`                 | Statistik harga komoditas (min/max/avg) per periode                    |
| 7   | **TransaksiKomoditasChart**        | `TransaksiKomoditasChart.astro`        | Chart batang transaksi per komoditas (Chart.js)                        |
| 8   | **SumberTransaksiChart**           | `SumberTransaksiChart.astro`           | Chart donut sumber transaksi (Mitra/Non-Mitra)                         |
| 9   | **TransaksiGudangHarian**          | `TransaksiGudangHarian.astro`          | Tabel transaksi gudang harian dengan filter tanggal                    |

---

## 📦 Detail Setiap Komponen

---

### 1. KPICard.astro

**Lokasi:** `src/components/dashboard/KPICard.astro`

**Fungsi Utama:**

- Menampilkan 6 kartu KPI stok gudang untuk komoditas: Minyak Jelantah, Minyak Asting, Ampas, Kriuk, Spinner, Tepung
- Menampilkan stok realtime dari tabel `gudang_komoditas`
- Menampilkan mutasi harian (Masuk/Keluar) dari tabel `gudang_mutasi` untuk hari ini (WIB)

**Struktur Data:**

```javascript
const kpiCards = [
  {
    id: "minyak_jelantah",
    title: "Minyak Jelantah",
    icon: "/icons/6.png",
    gradient: "from-primary-container...",
  },
  {
    id: "minyak_asting",
    title: "Minyak Asting",
    icon: "/icons/6.png",
    gradient: "from-indigo-container...",
  },
  {
    id: "ampas",
    title: "Ampas",
    icon: "/icons/7.png",
    gradient: "from-secondary-container...",
  },
  {
    id: "kriuk",
    title: "Kriuk",
    icon: "/icons/8.png",
    gradient: "from-tertiary-container...",
  },
  {
    id: "spinner",
    title: "Spinner",
    icon: "/icons/9.png",
    gradient: "from-error-container...",
  },
  {
    id: "tepung",
    title: "Tepung",
    icon: "/icons/10.png",
    gradient: "from-success-container...",
  },
];
```

**Query Database:**

1. `gudang_komoditas` - SELECT `id, stok` (realtime stok)
2. `gudang_mutasi` - SELECT `jumlah, jenis_mutasi` WHERE `komoditas_id` = ? AND `tanggal` BETWEEN hari ini 00:00 - 23:59 WIB

**Fitur UI:**

- Grid responsive: 1 kolom (mobile) → 2 kolom (md) → 5 kolom (lg)
- Gradient background per kartu dengan warna brand
- Icon komoditas di kanan atas
- Animasi hover (shadow + scale background)
- Loading state "..." untuk stok, "Loading mutasi..." untuk mutasi

**Event Listener:**

- `DOMContentLoaded` → `fetchRealtimeDashboard()`
- `Promise.all` untuk fetch mutasi paralel 6 komoditas

---

### 2. LeaderboardMitra.astro

**Lokasi:** `src/components/dashboard/LeaderboardMitra.astro`

**Fungsi Utama:**

- Menampilkan Top 5 Mitra berdasarkan total setoran per bulan
- Filter per kategori komoditas: Total Keseluruhan, Minyak, Ampas, Kriuk, Tepung, Spinner
- Navigasi bulan (Prev/Next) dengan batasan tidak bisa ke masa depan
- Visualisasi progress bar horizontal per mitra

**Sumber Data:**

- View/Tabel: `leaderboard_bulanan_mitra`
- Kolom: `periode` (format "MM YYYY"), `nama_mitra`, `total_keseluruhan`, `minyak_jelantah`, `ampas`, `kriuk`, `tepung`, `spinner`

**State Management:**

```javascript
let viewDate = new Date(); // Bulan yang dilihat
const realCurrentDate = new Date(); // Bulan aktual (batas navigasi)
let activeCategory = "total_keseluruhan";
```

**Fitur UI:**

- Header dengan navigasi bulan (Prev/Next) + label "Bulan Ini" / "MMM YYYY"
- Filter chips horizontal scroll (Semua, Minyak, Ampas, Kriuk, Tepung, Spinner)
- Card list dengan:
  - Medal visual: 🥇 Emas, 🥈 Perak, 🥉 Perunggu
  - Progress bar background (width = percentage dari max value)
  - Nama mitra + total KG
- Empty state ilustratif
- Loading spinner

**Event Listeners:**

- `prev-month` / `next-month` click → update `viewDate` → `fetchLeaderboard()`
- Filter button click → update `activeCategory` → `fetchLeaderboard()`
- Auto-init pada load

---

### 3. DepositMitraRealtime.astro

**Lokasi:** `src/components/dashboard/DepositMitraRealtime.astro`

**Fungsi Utama:**

- Monitor realtime saldo deposit (DP) mitra
- Tabel detail: Tanggal Transfer, Nama Mitra, Area/Rute, Jumlah Order, Saldo DP Aktif
- Total keseluruhan DP di header
- Tombol refresh manual

**Sumber Data:**

- Tabel: `mitra`
- Query: SELECT `nama_mitra, updated_at, rute_jemput, total_order, deposit` WHERE `deposit > 0` ORDER BY `deposit DESC`

**Fitur UI:**

- Card dengan header gradient text (Primary → Secondary)
- Total DP besar di kanan atas
- Tabel responsive (kolom Area & Order hidden di mobile)
- Sticky header tabel
- Zebra striping baris (putih / abu-abu muda)
- Hover effect baris
- Format rupiah (IDR) & tanggal (ID locale)
- Loading state + error state
- Global function `window.fetchDepositMitra()` untuk refresh manual

**Event Listener:**

- `DOMContentLoaded` → auto fetch
- Button `onclick="window.fetchDepositMitra()"`

---

### 4. PengeluaranMetricsWithProgress.astro

**Lokasi:** `src/components/dashboard/PengeluaranMetricsWithProgress.astro`

**Fungsi Utama:**

- Rekap pengeluaran harian/bulanan dengan progress bar per kategori
- Toggle Harian/Bulanan dengan date picker / month picker
- Kategori: Operasional, Gaji, Pajak, Lainnya, Total
- Warna tema: Merah/Orange (membedakan dari Pembelian & Penjualan)

**Sumber Data:**

- Tabel: `pengeluaran`
- Query: SELECT `*` WHERE `tanggal` (harian) / `tanggal` LIKE 'YYYY-MM%' (bulanan) ORDER BY `tanggal DESC`

**State & Logic:**

```javascript
// Toggle mode
window.togglePengeluaran('harian' | 'bulanan')

// Date pickers
#pengeluaran-date-picker (type=date)
#pengeluaran-month-picker (type=month)

// Kategori & Warna
const categories = [
  { key: 'operasional', label: 'Operasional', color: 'bg-red-500' },
  { key: 'gaji', label: 'Gaji Karyawan', color: 'bg-orange-500' },
  { key: 'pajak', label: 'Pajak & Biaya', color: 'bg-amber-500' },
  { key: 'lainnya', label: 'Lainnya', color: 'bg-gray-500' },
];
```

**Fitur UI:**

- Toggle button group (Harian/Bulanan) dengan indikator aktif
- Date/Month picker conditional show/hide
- List progress bar: Label + Nominal + Bar (width = % dari total)
- Total pengeluaran di footer dengan warna sesuai mode
- Loading & error state
- Custom scrollbar

**Event Listeners:**

- Toggle buttons → `window.togglePengeluaran(tipe)`
- Date picker change → reload harian
- Month picker change → reload bulanan
- Auto-init harian pada load

---

### 5. PembelianMetricsWithProgress.astro

**Lokasi:** `src/components/dashboard/PembelianMetricsWithProgress.astro`

**Fungsi Utama:**

- Rekap pembelian lunas (is_paid_by_admin = true) harian/bulanan
- Group by Mitra + Metode Bayar (gabungan jadi label: "Budi (Transfer)")
- Progress bar per mitra dengan warna biru/sky/indigo
- Toggle Harian/Bulanan

**Sumber Data:**

- Tabel: `transaksi` dengan relasi `penjemputan(tanggal, mitra(nama_mitra))`
- Filter: `is_paid_by_admin = true`
- Limit 1000 record terbaru (di-filter di client-side JS)

**Logika Pengolahan Data:**

```javascript
// Key unik: "${namaMitra} (${metodeText})"
// Metode bayar: metode_bayar + (metode_bayar_2 ? ` & ${metode_bayar_2}` : '')
// Tanggal: penjemputan.tanggal || tanggal_transaksi || created_at
// Group & sum grand_total per key
// Sort descending by value
```

**Warna Palette (Biru/Sky/Indigo):**

```javascript
const colorPalette = [
  "bg-blue-600",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-cyan-600",
  "bg-blue-800",
  "bg-sky-700",
  "bg-indigo-700",
];
```

**Fitur UI:**

- Sama struktur dengan PengeluaranMetrics tapi warna biru
- Label "Total Lunas Hari Ini" / "Total Akumulasi Bulanan"
- Progress bar per mitra+metode
- Custom scrollbar

**Event Listeners:**

- `window.togglePembelian('harian'|'bulanan')`
- Date/Month picker change
- Auto-init harian

---

### 6. StatistikHarga.astro

**Lokasi:** `src/components/dashboard/StatistikHarga.astro`

**Fungsi Utama:**

- Menampilkan statistik harga komoditas: Min, Max, Rata-rata
- Filter periode: Harian / Bulanan
- Data dari transaksi pembelian (transaksi + penjemputan)

**Sumber Data:**

- Tabel: `transaksi` dengan relasi `penjemputan(mitra(nama_mitra))`
- Filter: `is_paid_by_admin = true`
- Group by komoditas (dari detail transaksi)

**Fitur UI:**

- Card grid 3 kolom (Min/Max/Avg) per komoditas
- Toggle Harian/Bulanan
- Date/Month picker
- Loading skeleton

---

### 7. TransaksiKomoditasChart.astro

**Lokasi:** `src/components/dashboard/TransaksiKomoditasChart.astro`

**Fungsi Utama:**

- Chart batang (Bar Chart) volume transaksi per komoditas
- Menggunakan Chart.js
- Filter periode: Harian / Bulanan

**Sumber Data:**

- Tabel: `transaksi` + `penjemputan` + detail komoditas
- Aggregate SUM volume per komoditas

**Fitur UI:**

- Canvas Chart.js responsive
- Legend komoditas
- Toggle periode
- Loading state

---

### 8. SumberTransaksiChart.astro

**Lokasi:** `src/components/dashboard/SumberTransaksiChart.astro`

**Fungsi Utama:**

- Chart donut/pie proporsi sumber transaksi: Mitra vs Non-Mitra
- Menggunakan Chart.js

**Sumber Data:**

- Tabel: `transaksi`
- Group by: `nama_mitra_tidak_terdaftar` IS NULL → "Mitra" : "Non-Mitra"
- Count transaksi

**Fitur UI:**

- Donut chart dengan legend
- Persentase & jumlah
- Responsive

---

### 9. TransaksiGudangHarian.astro

**Lokasi:** `src/components/dashboard/TransaksiGudangHarian.astro`

**Fungsi Utama:**

- Tabel transaksi gudang harian (mutasi masuk/keluar)
- Filter tanggal
- Kolom: Tanggal, Komoditas, Jenis Mutasi, Volume, Keterangan

**Sumber Data:**

- Tabel: `gudang_mutasi` dengan join `gudang_komoditas(nama)`
- Filter by tanggal

**Fitur UI:**

- Date picker
- Tabel responsive
- Sorting kolom
- Pagination / load more
- Export CSV (jika ada)

---

## 🎨 Design System & Styling

### Warna Tema per Kategori:

| Kategori              | Warna Utama                | Warna Progress Bar                            | Keterangan         |
| --------------------- | -------------------------- | --------------------------------------------- | ------------------ |
| **Pembelian (Lunas)** | Blue/Sky/Indigo            | `bg-blue-600`, `bg-sky-500`, `bg-indigo-500`  | Masuk/Uang Masuk   |
| **Pengeluaran**       | Red/Orange/Amber           | `bg-red-500`, `bg-orange-500`, `bg-amber-500` | Keluar/Uang Keluar |
| **Penjualan**         | Green/Emerald              | `bg-green-500`, `bg-emerald-500`              | Revenue            |
| **Stok/Gudang**       | Primary/Secondary/Tertiary | Gradient containers                           | Inventory          |
| **Leaderboard**       | Amber/Slate/Orange         | Medal colors                                  | Ranking            |

### Utility Classes (Tailwind-like):

- `.custom-scrollbar` - Scrollbar tipis custom
- `.hide-scrollbar` - Sembunyikan scrollbar
- `.bg-surface-container-lowest` - Background card
- `.border-outline-variant` - Border subtle
- `.text-on-surface` / `.text-on-surface-variant` - Text colors
- `.font-headline-md`, `.font-display-data`, `.font-label-sm` - Typography scale

---

## 🔧 Dependensi Teknis

### Supabase Client

Semua komponen menggunakan `window.supabase` yang di-inisialisasi di `Layout.astro` atau halaman parent.

```javascript
const client = window.supabase;
if (!client) return console.error("Supabase client tidak ditemukan!");
```

### Format Tanggal (WIB/UTC+7)

```javascript
const now = new Date();
const offset = now.getTimezoneOffset() * 60000;
const todayStr = new Date(now - offset).toISOString().split("T")[0]; // YYYY-MM-DD
```

### Format Rupiah

```javascript
const formatRupiah = (num) =>
  "Rp " + Number(num).toLocaleString("id-ID", { minimumFractionDigits: 0 });
// Atau pakai Intl.NumberFormat untuk DepositMitraRealtime
```

### Global Functions Pattern

Komponen yang butuh refresh manual mengekspos fungsi ke `window`:

```javascript
window.fetchDepositMitra = fetchDepositMitra;
window.togglePembelian = togglePembelian;
window.togglePengeluaran = togglePengeluaran;
window.loadPembelianData = loadPembelianData;
```

---

## 📱 Responsive Breakpoints

| Breakpoint          | Grid KPICard | Tabel Deposit         | Filter Leaderboard |
| ------------------- | ------------ | --------------------- | ------------------ |
| Mobile (< 640px)    | 1 kolom      | Horizontal scroll     | Horizontal scroll  |
| Tablet (640-1024px) | 2 kolom      | 4 kolom (Area hidden) | 2-3 per row        |
| Desktop (> 1024px)  | 5 kolom      | 5 kolom penuh         | 1 row              |

---

## 🔄 Real-time & Auto-refresh

| Komponen              | Real-time Supabase   | Auto-refresh | Manual Refresh      |
| --------------------- | -------------------- | ------------ | ------------------- |
| KPICard               | ❌ (polling on load) | ❌           | ❌                  |
| LeaderboardMitra      | ❌                   | ❌           | ❌ (navigasi bulan) |
| DepositMitraRealtime  | ❌                   | ❌           | ✅ Button           |
| PengeluaranMetrics    | ❌                   | ❌           | ❌ (date change)    |
| PembelianMetrics      | ❌                   | ❌           | ❌ (date change)    |
| StatistikHarga        | ❌                   | ❌           | ❌                  |
| Charts                | ❌                   | ❌           | ❌                  |
| TransaksiGudangHarian | ❌                   | ❌           | ❌ (date change)    |

> **Catatan:** Semua komponen saat ini menggunakan fetch on-demand (on load / on filter change). Belum menggunakan Supabase Realtime subscriptions.

---

## 📂 Struktur File Terkait

```
src/
├── components/
│   └── dashboard/
│       ├── KPICard.astro
│       ├── LeaderboardMitra.astro
│       ├── DepositMitraRealtime.astro
│       ├── PengeluaranMetricsWithProgress.astro
│       ├── PembelianMetricsWithProgress.astro
│       ├── StatistikHarga.astro
│       ├── TransaksiKomoditasChart.astro
│       ├── SumberTransaksiChart.astro
│       └── TransaksiGudangHarian.astro
├── pages/
│   ├── index.astro          # Dashboard utama (menggunakan komponen di atas)
│   ├── gudang.astro         # Halaman gudang (menggunakan KPICard, TransaksiGudangHarian)
│   ├── pembelian.astro      # Halaman pembelian (menggunakan PembelianMetrics)
│   ├── pengeluaran.astro    # Halaman pengeluaran (menggunakan PengeluaranMetrics)
│   └── kemitraan.astro      # Halaman kemitraan (menggunakan Leaderboard, DepositMitra)
├── lib/
│   └── supabase.ts          # Supabase client initialization
└── layouts/
    └── Layout.astro         # Layout utama + supabase client init
```

---

## 🚀 Cara Penggunaan di Halaman

Contoh di `src/pages/index.astro` (Dashboard Utama):

```astro
---
import KPICard from "../components/dashboard/KPICard.astro";
import LeaderboardMitra from "../components/dashboard/LeaderboardMitra.astro";
import DepositMitraRealtime from "../components/dashboard/DepositMitraRealtime.astro";
import PengeluaranMetricsWithProgress from "../components/dashboard/PengeluaranMetricsWithProgress.astro";
import PembelianMetricsWithProgress from "../components/dashboard/PembelianMetricsWithProgress.astro";
import TransaksiKomoditasChart from "../components/dashboard/TransaksiKomoditasChart.astro";
import SumberTransaksiChart from "../components/dashboard/SumberTransaksiChart.astro";
---

<main class="grid gap-6 p-6 lg:grid-cols-12">
  <!-- Row 1: KPI Cards (Full width) -->
  <section class="lg:col-span-12">
    <KPICard />
  </section>

  <!-- Row 2: Charts & Metrics -->
  <section class="lg:col-span-6">
    <TransaksiKomoditasChart />
  </section>
  <section class="lg:col-span-6">
    <SumberTransaksiChart />
  </section>

  <!-- Row 3: Financial Metrics -->
  <section class="lg:col-span-6">
    <PengeluaranMetricsWithProgress />
  </section>
  <section class="lg:col-span-6">
    <PembelianMetricsWithProgress />
  </section>

  <!-- Row 4: Mitra Monitoring -->
  <section class="lg:col-span-6">
    <LeaderboardMitra />
  </section>
  <section class="lg:col-span-6">
    <DepositMitraRealtime />
  </section>
</main>
```

---

## 📝 Catatan Pengembangan

### TODO / Improvement Ideas:

1. **Real-time Subscriptions** - Migrasi ke Supabase Realtime untuk update otomatis tanpa refresh
2. **Caching** - Implement SWR/React Query pattern untuk caching data
3. **Error Boundary** - Wrapper error handling yang konsisten
4. **Skeleton Loaders** - Loading state yang lebih smooth
5. **Export Data** - Tombol export CSV/Excel untuk tabel
6. **Date Range Picker** - Ganti single date picker jadi range picker untuk fleksibilitas
7. **Unit Tests** - Test logic `processDataPembelian`, `processDataPengeluaran`, dll
8. **TypeScript Strict** - Perbaiki `any` types di script sections
9. **Accessibility** - ARIA labels, keyboard navigation untuk filter buttons
10. **Chart.js Optimization** - Lazy load Chart.js hanya saat komponen visible

### Known Issues:

- `TransaksiKomoditasChart` & `SumberTransaksiChart` memerlukan Chart.js di global / import
- `StatistikHarga` & `TransaksiGudangHarian` belum dibaca detail implementasinya
- Date handling pakai local timezone (WIB) manual, pertimbangkan library `date-fns-tz` atau `luxon`
- Beberapa komponen expose fungsi ke `window` - potential conflict jika dipakai multiple kali di halaman yg sama

---

## 📅 Last Updated

**23 Juli 2026** - Dokumentasi awal berdasarkan codebase saat ini

---

_Dokumen ini di-generate otomatis dari analisis source code. Update saat ada perubahan signifikan pada komponen._
