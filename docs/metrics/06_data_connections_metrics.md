# Metrics Specification — Data Connections & IoT Telemetry Health
> **Route:** `/data-connections`  
> **Target Role:** Data Engineer, System Administrator, Integration Lead  
> **Database:** Supabase PostgreSQL & MotherDuck  

---

## 1. System Integration Health Metrics

### 1.1 Source Systems Status Summary
* **Komponen UI:** Integration Status Cards dengan Live Heartbeat Pulse
* **Sistem yang Dipantau:**
  1. `SAP S/4HANA ERP`: OData API / RFC Gateway (Batch Harian)
  2. `Indoprima WMS`: MQTT / REST Webhooks (Real-time Stream)
  3. `E-Procurement Supplier Portal`: REST API (Sinkronisasi per 15 menit)
  4. `Tanjung Perak Port Customs Telemetry`: Gov Logistics API (Sinkronisasi per jam)
  5. `IoT Shopfloor SCADA / PLC`: Edge MQTT Telemetry (Interval 10 detik)

---

## 2. Sync Quality & Freshness Indicators

### 2.1 Sync Latency & Freshness (Menit)
* **Threshold & Status:**
  * `< 15 Menit` : **Healthy / Synchronized** (Badge Hijau)
  * `15 – 60 Menit` : **Degraded / High Latency** (Badge Kuning)
  * `> 60 Menit / Error` : **Disconnected / Down** (Badge Merah)

### 2.2 Data Completeness & Anomaly Rate (%)
* **Data Completeness Formula:** $\frac{\text{Records Successfully Parsed}}{\text{Total Records Ingested}} \times 100$ (Target $\ge 99.5\%$)
* **Data Anomaly Rate:** Persentase field bernilai di luar batas wajar (Target $< 1.0\%$)

---

## 3. Connection Configuration Schema (`data_source_connection`)

```json
{
  "system_id": "SYS-ERP-01",
  "system_name": "SAP S/4HANA ERP",
  "protocol": "OData REST v4",
  "connection_status": "Healthy",
  "last_sync_timestamp": "2026-08-16T14:15:00Z",
  "records_ingested_today": 12450,
  "error_rate_pct": 0.02,
  "average_latency_ms": 145
}
```
