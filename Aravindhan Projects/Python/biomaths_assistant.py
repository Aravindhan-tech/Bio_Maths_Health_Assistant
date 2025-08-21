#!/usr/bin/env python3
"""
biomax_all_in_one.py

Unified BioMax Health Assistant - All-in-one interactive script.
Covers many formulas from basic to advanced clinical/research level.

Usage:
    python biomax_all_in_one.py
Enter requested values when prompted. Choose categories or "all" to compute everything.

Author: ChatGPT (for Aravindhan)
"""

import math
from typing import Optional


class BioMax:
    def __init__(
        self,
        weight_kg: float,
        height_m: float,
        age_yrs: float,
        sex: str,
        waist_cm: Optional[float] = None,
        hip_cm: Optional[float] = None,
        hr_bpm: Optional[float] = None,
        sbp: Optional[float] = None,
        dbp: Optional[float] = None,
        hb: Optional[float] = None,
        sa_o2: Optional[float] = None,
        pa_o2: Optional[float] = None,
        sv_o2: Optional[float] = None,
        pa_co2: Optional[float] = None,
        creatinine_mgdl: Optional[float] = None,
        glucose_mgdl: Optional[float] = None,
        insulin_uUml: Optional[float] = None,
        tg_mgdl: Optional[float] = None,
        tc_mgdl: Optional[float] = None,
        hdl_mgdl: Optional[float] = None,
        alb_gdl: Optional[float] = None,
        bun_mgdl: Optional[float] = None,
        ethanol_mgdl: Optional[float] = None,
    ):
        # Core
        self.weight = weight_kg
        self.height = height_m
        self.age = age_yrs
        self.sex = sex.lower()
        # Anthrop
        self.waist = waist_cm
        self.hip = hip_cm
        # Vitals
        self.hr = hr_bpm
        self.sbp = sbp
        self.dbp = dbp
        # Labs
        self.hb = hb
        self.sa_o2 = sa_o2
        self.pa_o2 = pa_o2
        self.sv_o2 = sv_o2
        self.pa_co2 = pa_co2
        self.creatinine = creatinine_mgdl
        self.glucose = glucose_mgdl
        self.insulin = insulin_uUml
        self.tg = tg_mgdl
        self.tc = tc_mgdl
        self.hdl = hdl_mgdl
        self.albumin = alb_gdl
        self.bun = bun_mgdl
        self.ethanol = ethanol_mgdl

    # ---------------------------
    # Units helpers
    # ---------------------------
    def height_cm(self) -> float:
        return self.height * 100.0

    def height_in(self) -> float:
        return self.height * 39.3700787

    # ---------------------------
    # Basic anthropometric formulas
    # ---------------------------
    def bmi(self) -> float:
        return self.weight / (self.height ** 2)

    def bmi_prime(self) -> float:
        return self.bmi() / 25.0

    def ponderal_index(self) -> float:
        if self.height <= 0:
            raise ValueError("height must be > 0")
        return self.weight / (self.height ** 3)

    def ibw_devine(self) -> float:
        # returns kg
        h_in = self.height_in()
        if self.sex.startswith("m"):
            return 50.0 + 2.3 * (h_in - 60.0)
        return 45.5 + 2.3 * (h_in - 60.0)

    def adjusted_body_weight(self, actual_weight_kg: Optional[float] = None, factor: float = 0.4) -> Optional[float]:
        if actual_weight_kg is None:
            return None
        ibw = self.ibw_devine()
        return ibw + factor * (actual_weight_kg - ibw)

    def waist_hip_ratio(self) -> Optional[float]:
        if not (self.waist and self.hip):
            return None
        return self.waist / self.hip

    def waist_height_ratio(self) -> Optional[float]:
        if not self.waist:
            return None
        return self.waist / self.height_cm()

    def body_surface_area_m2(self) -> float:
        # DuBois
        return 0.007184 * (self.weight ** 0.425) * (self.height_cm() ** 0.725)

    def body_adiposity_index(self) -> Optional[float]:
        if not (self.hip and self.height):
            return None
        return (self.hip / (self.height ** 1.5)) - 18.0

    def relative_fat_mass(self) -> Optional[float]:
        if not self.waist:
            return None
        # H in m, waist in cm
        if self.sex.startswith("m"):
            return 64.0 - 20.0 * ((self.height * 100.0) / self.waist)
        return 76.0 - 20.0 * ((self.height * 100.0) / self.waist)

    def lbm_james(self) -> float:
        # James formula uses height in m
        h = self.height
        w = self.weight
        if self.sex.startswith("m"):
            return 1.10 * w - 128.0 * ((w / h) ** 2)
        return 1.07 * w - 148.0 * ((w / h) ** 2)

    def fat_mass_from_lbm(self, lbm_kg: Optional[float] = None) -> float:
        lbm = lbm_kg if lbm_kg is not None else self.lbm_james()
        return self.weight - lbm

    # ---------------------------
    # Energy & metabolic
    # ---------------------------
    def bmr_mifflin(self) -> float:
        # W(kg), H(cm), A(years). sex offset +5 male, -161 female
        base = 10.0 * self.weight + 6.25 * self.height_cm() - 5.0 * self.age
        return base + (5.0 if self.sex.startswith("m") else -161.0)

    def bmr_harris_benedict(self) -> float:
        if self.sex.startswith("m"):
            return 66.47 + 13.75 * self.weight + 5.003 * self.height_cm() - 6.755 * self.age
        return 655.1 + 9.563 * self.weight + 1.85 * self.height_cm() - 4.676 * self.age

    def bmr_katch_mcardle(self, lbm_kg: Optional[float] = None) -> float:
        lbm = lbm_kg if lbm_kg is not None else max(0.0, self.lbm_james())
        return 370.0 + 21.6 * lbm

    def tdee(self, activity_factor: float = 1.55) -> float:
        return self.bmr_mifflin() * activity_factor

    # ---------------------------
    # Cardio / hemodynamics / ECG
    # ---------------------------
    def map(self) -> Optional[float]:
        if self.sbp is None or self.dbp is None:
            return None
        return (self.sbp + 2.0 * self.dbp) / 3.0

    def rate_pressure_product(self) -> Optional[float]:
        if self.sbp is None or self.hr is None:
            return None
        return self.sbp * self.hr

    def shock_index(self) -> Optional[float]:
        if self.hr is None or self.sbp is None:
            return None
        return self.hr / self.sbp

    def cardiac_index(self, co_l_min: Optional[float] = None) -> Optional[float]:
        # CO in L/min if provided; else None
        if co_l_min is None:
            return None
        return co_l_min / self.body_surface_area_m2()

    def svr(self, co_l_min: Optional[float] = None, cvp: float = 0.0) -> Optional[float]:
        if co_l_min is None or self.map() is None:
            return None
        # convert CO L/min to mL/sec units inside formula factor 80 keeps dyn·s·cm^-5
        return ((self.map() - cvp) * 80.0) / co_l_min

    def cardiac_output_from_fick(self, vo2_ml_min: float, cao2_ml_dl: float, cvo2_ml_dl: float) -> Optional[float]:
        # returns L/min
        a_v_diff = cao2_ml_dl - cvo2_ml_dl
        if a_v_diff <= 0:
            return None
        # VO2 in mL/min; divide by (mL O2 per dL) to get dL/min; multiply by 0.01 to get L/min? We'll convert:
        # a_v_diff in mL O2/dL, so convert to mL O2/L by *10
        return vo2_ml_min / (a_v_diff * 10.0)

    def ca_o2(self, hb_g_dl: Optional[float] = None, sa_o2_frac: Optional[float] = None, pa_o2_mm: Optional[float] = None) -> Optional[float]:
        # returns mL O2 / dL
        hb = hb_g_dl if hb_g_dl is not None else self.hb
        sa = (sa_o2_frac / 100.0) if (sa_o2_frac is not None and sa_o2_frac > 1) else sa_o2_frac
        pa = pa_o2_mm if pa_o2_mm is not None else self.pa_o2
        if hb is None or sa is None or pa is None:
            return None
        # CaO2 = (1.34 * Hb * SaO2) + (0.0031 * PaO2)
        return 1.34 * hb * sa + 0.0031 * pa

    def cv_o2(self, hb_g_dl: Optional[float] = None, sv_o2_frac: Optional[float] = None, pv_o2_mm: Optional[float] = None) -> Optional[float]:
        hb = hb_g_dl if hb_g_dl is not None else self.hb
        sv = (sv_o2_frac / 100.0) if (sv_o2_frac is not None and sv_o2_frac > 1) else sv_o2_frac
        pv = pv_o2_mm
        if hb is None or sv is None:
            return None
        # approximate
        pv_val = pv if pv is not None else 40.0
        return 1.34 * hb * sv + 0.0031 * pv_val

    def oxygen_delivery(self, co_l_min: float, ca_o2_ml_dl: float) -> Optional[float]:
        # DO2 = CO (L/min) * CaO2 (mL/dL) * 10 -> mL O2 / min
        if co_l_min is None or ca_o2_ml_dl is None:
            return None
        return co_l_min * ca_o2_ml_dl * 10.0

    # ---------------------------
    # Respiratory / gas exchange
    # ---------------------------
    def alveolar_gas_eq(self, fio2_frac: float = 0.21, pb_mm: float = 760.0, ph2o_mm: float = 47.0, rq: float = 0.8) -> Optional[float]:
        if self.pa_co2 is None:
            return None
        return fio2_frac * (pb_mm - ph2o_mm) - (self.pa_co2 / rq)

    def a_a_gradient(self, pao2: Optional[float] = None, pao2_measured: Optional[float] = None) -> Optional[float]:
        pao2_calc = pao2 if pao2 is not None else self.alveolar_gas_eq()
        if pao2_calc is None or pao2_measured is None:
            return None
        return pao2_calc - pao2_measured

    def oxygenation_index(self, fio2_frac: float, map_cm_h2o: float, pao2_mm: float) -> float:
        # OI = (FiO2 * MAP * 100) / PaO2
        return (fio2_frac * map_cm_h2o * 100.0) / pao2_mm

    # ---------------------------
    # Acid-base / electrolytes
    # ---------------------------
    def anion_gap(self, na: float, k: Optional[float], cl: float, hco3: float) -> float:
        if k is None:
            return na - (cl + hco3)
        return (na + k) - (cl + hco3)

    def corrected_anion_gap(self, ag: float, albumin_gdl: Optional[float] = None) -> Optional[float]:
        alb = albumin_gdl if albumin_gdl is not None else self.albumin
        if alb is None:
            return None
        return ag + 2.5 * (4.0 - alb)

    def calculated_osmolality(self, na: float, glucose_mgdl: Optional[float], bun_mgdl: Optional[float], ethanol_mgdl: Optional[float] = 0.0):
        g = glucose_mgdl if glucose_mgdl is not None else self.glucose
        b = bun_mgdl if bun_mgdl is not None else self.bun
        e = ethanol_mgdl if ethanol_mgdl is not None else self.ethanol or 0.0
        return 2.0 * na + (g or 0.0) / 18.0 + (b or 0.0) / 2.8 + e / 3.7

    def osmolar_gap(self, measured_osm: float, na: float, glucose_mgdl: Optional[float], bun_mgdl: Optional[float], ethanol_mgdl: Optional[float] = 0.0):
        calc = self.calculated_osmolality(na, glucose_mgdl, bun_mgdl, ethanol_mgdl)
        return measured_osm - calc

    # ---------------------------
    # Renal function
    # ---------------------------
    def cockcroft_gault(self) -> Optional[float]:
        # Creatinine in mg/dL
        if self.creatinine is None:
            return None
        sex_factor = 1.0 if self.sex.startswith("m") else 0.85
        return ((140.0 - self.age) * self.weight * sex_factor) / (72.0 * self.creatinine)

    def mdrd_egfr(self):
        # simplified MDRD 4-variable (not accounting race here)
        if self.creatinine is None:
            return None
        return 175.0 * (self.creatinine ** -1.154) * (self.age ** -0.203) * (0.742 if not self.sex.startswith("m") else 1.0)

    # ---------------------------
    # Lipids / cardiometabolic indices
    # ---------------------------
    def ldl_friedewald(self) -> Optional[float]:
        if self.tc is None or self.hdl is None or self.tg is None:
            return None
        # only valid if TG < 400 mg/dL
        return self.tc - self.hdl - (self.tg / 5.0)

    def non_hdl(self) -> Optional[float]:
        if self.tc is None or self.hdl is None:
            return None
        return self.tc - self.hdl

    def atherogenic_index_of_plasma(self) -> Optional[float]:
        if self.tg is None or self.hdl is None:
            return None
        # uses molar values ideally, but we compute with mg/dL proxy
        if self.tg <= 0 or self.hdl <= 0:
            return None
        return math.log10(self.tg / self.hdl)

    def tyg_index(self) -> Optional[float]:
        if self.tg is None or self.glucose is None:
            return None
        return math.log((self.tg * self.glucose) / 2.0)

    # ---------------------------
    # Insulin resistance indices
    # ---------------------------
    def homa_ir(self) -> Optional[float]:
        if self.glucose is None or self.insulin is None:
            return None
        return (self.glucose * self.insulin) / 405.0

    def quicki(self) -> Optional[float]:
        if self.glucose is None or self.insulin is None:
            return None
        return 1.0 / (math.log10(self.insulin) + math.log10(self.glucose))

    # ---------------------------
    # Pharmacokinetics (basic)
    # ---------------------------
    def loading_dose(self, target_conc_mg_l: float, vd_l: float, f: float = 1.0) -> float:
        # LD = (C_target * Vd) / F
        return (target_conc_mg_l * vd_l) / f

    def maintenance_rate(self, cl_l_hr: float, css_mg_l: float, f: float = 1.0) -> float:
        # dosing rate (mg/hr)
        return (cl_l_hr * css_mg_l) / f

    def half_life(self, vd_l: float, cl_l_hr: float) -> float:
        # t1/2 = 0.693 * Vd / Cl
        return 0.693 * vd_l / cl_l_hr

    # ---------------------------
    # Michaelis-Menten elimination
    # ---------------------------
    def michaelis_menten(self, c_mg_l: float, vmax_mg_hr: float, km_mg_l: float) -> float:
        return (vmax_mg_hr * c_mg_l) / (km_mg_l + c_mg_l)

    # ---------------------------
    # Utility: compute many categories at once
    # ---------------------------
    def compute_basic_block(self) -> dict:
        out = {}
        out["BMI"] = self.bmi()
        out["BMI Prime"] = self.bmi_prime()
        out["Ponderal Index"] = self.ponderal_index()
        out["IBW (Devine kg)"] = self.ibw_devine()
        out["Adjusted BW (example, if you provide actual)"] = self.adjusted_body_weight(self.weight)
        out["BSA (m^2)"] = self.body_surface_area_m2()
        out["Waist-Hip Ratio"] = self.waist_hip_ratio()
        out["Waist-Height Ratio"] = self.waist_height_ratio()
        out["BAI"] = self.body_adiposity_index()
        out["RFM"] = self.relative_fat_mass()
        out["LBM (James)"] = self.lbm_james()
        out["Fat Mass (kg)"] = self.fat_mass_from_lbm()
        return out

    def compute_energy_block(self) -> dict:
        out = {}
        out["BMR (Mifflin)"] = self.bmr_mifflin()
        out["BMR (Harris-Benedict)"] = self.bmr_harris_benedict()
        out["BMR (Katch-McArdle)"] = self.bmr_katch_mcardle()
        out["TDEE (activity factor 1.55)"] = self.tdee()
        out["Calories for Loss (TDEE-500)"] = self.tdee() - 500.0
        out["Calories for Gain (TDEE+500)"] = self.tdee() + 500.0
        out["Protein (1.6 g/kg) g/day"] = 1.6 * self.weight
        out["Water (ml/day 35 ml/kg)"] = 35 * self.weight
        return out

    def compute_cardio_block(self) -> dict:
        out = {}
        out["MAP (mmHg)"] = self.map()
        out["Rate Pressure Product"] = self.rate_pressure_product()
        out["Shock Index"] = self.shock_index()
        out["Conicity Index"] = (self.waist / 100.0) / (0.109 * math.sqrt(self.weight / self.height)) if self.waist else None
        return out

    def compute_renal_block(self) -> dict:
        out = {}
        out["Cockcroft-Gault CrCl (mL/min)"] = self.cockcroft_gault()
        out["MDRD eGFR (mL/min/1.73m^2)"] = self.mdrd_egfr()
        return out

    def compute_lipid_block(self) -> dict:
        out = {}
        out["LDL (Friedewald)"] = self.ldl_friedewald()
        out["Non-HDL"] = self.non_hdl()
        out["AIP"] = self.atherogenic_index_of_plasma()
        out["TyG"] = self.tyg_index()
        return out

    def compute_insulin_ir_block(self) -> dict:
        out = {}
        out["HOMA-IR"] = self.homa_ir()
        out["QUICKI"] = self.quicki()
        return out

    def compute_pk_block(self) -> dict:
        out = {}
        # example values placeholder; user should call methods with appropriate params
        out["Example half-life for Vd=40L Cl=5L/hr"] = self.half_life(40.0, 5.0)
        return out

    def compute_all(self) -> dict:
        res = {}
        res.update(self.compute_basic_block())
        res.update(self.compute_energy_block())
        res.update(self.compute_cardio_block())
        res.update(self.compute_renal_block())
        res.update(self.compute_lipid_block())
        res.update(self.compute_insulin_ir_block())
        res.update(self.compute_pk_block())
        return res


# ---------------------------
# Interactive CLI
# ---------------------------
def _float_input(prompt: str, optional: bool = False) -> Optional[float]:
    val = input(prompt).strip()
    if val == "" and optional:
        return None
    try:
        return float(val)
    except ValueError:
        print("Invalid number; try again.")
        return _float_input(prompt, optional)


def main():
    print("=== BioMax Health Assistant — All-in-one ===")
    w = _float_input("Weight (kg): ")
    h = _float_input("Height (m): ")
    age = _float_input("Age (years): ")
    sex = input("Sex (male/female): ").strip().lower() or "male"
    waist = _float_input("Waist (cm) [optional]: ", optional=True)
    hip = _float_input("Hip (cm) [optional]: ", optional=True)
    hr = _float_input("Heart rate (bpm) [optional]: ", optional=True)
    sbp = _float_input("Systolic BP (mmHg) [optional]: ", optional=True)
    dbp = _float_input("Diastolic BP (mmHg) [optional]: ", optional=True)

    print("\n--- Optional labs (press Enter to skip) ---")
    creat = _float_input("Serum creatinine (mg/dL) [optional]: ", optional=True)
    hb = _float_input("Hemoglobin (g/dL) [optional]: ", optional=True)
    sa_o2 = _float_input("SpO2 (%) [optional]: ", optional=True)
    pa_o2 = _float_input("PaO2 (mmHg) [optional]: ", optional=True)
    sv_o2 = _float_input("SvO2 (%) [optional]: ", optional=True)
    pa_co2 = _float_input("PaCO2 (mmHg) [optional]: ", optional=True)
    glucose = _float_input("Glucose (mg/dL) [optional]: ", optional=True)
    insulin = _float_input("Insulin (µU/mL) [optional]: ", optional=True)
    tg = _float_input("Triglycerides (mg/dL) [optional]: ", optional=True)
    tc = _float_input("Total Cholesterol (mg/dL) [optional]: ", optional=True)
    hdl = _float_input("HDL (mg/dL) [optional]: ", optional=True)
    alb = _float_input("Albumin (g/dL) [optional]: ", optional=True)
    bun = _float_input("BUN (mg/dL) [optional]: ", optional=True)
    ethanol = _float_input("Ethanol (mg/dL) [optional]: ", optional=True)

    bio = BioMax(
        weight_kg=w,
        height_m=h,
        age_yrs=age,
        sex=sex,
        waist_cm=waist,
        hip_cm=hip,
        hr_bpm=hr,
        sbp=sbp,
        dbp=dbp,
        hb=hb,
        sa_o2=sa_o2,
        pa_o2=pa_o2,
        sv_o2=sv_o2,
        pa_co2=pa_co2,
        creatinine_mgdl=creat,
        glucose_mgdl=glucose,
        insulin_uUml=insulin,
        tg_mgdl=tg,
        tc_mgdl=tc,
        hdl_mgdl=hdl,
        alb_gdl=alb,
        bun_mgdl=bun,
        ethanol_mgdl=ethanol,
    )

    print("\nChoose category to compute:")
    print(" 1) Basic anthropometry (1–20)")
    print(" 2) Energy / metabolic (BMR/TDEE)")
    print(" 3) Cardio / hemodynamics")
    print(" 4) Renal")
    print(" 5) Lipids & cardiometabolic indices")
    print(" 6) Insulin resistance")
    print(" 7) Pharmacokinetics examples")
    print(" 8) Compute ALL")
    choice = input("Enter choice (1-8): ").strip() or "8"

    if choice == "1":
        out = bio.compute_basic_block()
    elif choice == "2":
        out = bio.compute_energy_block()
    elif choice == "3":
        out = bio.compute_cardio_block()
    elif choice == "4":
        out = bio.compute_renal_block()
    elif choice == "5":
        out = bio.compute_lipid_block()
    elif choice == "6":
        out = bio.compute_insulin_ir_block()
    elif choice == "7":
        out = bio.compute_pk_block()
    else:
        out = bio.compute_all()

    print("\n--- Results ---")
    for k, v in out.items():
        try:
            if v is None:
                print(f"{k}: (insufficient inputs)")
            elif isinstance(v, float):
                print(f"{k}: {v:.4f}")
            else:
                print(f"{k}: {v}")
        except Exception:
            print(f"{k}: {v}")

    print("\nDone. Save this script as 'biomax_all_in_one.py' and run to reuse.")


if __name__ == "__main__":
    main()
