# SCIC Design System — Pitch-Black Contiguous Grid Outline

> **Catatan:** Dokumen lengkap dan komponen UI Design System berada di [`frontend/DESIGN_SYSTEM.md`](../frontend/DESIGN_SYSTEM.md) dan [`frontend/components/ui/grid-outline.tsx`](../frontend/components/ui/grid-outline.tsx).

---

## Ringkasan Standar UI SCIC

1. **Aesthetic:** *Pitch-Black Minimal Contiguous Grid Outline*.
2. **Background:** Pitch Black murni (`#000000` / `bg-black`).
3. **Grid Layout:** Contiguous `gap-0` dengan garis pembatas halus `border-white/10` (border 1px bersama tanpa radius sudut / `rounded-none`).
4. **Tipografi:** Wajib menggunakan `font-poppins` dengan hierarki opasitas warna:
   * **Primary:** `text-white` (Angka KPI, Judul Section)
   * **Secondary:** `text-white/70` (Label Metrik, Sub-panel)
   * **Muted:** `text-white/40` (Subtext, periode waktu)
   * **Meta:** `text-white/30` (Timestamp, micro details)
5. **Indikator Status:**
   * `text-emerald-400` untuk tren positif / synced / lolos rekonsiliasi.
   * `text-red-400` untuk tren negatif / risiko / mismatch fatal.
   * `text-amber-400` untuk warning / pending audit / discrepancy ringan.

Silakan baca [`frontend/DESIGN_SYSTEM.md`](../frontend/DESIGN_SYSTEM.md) untuk detail panduan lengkap dan contoh kode.
