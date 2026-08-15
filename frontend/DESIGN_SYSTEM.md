# SCIC Design System — Pitch-Black Contiguous Grid Outline

Panduan resmi desain antarmuka (*UI/UX Design System*) untuk Supply Chain Intelligence Center (SCIC).
Dokumen ini menjadi standar acuan baku bagi developer maupun AI assistant agar seluruh halaman dan fitur baru konsisten.

---

## 1. Filosofi Desain

* **Aesthetic:** *Pitch-Black Minimal Contiguous Grid* (Terinspirasi dari modern high-density data analytics & developer dashboards).
* **Karakteristik Utama:**
  * Background absolut hitam (`#000000`).
  * Grid tanpa jarak (`gap-0`) dengan garis pemisah presisi 1px (`border-white/10`).
  * Sudut tegas tanpa radius (`rounded-none`) pada sel grid dashboard.
  * Hierarki tipografi berbasis opasitas putih (`text-white`, `text-white/70`, `text-white/40`, `text-white/30`).
  * Aksen status fungsional (Emerald untuk aman/naik, Red untuk risiko/turun, Amber untuk peringatan).

---

## 2. Palet Warna & Token (Color Tokens)

| Token / Elemen | Nilai HEX / Tailwind Class | Fungsi & Kegunaan |
| :--- | :--- | :--- |
| **Canvas Background** | `#000000` / `bg-[#000000]` / `bg-black` | Latar belakang halaman & sel utama |
| **Surface Elevated** | `#121212` / `bg-[#121212]` | Dropdown menu, popover, modal drawer |
| **Cell Hover** | `hover:bg-white/[0.02]` | Efek highlight lembut saat kursor di atas sel grid |
| **Grid Outline Border** | `border-white/10` (`rgba(255,255,255,0.1)`) | Garis grid pembatas 1px antar sel |
| **Interactive Border** | `border-white/20` | Border tombol, avatar, input focus, hover card |
| **Glass Effect** (Landing/Hero) | `.liquid-glass` | Aksen khusus untuk landing page & hero floating cards |

### Opasitas Teks (Text Opacity Hierarchy)
* **Primary (100%):** `text-white` — Nilai angka KPI, judul section utama, nama menu aktif.
* **Secondary (70%):** `text-white/70` — Label metrik, judul sub-panel, item list.
* **Muted (40%):** `text-white/40` — Deskripsi, periode waktu (*"vs last week"*), subtitle.
* **Meta (30%):** `text-white/30` — Copyright, status footer, timestamp, audit ID.

### Warna Status & Aksen (Semantic Indicators)
* **Positive / Synced / Success:** `text-emerald-400` | Background: `bg-emerald-500/10` | Border: `border-emerald-500/20`
* **Negative / Risk / Destructive:** `text-red-400` | Background: `bg-red-500/10` | Border: `border-red-500/20`
* **Warning / Discrepancy / Attention:** `text-amber-400` | Background: `bg-amber-500/10` | Border: `border-amber-500/20`
* **AI / Informational:** `text-blue-400` | Background: `bg-blue-500/10` | Border: `border-blue-500/20`

---

## 3. Aturan Grid Layout (The Contiguous Outline System)

Untuk menghasilkan layout sel yang menyatu rapi tanpa ketebalan border ganda (*double borders*):

### Formula Grid:
1. **Parent Container:**
   * Harus memiliki `gap-0`
   * Diberi border luar bagian **atas** dan **kiri**: `border-t border-l border-white/10`
2. **Child Cells (Kartu / Panel):**
   * Diberi border bagian **bawah** dan **kanan**: `border-b border-r border-white/10`
   * `rounded-none`
   * `bg-[#000000]`
   * `p-5` atau `p-6`

### Contoh Kode:
```tsx
{/* Container Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/10">
  
  {/* Sel 1 */}
  <div className="p-6 bg-[#000000] border-b border-r border-white/10 rounded-none hover:bg-white/[0.02] transition-colors">
    <p className="text-white/70 text-xs font-poppins font-medium">Metric Title</p>
    <div className="my-4">
      <span className="text-white text-3xl font-bold font-poppins tracking-tight">1,248</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-emerald-400 font-semibold">ˆ 4.2%</span>
      <span className="text-white/40">vs last week</span>
    </div>
  </div>

  {/* Sel 2 ... */}
</div>
```

---

## 4. Tipografi

* **Font Utama:** `font-poppins` (Poppins Google Font) diterapkan secara global.
* **Hierarki Font Size:**
  * **Hero / Big Display:** `text-5xl` ~ `text-7xl` (Hanya di Landing Page)
  * **Metric KPI:** `text-3xl font-bold font-poppins tracking-tight leading-none`
  * **Panel / Section Title:** `text-sm font-semibold font-poppins text-white`
  * **Field Labels & Table Headers:** `text-xs font-medium font-poppins text-white/70`
  * **Body / Subtext:** `text-xs font-normal font-poppins text-white/40 leading-relaxed`
  * **Micro Meta / Badges:** `text-[11px] font-poppins text-white/30`

---

## 5. Komponen Reusable Standar

Gunakan komponen pembungkus `@/components/ui/grid-outline` untuk memastikan konsistensi:

### A. GridContainer & GridCell
```tsx
import { GridContainer, GridCell } from "@/components/ui/grid-outline";

<GridContainer cols={3}>
  <GridCell>
    <h3 className="text-white text-sm font-semibold mb-2">Panel 1</h3>
    <p className="text-white/40 text-xs">Content goes here...</p>
  </GridCell>
  <GridCell colSpan={2}>
    <h3 className="text-white text-sm font-semibold mb-2">Panel 2 (Wide)</h3>
    <p className="text-white/40 text-xs">Content goes here...</p>
  </GridCell>
</GridContainer>
```

### B. Status Badge & Metric Row
```tsx
// Baris status dengan pemisah 1px halus
<div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-poppins">
  <span className="text-white/70">Matching Accuracy</span>
  <span className="text-emerald-400 font-medium">98.4%</span>
</div>
```

---

## 6. Do's and Don'ts

| ✅ DO (Wajib) | ❌ DON'T (Hindari) |
| :--- | :--- |
| Gunakan `gap-0` dengan pasangan `border-t border-l` di parent dan `border-b border-r` di child. | **Jangan** gunakan `gap-4` / `gap-6` dengan `rounded-xl` di dalam modul dashboard utama. |
| Gunakan `border-white/10` untuk seluruh garis outline pemisah. | **Jangan** gunakan border abu-abu terang (misal `border-gray-500`) atau border berwarna neon kecuali status. |
| Gunakan `font-poppins` di semua teks antarmuka. | **Jangan** mencampur font sans-serif lain sembarangan di luar display hero. |
| Gunakan variasi opasitas teks (`text-white/70`, `text-white/40`) untuk hierarki informasi. | **Jangan** gunakan warna teks solid abu-abu yang tidak seragam (misal `text-gray-300`, `text-zinc-400`). |
| Pertahankan `bg-[#000000]` murni untuk sel-sel data dashboard. | **Jangan** gunakan background putih atau abu-abu terang pada area data dashboard. |
