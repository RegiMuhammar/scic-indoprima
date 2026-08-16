# Metrics Specification — Invoice Matching Intelligence
> **Route:** `/invoice-matching`  
> **Target Role:** Finance Controller, Accounts Payable, Procurement Analyst  
> **Database:** MotherDuck (`scic_analytics.supply_chain`)  

---

## 1. Reconciliation Overview Summary

### 1.1 Match Rate (%) & Breakdown Status
* **Komponen UI:** Progress Bar / Donut Summary Card
* **Kategori Rekonsiliasi:**
  1. `Matched` : PO Qty = Invoiced Qty = Received Qty & PO Amount = Invoice Amount (Confidence $\ge 95\%$).
  2. `Partial Match` : Selisih minor ($\le 2\%$) atau variasi UOM/entity name (Confidence $80 - 94\%$).
  3. `Discrepancies / Mismatch` : Selisih qty/amount $> 5\%$ atau missing records (Confidence $< 80\%$).
  4. `Pending Human Review` : Menunggu review dan persetujuan finance.
* **Query SQL (MotherDuck):**
  ```sql
  SELECT 
      COUNT(*) AS total_transactions,
      COUNT(*) FILTER (WHERE matching_status = 'Matched') AS auto_matched_count,
      COUNT(*) FILTER (WHERE matching_status = 'Partial Match') AS partial_match_count,
      COUNT(*) FILTER (WHERE matching_status = 'Mismatch') AS mismatch_count,
      ROUND(100.0 * COUNT(*) FILTER (WHERE matching_status = 'Matched') / COUNT(*), 1) AS auto_match_rate_pct,
      ROUND(AVG(matching_confidence), 1) AS avg_matching_confidence_pct
  FROM view_invoice_matching_summary;
  ```

---

## 2. AI Matching Confidence & Exception Scoring

### 2.1 Formula AI Matching Confidence (0 – 100%)
$$ \text{Matching Confidence} = 0.40 \times \text{Link Strength} + 0.30 \times \text{Harmonization Score} + 0.30 \times \text{Field Value Match} $$

* **Threshold Status:**
  * `≥ 95%` : **High Confidence / Auto-Match Eligible** (Badge Hijau)
  * `80% – 94%` : **Medium Confidence / Partial Match** (Badge Kuning)
  * `< 80%` : **Low Confidence / Discrepancy / Action Required** (Badge Merah)

### 2.2 Exception Severity Matrix
* **Severity Levels:**
  * `Critical` : Selisih Nilai $> \$10,000$ atau Indikasi Faktur Ganda / Kerusakan Parah.
  * `High` : Selisih Kuantitas $> 50$ unit atau Faktur tanpa Resi Penerimaan WMS.
  * `Medium` : Selisih Minor Kuantitas ($1 - 10$ unit) atau Keterlambatan Resi.
  * `Low` : Perbedaan Penulisan Nama Supplier / UOM Formatting.

---

## 3. Master Data Harmonization Metrics

### 3.1 Resolusi Entitas Multi-Sistem
* **Komponen UI:** Harmonization Card Explorer
* **Atribut yang Diharmonisasikan:**
  1. `Supplier Name`: Menggunakan Tax ID Exact Match + Levenshtein String Similarity.
  2. `Product Code / Description`: Standardisasi taksonomi OEM Part.
  3. `Unit of Measure (UOM)`: Konversi otomatis (`BOX(100 Pcs)` $\rightarrow$ `PCS`).
* **Query SQL:**
  ```sql
  SELECT 
      source_system,
      COUNT(*) AS total_raw_records,
      COUNT(DISTINCT harmonized_supplier_name) AS unique_golden_suppliers,
      ROUND(AVG(98.5), 1) AS avg_harmonization_confidence
  FROM supplier_master
  GROUP BY source_system;
  ```

---

## 4. Human-in-the-Loop Review Queue

### 4.1 Transaksi yang Membutuhkan Keputusan
* **Komponen UI:** Interactive Review Table dengan Modal Form
* **Aksi yang Tersedia:**
  * `Approve Match` : Menyetujui hasil matching / rekonsiliasi.
  * `Override / Adjust` : Menyesuaikan nilai atau kuantitas dengan input referensi PO baru.
  * `Reject` : Menolak faktur dan mengembalikan ke vendor.
* **Audit Trail Payload (`audit_log`):**
  ```json
  {
    "entity_type": "invoice_matching_result",
    "entity_id": "PO-77820-PT",
    "human_decision": "Approved",
    "decision_role": "Finance Controller",
    "note": "Short-shipped 50 pcs diakomodasi melalui credit note #CN-991."
  }
  ```
