import os
import random
import csv
from datetime import datetime, timedelta

# Create target directory
OUTPUT_DIR = os.path.join("datasets", "quickwin_manufacturing")
os.makedirs(OUTPUT_DIR, exist_ok=True)

random.seed(42) # Reproducible realistic randomness

print(f"Generating realistic dataset in {OUTPUT_DIR}...")

# -----------------------------------------------------------------------------
# 1. DIMENSION TABLES
# -----------------------------------------------------------------------------

# dim_factories
factories = [
    {"factory_id": "FB-GRS-01", "factory_name": "Pabrik Utama Gresik", "location": "Gresik, Jawa Timur", "created_at": "2024-01-15 08:00:00"},
    {"factory_id": "FB-NGJ-01", "factory_name": "Pabrik Nganjuk", "location": "Nganjuk, Jawa Timur", "created_at": "2024-03-01 08:00:00"}
]

with open(os.path.join(OUTPUT_DIR, "dim_factories.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["factory_id", "factory_name", "location", "created_at"])
    writer.writeheader()
    writer.writerows(factories)

# dim_production_lines
lines = [
    {"line_id": "LINE-SPRING-01", "factory_id": "FB-GRS-01", "line_name": "Lini Leaf Spring High Duty 1", "target_oee_pct": 85.0},
    {"line_id": "LINE-SPRING-02", "factory_id": "FB-GRS-01", "line_name": "Lini Leaf Spring Light Duty 2", "target_oee_pct": 82.0},
    {"line_id": "LINE-COIL-01", "factory_id": "FB-GRS-01", "line_name": "Lini Hot Coiling Spring 1", "target_oee_pct": 88.0},
    {"line_id": "LINE-STABILIZER-01", "factory_id": "FB-NGJ-01", "line_name": "Lini Stabilizer Bar Nganjuk", "target_oee_pct": 80.0}
]

with open(os.path.join(OUTPUT_DIR, "dim_production_lines.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["line_id", "factory_id", "line_name", "target_oee_pct"])
    writer.writeheader()
    writer.writerows(lines)

# dim_machines
machines = [
    {"machine_id": "MCH-COILING-01", "line_id": "LINE-COIL-01", "machine_name": "CNC Automatic Hot Coiler A", "machine_type": "Hot Coiling", "is_critical": True, "instrumentation_status": "Full IoT", "rated_capacity_per_hour": 120.0},
    {"machine_id": "MCH-COILING-02", "line_id": "LINE-COIL-01", "machine_name": "CNC Automatic Hot Coiler B", "machine_type": "Hot Coiling", "is_critical": False, "instrumentation_status": "Partial Sensor", "rated_capacity_per_hour": 100.0},
    {"machine_id": "MCH-HEATTREAT-01", "line_id": "LINE-SPRING-01", "machine_name": "Continuous Quenching Furnace 1", "machine_type": "Heat Treatment", "is_critical": True, "instrumentation_status": "Full IoT", "rated_capacity_per_hour": 80.0},
    {"machine_id": "MCH-TEMPERING-01", "line_id": "LINE-SPRING-01", "machine_name": "Conveyor Tempering Furnace 1", "machine_type": "Tempering", "is_critical": False, "instrumentation_status": "Partial Sensor", "rated_capacity_per_hour": 85.0},
    {"machine_id": "MCH-SHOTPEEN-01", "line_id": "LINE-SPRING-01", "machine_name": "Automatic Shot Peening Machine", "machine_type": "Shot Peening", "is_critical": True, "instrumentation_status": "Partial Sensor", "rated_capacity_per_hour": 90.0},
    {"machine_id": "MCH-PRESS-01", "line_id": "LINE-SPRING-02", "machine_name": "Hydraulic Bending Press 500T", "machine_type": "Bending Press", "is_critical": False, "instrumentation_status": "Manual/Analog", "rated_capacity_per_hour": 75.0},
    {"machine_id": "MCH-STABILIZER-01", "line_id": "LINE-STABILIZER-01", "machine_name": "Automatic Bar Upsetting Machine", "machine_type": "Upsetting", "is_critical": True, "instrumentation_status": "Full IoT", "rated_capacity_per_hour": 60.0},
    {"machine_id": "MCH-TESTING-01", "line_id": "LINE-COIL-01", "machine_name": "Fatigue & Load Tester 100kN", "machine_type": "Quality Testing", "is_critical": False, "instrumentation_status": "Partial Sensor", "rated_capacity_per_hour": 150.0}
]

with open(os.path.join(OUTPUT_DIR, "dim_machines.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["machine_id", "line_id", "machine_name", "machine_type", "is_critical", "instrumentation_status", "rated_capacity_per_hour"])
    writer.writeheader()
    writer.writerows(machines)

# dim_skus
skus = [
    {"sku_id": "SKU-LS-HINO-01", "sku_name": "Leaf Spring Assembly Hino Dutro HD", "category": "Leaf Spring", "ideal_cycle_time_seconds": 45.0},
    {"sku_id": "SKU-LS-ISUZU-02", "sku_name": "Leaf Spring Main Isuzu Giga 260PS", "category": "Leaf Spring", "ideal_cycle_time_seconds": 55.0},
    {"sku_id": "SKU-CS-TOYOTA-01", "sku_name": "Front Coil Spring Toyota Innova Zenix", "category": "Coil Spring", "ideal_cycle_time_seconds": 30.0},
    {"sku_id": "SKU-CS-HONDA-02", "sku_name": "Rear Coil Spring Honda HR-V Turbo", "category": "Coil Spring", "ideal_cycle_time_seconds": 28.0},
    {"sku_id": "SKU-SB-CANTER-01", "sku_name": "Front Stabilizer Bar Mitsubishi Canter", "category": "Stabilizer Bar", "ideal_cycle_time_seconds": 60.0},
    {"sku_id": "SKU-SB-AVANZA-02", "sku_name": "Rear Anti-Roll Stabilizer Toyota Avanza", "category": "Stabilizer Bar", "ideal_cycle_time_seconds": 40.0}
]

with open(os.path.join(OUTPUT_DIR, "dim_skus.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["sku_id", "sku_name", "category", "ideal_cycle_time_seconds"])
    writer.writeheader()
    writer.writerows(skus)

# dim_spare_parts
spare_parts = [
    {"part_id": "PRT-BRG-6205-2RS", "part_name": "Heavy Duty Shaft Roller Bearing 6205-2RS", "category": "Mechanical", "criticality_level": "Critical", "unit_cost": 450000.00, "default_supplier_lead_time_days": 10, "min_stock_level": 5, "max_stock_level": 35, "existing_reorder_point": 12},
    {"part_id": "PRT-SEAL-HT-50", "part_name": "Viton High-Temp Hydraulic Oil Seal 50mm", "category": "Hydraulic", "criticality_level": "Critical", "unit_cost": 275000.00, "default_supplier_lead_time_days": 7, "min_stock_level": 10, "max_stock_level": 50, "existing_reorder_point": 15},
    {"part_id": "PRT-ELEC-COIL-50KW", "part_name": "Induction Heating Coil Tube 50kW", "category": "Electrical", "criticality_level": "Critical", "unit_cost": 8500000.00, "default_supplier_lead_time_days": 18, "min_stock_level": 2, "max_stock_level": 8, "existing_reorder_point": 3},
    {"part_id": "PRT-NOZZLE-CARB-08", "part_name": "Tungsten Carbide Shot Peening Nozzle 8mm", "category": "Mechanical", "criticality_level": "Medium", "unit_cost": 1200000.00, "default_supplier_lead_time_days": 5, "min_stock_level": 6, "max_stock_level": 24, "existing_reorder_point": 8},
    {"part_id": "PRT-SENS-IND-24V", "part_name": "Inductive Proximity Sensor M12 24VDC", "category": "Electrical", "criticality_level": "Medium", "unit_cost": 350000.00, "default_supplier_lead_time_days": 3, "min_stock_level": 8, "max_stock_level": 40, "existing_reorder_point": 12},
    {"part_id": "PRT-HYD-VALVE-PROP", "part_name": "Proportional Hydraulic Control Valve 24V", "category": "Hydraulic", "criticality_level": "Critical", "unit_cost": 4200000.00, "default_supplier_lead_time_days": 14, "min_stock_level": 3, "max_stock_level": 12, "existing_reorder_point": 4},
    {"part_id": "PRT-BELT-CONV-HT", "part_name": "Stainless Steel Mesh Conveyor Belt HT", "category": "Mechanical", "criticality_level": "Medium", "unit_cost": 3100000.00, "default_supplier_lead_time_days": 12, "min_stock_level": 2, "max_stock_level": 10, "existing_reorder_point": 3},
    {"part_id": "PRT-TC-KTYPE-1200C", "part_name": "K-Type Thermocouple Sensor Furnace 1200C", "category": "Electrical", "criticality_level": "Critical", "unit_cost": 650000.00, "default_supplier_lead_time_days": 4, "min_stock_level": 5, "max_stock_level": 20, "existing_reorder_point": 8},
    {"part_id": "PRT-PNEU-CYL-100", "part_name": "ISO Pneumatic Cylinder 100mm Bore 250mm Stroke", "category": "Pneumatic", "criticality_level": "Low", "unit_cost": 890000.00, "default_supplier_lead_time_days": 4, "min_stock_level": 4, "max_stock_level": 16, "existing_reorder_point": 6},
    {"part_id": "PRT-GREASE-HT-20KG", "part_name": "Synthetic High-Temperature Bearing Grease 20kg", "category": "Chemical/Lubricant", "criticality_level": "Low", "unit_cost": 1850000.00, "default_supplier_lead_time_days": 2, "min_stock_level": 4, "max_stock_level": 20, "existing_reorder_point": 6}
]

with open(os.path.join(OUTPUT_DIR, "dim_spare_parts.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["part_id", "part_name", "category", "criticality_level", "unit_cost", "default_supplier_lead_time_days", "min_stock_level", "max_stock_level", "existing_reorder_point"])
    writer.writeheader()
    writer.writerows(spare_parts)

# dim_bom_compatibility
bom_records = [
    {"bom_id": "BOM-001", "machine_id": "MCH-COILING-01", "part_id": "PRT-BRG-6205-2RS", "qty_required_per_machine": 4, "replacement_freq_days": 90},
    {"bom_id": "BOM-002", "machine_id": "MCH-COILING-01", "part_id": "PRT-SEAL-HT-50", "qty_required_per_machine": 2, "replacement_freq_days": 60},
    {"bom_id": "BOM-003", "machine_id": "MCH-COILING-01", "part_id": "PRT-ELEC-COIL-50KW", "qty_required_per_machine": 1, "replacement_freq_days": 180},
    {"bom_id": "BOM-004", "machine_id": "MCH-HEATTREAT-01", "part_id": "PRT-TC-KTYPE-1200C", "qty_required_per_machine": 6, "replacement_freq_days": 45},
    {"bom_id": "BOM-005", "machine_id": "MCH-HEATTREAT-01", "part_id": "PRT-BELT-CONV-HT", "qty_required_per_machine": 1, "replacement_freq_days": 240},
    {"bom_id": "BOM-006", "machine_id": "MCH-SHOTPEEN-01", "part_id": "PRT-NOZZLE-CARB-08", "qty_required_per_machine": 8, "replacement_freq_days": 30},
    {"bom_id": "BOM-007", "machine_id": "MCH-SHOTPEEN-01", "part_id": "PRT-BRG-6205-2RS", "qty_required_per_machine": 2, "replacement_freq_days": 120},
    {"bom_id": "BOM-008", "machine_id": "MCH-STABILIZER-01", "part_id": "PRT-HYD-VALVE-PROP", "qty_required_per_machine": 2, "replacement_freq_days": 150},
    {"bom_id": "BOM-009", "machine_id": "MCH-STABILIZER-01", "part_id": "PRT-SENS-IND-24V", "qty_required_per_machine": 4, "replacement_freq_days": 90},
    {"bom_id": "BOM-010", "machine_id": "MCH-PRESS-01", "part_id": "PRT-SEAL-HT-50", "qty_required_per_machine": 4, "replacement_freq_days": 90}
]

with open(os.path.join(OUTPUT_DIR, "dim_bom_compatibility.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["bom_id", "machine_id", "part_id", "qty_required_per_machine", "replacement_freq_days"])
    writer.writeheader()
    writer.writerows(bom_records)

# -----------------------------------------------------------------------------
# 2. FACT TABLES GENERATION (30 Days Simulation: July 1 - July 30, 2026)
# -----------------------------------------------------------------------------

start_date = datetime(2026, 7, 1)
num_days = 30

schedules = []
downtimes = []
outputs = []
inspections = []
manpowers = []
consumptions = []
work_orders = []
wo_parts = []
telemetries = []
anomalies = []
purchase_orders = []

downtime_id_counter = 1000
output_id_counter = 5000
inspection_id_counter = 7000
wo_id_counter = 3000
anomaly_id_counter = 8000
telemetry_id_counter = 10000
consumption_id_counter = 9000
po_id_counter = 4000

# Stock levels tracker for inventory snapshots
current_stock = {p["part_id"]: p["existing_reorder_point"] + random.randint(5, 15) for p in spare_parts}

inventory_snapshots = []

# Machine specific wear accumulator (to trigger realistic breakdowns)
machine_wear = {m["machine_id"]: random.uniform(0.1, 0.4) for m in machines}

for day_idx in range(num_days):
    curr_date = start_date + timedelta(days=day_idx)
    date_str = curr_date.strftime("%Y-%m-%d")

    # A. Shift Manpower (3 shifts per day for active lines)
    for l in lines:
        for shift in [1, 2, 3]:
            # Shift 3 has slightly lower headcount / attendance
            base_headcount = 12 if l["line_id"] in ["LINE-SPRING-01", "LINE-COIL-01"] else 8
            absenteeism = random.choice([0, 0, 0, 1, 2]) if shift == 3 else random.choice([0, 0, 0, 1])
            actual_headcount = base_headcount - absenteeism
            total_hours = 8.0
            # Effective hours impacted by fatigue or minor pauses
            effective_hours = round(total_hours - (0.3 + random.uniform(0.1, 0.6) if shift == 3 else random.uniform(0.1, 0.4)), 2)
            
            manpowers.append({
                "manpower_log_id": f"MP-{date_str.replace('-','')}-{l['line_id']}-S{shift}",
                "log_date": date_str,
                "shift_number": shift,
                "line_id": l["line_id"],
                "operator_headcount": actual_headcount,
                "total_working_hours": total_hours,
                "effective_working_hours": effective_hours
            })

    # B. Daily Schedules, Outputs, Downtimes, Quality Inspections
    for m in machines:
        m_id = m["machine_id"]
        l_id = m["line_id"]
        
        # Pick assigned SKU
        if "COIL" in m_id:
            assigned_sku = random.choice(["SKU-CS-TOYOTA-01", "SKU-CS-HONDA-02"])
        elif "STABILIZER" in m_id:
            assigned_sku = random.choice(["SKU-SB-CANTER-01", "SKU-SB-AVANZA-02"])
        else:
            assigned_sku = random.choice(["SKU-LS-HINO-01", "SKU-LS-ISUZU-02"])
        
        sku_info = next(s for s in skus if s["sku_id"] == assigned_sku)
        ideal_ct = sku_info["ideal_cycle_time_seconds"]

        # Increment wear
        machine_wear[m_id] += random.uniform(0.02, 0.06)

        for shift in [1, 2, 3]:
            shift_start = datetime(curr_date.year, curr_date.month, curr_date.day, (shift-1)*8, 0, 0)
            shift_end = shift_start + timedelta(hours=8)
            
            # Schedule
            sched_id = f"SCH-{date_str.replace('-','')}-{m_id}-S{shift}"
            planned_qty = int((3600 / ideal_ct) * 7.0) # 7 hours net planned run time
            schedules.append({
                "schedule_id": sched_id,
                "schedule_date": date_str,
                "shift_number": shift,
                "line_id": l_id,
                "machine_id": m_id,
                "sku_id": assigned_sku,
                "planned_start_time": shift_start.strftime("%Y-%m-%d %H:%M:%S"),
                "planned_end_time": shift_end.strftime("%Y-%m-%d %H:%M:%S"),
                "planned_qty": planned_qty
            })

            # Check if breakdown occurs (non-linear realistic occurrence based on wear)
            has_breakdown = False
            breakdown_minutes = 0.0
            changeover_minutes = 0.0
            
            # Changeover event (e.g. every few shifts or randomly)
            if random.random() < 0.15:
                changeover_minutes = round(random.uniform(20.0, 45.0), 1)
                downtime_id_counter += 1
                dt_start = shift_start + timedelta(hours=random.uniform(1, 3))
                dt_end = dt_start + timedelta(minutes=changeover_minutes)
                downtimes.append({
                    "downtime_id": f"DT-{downtime_id_counter}",
                    "machine_id": m_id,
                    "shift_number": shift,
                    "start_time": dt_start.strftime("%Y-%m-%d %H:%M:%S"),
                    "end_time": dt_end.strftime("%Y-%m-%d %H:%M:%S"),
                    "duration_minutes": changeover_minutes,
                    "downtime_category": "Changeover",
                    "reason_description": f"Tooling setup and die adjustment for {assigned_sku}",
                    "is_unplanned": False
                })

            # Unplanned Breakdown
            if machine_wear[m_id] > 0.75 or (m["is_critical"] and random.random() < 0.08):
                has_breakdown = True
                breakdown_minutes = round(random.uniform(35.0, 140.0), 1)
                downtime_id_counter += 1
                dt_start = shift_start + timedelta(hours=random.uniform(3, 6))
                dt_end = dt_start + timedelta(minutes=breakdown_minutes)
                
                reason = random.choice([
                    "Bearing overheating & shaft vibration threshold breach",
                    "Hydraulic oil seal rupture & pressure drop",
                    "Induction heating element temperature fluctuation",
                    "Shot peening nozzle clog & pressure failure",
                    "Proximity sensor misalignment on material feeder"
                ])

                downtimes.append({
                    "downtime_id": f"DT-{downtime_id_counter}",
                    "machine_id": m_id,
                    "shift_number": shift,
                    "start_time": dt_start.strftime("%Y-%m-%d %H:%M:%S"),
                    "end_time": dt_end.strftime("%Y-%m-%d %H:%M:%S"),
                    "duration_minutes": breakdown_minutes,
                    "downtime_category": "Unplanned Breakdown",
                    "reason_description": reason,
                    "is_unplanned": True
                })

                # Trigger Anomaly & Work Order
                anomaly_id_counter += 1
                anom_time = dt_start - timedelta(minutes=random.randint(15, 60))
                anomalies.append({
                    "anomaly_id": f"ANM-{anomaly_id_counter}",
                    "machine_id": m_id,
                    "detected_at": anom_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "severity_level": "CRITICAL" if breakdown_minutes > 60 else "WARNING",
                    "anomaly_score": round(random.uniform(0.78, 0.98), 2),
                    "suspected_failing_component": reason.split()[0] + " " + reason.split()[1],
                    "recommended_action": f"Immediate inspection & pre-position replacement parts for {m_id}"
                })

                # Work Order
                wo_id_counter += 1
                wo_id = f"WO-{wo_id_counter}"
                work_orders.append({
                    "work_order_id": wo_id,
                    "machine_id": m_id,
                    "downtime_id": f"DT-{downtime_id_counter}",
                    "maintenance_type": "Corrective",
                    "failure_code": f"FAIL-{random.randint(101, 109)}",
                    "work_start_time": dt_start.strftime("%Y-%m-%d %H:%M:%S"),
                    "work_end_time": dt_end.strftime("%Y-%m-%d %H:%M:%S"),
                    "duration_hours": round(breakdown_minutes / 60.0, 2),
                    "technician_notes": f"Replaced faulty components and calibrated {m_id}. System tested OK."
                })

                # Deduct Spare Part & log Work Order Parts
                matching_boms = [b for b in bom_records if b["machine_id"] == m_id]
                if matching_boms:
                    used_bom = random.choice(matching_boms)
                    part_used = used_bom["part_id"]
                    qty_u = random.randint(1, used_bom["qty_required_per_machine"])
                    
                    wo_parts.append({
                        "wo_part_id": f"WOP-{wo_id_counter}-1",
                        "work_order_id": wo_id,
                        "part_id": part_used,
                        "qty_used": qty_u
                    })

                    consumption_id_counter += 1
                    part_info = next(p for p in spare_parts if p["part_id"] == part_used)
                    tot_c = round(qty_u * part_info["unit_cost"], 2)
                    consumptions.append({
                        "consumption_id": f"CNS-{consumption_id_counter}",
                        "part_id": part_used,
                        "machine_id": m_id,
                        "work_order_id": wo_id,
                        "consumption_date": date_str,
                        "qty_consumed": qty_u,
                        "total_cost": tot_c
                    })

                    current_stock[part_used] = max(0, current_stock[part_used] - qty_u)

                # Reset machine wear after fix
                machine_wear[m_id] = random.uniform(0.05, 0.20)

            # Compute actual output metrics
            net_operating_mins = 480.0 - (breakdown_minutes + changeover_minutes)
            speed_loss_mins = round(random.uniform(5.0, 25.0), 1) if shift == 3 else round(random.uniform(2.0, 12.0), 1)
            effective_mins = max(0.0, net_operating_mins - speed_loss_mins)

            # Cycle time variation (standard +/- 8%)
            act_ct = round(ideal_ct * random.uniform(0.96, 1.12), 2)
            produced_units = int((effective_mins * 60.0) / act_ct) if effective_mins > 0 else 0

            output_id_counter += 1
            outputs.append({
                "output_id": f"OUT-{output_id_counter}",
                "machine_id": m_id,
                "sku_id": assigned_sku,
                "shift_number": shift,
                "timestamp": shift_end.strftime("%Y-%m-%d %H:%M:%S"),
                "actual_qty_produced": produced_units,
                "actual_avg_cycle_time_seconds": act_ct,
                "speed_loss_duration_minutes": speed_loss_mins
            })

            # Quality Inspection (Reject rate realistic: 1.5% to 5.5%, higher after changeover/breakdown)
            reject_rate = 0.055 if (has_breakdown or changeover_minutes > 0) else random.uniform(0.012, 0.035)
            inspected_qty = produced_units
            reject_qty = int(inspected_qty * reject_rate)
            rework_qty = int(reject_qty * random.uniform(0.2, 0.5))
            good_qty = inspected_qty - reject_qty

            defect_cat = "None"
            if reject_qty > 0:
                defect_cat = random.choice([
                    "Quenching Hardness Non-Conforming",
                    "Free Height Dimension Out-of-Spec",
                    "Surface Micro-Crack Defect",
                    "Bending Angle Angular Deviation",
                    "Shot Peening Surface Roughness Fail"
                ])

            inspection_id_counter += 1
            inspections.append({
                "inspection_id": f"QC-{inspection_id_counter}",
                "machine_id": m_id,
                "sku_id": assigned_sku,
                "inspection_time": shift_end.strftime("%Y-%m-%d %H:%M:%S"),
                "total_inspected_qty": inspected_qty,
                "good_qty": good_qty,
                "reject_qty": reject_qty,
                "rework_qty": rework_qty,
                "defect_reason_category": defect_cat
            })

    # C. Telemetry Data Generation (Hourly telemetry for IoT machines)
    iot_machines = [m for m in machines if m["instrumentation_status"] in ["Full IoT", "Partial Sensor"]]
    for hour in range(24):
        t_time = datetime(curr_date.year, curr_date.month, curr_date.day, hour, 0, 0)
        for m in iot_machines:
            m_id = m["machine_id"]
            telemetry_id_counter += 1
            
            # Base values
            base_vib = 1.2 if m_id == "MCH-COILING-01" else 0.8
            base_temp = 850.0 if "HEATTREAT" in m_id else 48.0
            base_amp = 35.0
            base_press = 160.0
            base_rpm = 1450.0 if "COILING" in m_id else 0.0

            # Add noise & wear effect
            wear_factor = machine_wear[m_id]
            vib = round(base_vib + (wear_factor * 2.5) + random.uniform(-0.15, 0.25), 2)
            temp = round(base_temp + (wear_factor * 18.0) + random.uniform(-2.5, 4.0), 1)
            amp = round(base_amp + (wear_factor * 8.0) + random.uniform(-1.2, 1.8), 1)
            press = round(base_press - (wear_factor * 12.0) + random.uniform(-3.0, 3.0), 1)
            rpm = round(base_rpm + random.uniform(-15.0, 15.0), 1) if base_rpm > 0 else 0.0

            state = "RUNNING"
            if wear_factor > 0.8:
                state = "STOPPED"
            elif random.random() < 0.05:
                state = "IDLE"

            telemetries.append({
                "telemetry_id": f"TEL-{telemetry_id_counter}",
                "machine_id": m_id,
                "timestamp": t_time.strftime("%Y-%m-%d %H:%M:%S"),
                "vibration_mm_s": vib,
                "temperature_celsius": temp,
                "current_ampere": amp,
                "pressure_bar": press,
                "operating_rpm": rpm,
                "machine_state": state
            })

    # D. Inventory Snapshots & Purchase Orders Triggering
    for p in spare_parts:
        pid = p["part_id"]
        c_stock = current_stock[pid]
        r_stock = random.randint(0, 2)
        a_stock = max(0, c_stock - r_stock)
        
        reorder_point = p["existing_reorder_point"]
        ai_reorder_point = int(reorder_point * random.uniform(1.1, 1.3)) # AI smart recommendation factor
        is_triggered = a_stock <= reorder_point

        inventory_snapshots.append({
            "snapshot_id": f"SNP-{date_str.replace('-','')}-{pid}",
            "snapshot_date": date_str,
            "part_id": pid,
            "current_stock_qty": c_stock,
            "reserved_stock_qty": r_stock,
            "available_stock_qty": a_stock,
            "smart_reorder_point_ai": ai_reorder_point,
            "is_reorder_triggered": is_triggered
        })

        # Trigger PO if stock triggered reorder & no active PO in progress
        if is_triggered and random.random() < 0.4:
            po_id_counter += 1
            order_qty = p["max_stock_level"] - c_stock
            std_lt = p["default_supplier_lead_time_days"]
            act_lt = std_lt + random.choice([-1, 0, 0, 1, 2, 4]) # Non-linear delay
            
            po_date_dt = curr_date
            rec_date_dt = po_date_dt + timedelta(days=act_lt)
            
            purchase_orders.append({
                "po_id": f"PO-2026-{po_id_counter}",
                "po_date": po_date_dt.strftime("%Y-%m-%d"),
                "part_id": pid,
                "supplier_name": random.choice(["PT Nippon Bearing Indonesia", "PT Hydraulic Power Tech", "PT Thermosensor Utama", "PT Carbide Tooling Nusantara"]),
                "ordered_qty": order_qty,
                "received_qty": order_qty,
                "received_date": rec_date_dt.strftime("%Y-%m-%d"),
                "actual_lead_time_days": act_lt,
                "unit_price": p["unit_cost"]
            })

            # Restock after receipt
            current_stock[pid] += order_qty

# Write all CSV files
files_map = {
    "fact_production_schedules.csv": (schedules, ["schedule_id", "schedule_date", "shift_number", "line_id", "machine_id", "sku_id", "planned_start_time", "planned_end_time", "planned_qty"]),
    "fact_downtime_logs.csv": (downtimes, ["downtime_id", "machine_id", "shift_number", "start_time", "end_time", "duration_minutes", "downtime_category", "reason_description", "is_unplanned"]),
    "fact_production_outputs.csv": (outputs, ["output_id", "machine_id", "sku_id", "shift_number", "timestamp", "actual_qty_produced", "actual_avg_cycle_time_seconds", "speed_loss_duration_minutes"]),
    "fact_quality_inspections.csv": (inspections, ["inspection_id", "machine_id", "sku_id", "inspection_time", "total_inspected_qty", "good_qty", "reject_qty", "rework_qty", "defect_reason_category"]),
    "fact_shift_manpower.csv": (manpowers, ["manpower_log_id", "log_date", "shift_number", "line_id", "operator_headcount", "total_working_hours", "effective_working_hours"]),
    "fact_part_consumptions.csv": (consumptions, ["consumption_id", "part_id", "machine_id", "work_order_id", "consumption_date", "qty_consumed", "total_cost"]),
    "fact_inventory_snapshots.csv": (inventory_snapshots, ["snapshot_id", "snapshot_date", "part_id", "current_stock_qty", "reserved_stock_qty", "available_stock_qty", "smart_reorder_point_ai", "is_reorder_triggered"]),
    "fact_purchase_orders.csv": (purchase_orders, ["po_id", "po_date", "part_id", "supplier_name", "ordered_qty", "received_qty", "received_date", "actual_lead_time_days", "unit_price"]),
    "fact_work_orders.csv": (work_orders, ["work_order_id", "machine_id", "downtime_id", "maintenance_type", "failure_code", "work_start_time", "work_end_time", "duration_hours", "technician_notes"]),
    "fact_work_order_parts.csv": (wo_parts, ["wo_part_id", "work_order_id", "part_id", "qty_used"]),
    "fact_machine_telemetry.csv": (telemetries, ["telemetry_id", "machine_id", "timestamp", "vibration_mm_s", "temperature_celsius", "current_ampere", "pressure_bar", "operating_rpm", "machine_state"]),
    "fact_anomaly_events.csv": (anomalies, ["anomaly_id", "machine_id", "detected_at", "severity_level", "anomaly_score", "suspected_failing_component", "recommended_action"])
}

for fname, (data_rows, headers) in files_map.items():
    fpath = os.path.join(OUTPUT_DIR, fname)
    with open(fpath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data_rows)

print(f"Dataset generation complete! Created 18 CSV files in {OUTPUT_DIR}.")
