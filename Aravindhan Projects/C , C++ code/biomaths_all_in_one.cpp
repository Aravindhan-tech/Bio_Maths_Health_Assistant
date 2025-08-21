/*
 * biomax_all_in_one.cpp
 * 
 * Unified BioMax Health Assistant - All-in-one interactive C++ program.
 * Covers many formulas from basic to advanced clinical/research level.
 * 
 * Usage:
 *     g++ -std=c++17 -o biomax biomax_all_in_one.cpp
 *     ./biomax
 * Enter requested values when prompted. Choose categories or "all" to compute everything.
 * 
 * Converted from Python version for comprehensive health calculations.
 */

#include <iostream>
#include <string>
#include <map>
#include <optional>
#include <cmath>
#include <iomanip>
#include <stdexcept>
#include <algorithm>
#include <cctype>

class BioMax {
private:
    // Core measurements
    double weight;      // kg
    double height;      // m
    double age;         // years
    std::string sex;    // male/female
    
    // Anthropometric measurements
    std::optional<double> waist;     // cm
    std::optional<double> hip;       // cm
    
    // Vital signs
    std::optional<double> hr;        // bpm
    std::optional<double> sbp;       // mmHg
    std::optional<double> dbp;       // mmHg
    
    // Laboratory values
    std::optional<double> hb;           // g/dL
    std::optional<double> sa_o2;        // %
    std::optional<double> pa_o2;        // mmHg
    std::optional<double> sv_o2;        // %
    std::optional<double> pa_co2;       // mmHg
    std::optional<double> creatinine;   // mg/dL
    std::optional<double> glucose;      // mg/dL
    std::optional<double> insulin;      // µU/mL
    std::optional<double> tg;           // mg/dL
    std::optional<double> tc;           // mg/dL
    std::optional<double> hdl;          // mg/dL
    std::optional<double> albumin;      // g/dL
    std::optional<double> bun;          // mg/dL
    std::optional<double> ethanol;      // mg/dL

public:
    BioMax(double weight_kg, double height_m, double age_yrs, const std::string& sex_str,
           std::optional<double> waist_cm = std::nullopt,
           std::optional<double> hip_cm = std::nullopt,
           std::optional<double> hr_bpm = std::nullopt,
           std::optional<double> sbp_mmhg = std::nullopt,
           std::optional<double> dbp_mmhg = std::nullopt,
           std::optional<double> hb_gdl = std::nullopt,
           std::optional<double> sa_o2_pct = std::nullopt,
           std::optional<double> pa_o2_mmhg = std::nullopt,
           std::optional<double> sv_o2_pct = std::nullopt,
           std::optional<double> pa_co2_mmhg = std::nullopt,
           std::optional<double> creatinine_mgdl = std::nullopt,
           std::optional<double> glucose_mgdl = std::nullopt,
           std::optional<double> insulin_uUml = std::nullopt,
           std::optional<double> tg_mgdl = std::nullopt,
           std::optional<double> tc_mgdl = std::nullopt,
           std::optional<double> hdl_mgdl = std::nullopt,
           std::optional<double> alb_gdl = std::nullopt,
           std::optional<double> bun_mgdl = std::nullopt,
           std::optional<double> ethanol_mgdl = std::nullopt)
        : weight(weight_kg), height(height_m), age(age_yrs), sex(sex_str),
          waist(waist_cm), hip(hip_cm), hr(hr_bpm), sbp(sbp_mmhg), dbp(dbp_mmhg),
          hb(hb_gdl), sa_o2(sa_o2_pct), pa_o2(pa_o2_mmhg), sv_o2(sv_o2_pct),
          pa_co2(pa_co2_mmhg), creatinine(creatinine_mgdl), glucose(glucose_mgdl),
          insulin(insulin_uUml), tg(tg_mgdl), tc(tc_mgdl), hdl(hdl_mgdl),
          albumin(alb_gdl), bun(bun_mgdl), ethanol(ethanol_mgdl) {
        
        // Convert sex to lowercase
        std::transform(this->sex.begin(), this->sex.end(), this->sex.begin(), ::tolower);
    }

    // ---------------------------
    // Unit conversion helpers
    // ---------------------------
    double height_cm() const { return height * 100.0; }
    double height_in() const { return height * 39.3700787; }

    // ---------------------------
    // Basic anthropometric formulas
    // ---------------------------
    double bmi() const {
        return weight / (height * height);
    }

    double bmi_prime() const {
        return bmi() / 25.0;
    }

    double ponderal_index() const {
        if (height <= 0) {
            throw std::invalid_argument("Height must be > 0");
        }
        return weight / (height * height * height);
    }

    double ibw_devine() const {
        double h_in = height_in();
        if (sex.find('m') == 0) {  // starts with 'm'
            return 50.0 + 2.3 * (h_in - 60.0);
        }
        return 45.5 + 2.3 * (h_in - 60.0);
    }

    std::optional<double> adjusted_body_weight(std::optional<double> actual_weight_kg = std::nullopt, 
                                               double factor = 0.4) const {
        if (!actual_weight_kg) {
            return std::nullopt;
        }
        double ibw = ibw_devine();
        return ibw + factor * (actual_weight_kg.value() - ibw);
    }

    std::optional<double> waist_hip_ratio() const {
        if (!waist || !hip) {
            return std::nullopt;
        }
        return waist.value() / hip.value();
    }

    std::optional<double> waist_height_ratio() const {
        if (!waist) {
            return std::nullopt;
        }
        return waist.value() / height_cm();
    }

    double body_surface_area_m2() const {
        return 0.007184 * std::pow(weight, 0.425) * std::pow(height_cm(), 0.725);
    }

    std::optional<double> body_adiposity_index() const {
        if (!hip || height <= 0) {
            return std::nullopt;
        }
        return (hip.value() / std::pow(height, 1.5)) - 18.0;
    }

    std::optional<double> relative_fat_mass() const {
        if (!waist) {
            return std::nullopt;
        }
        if (sex.find('m') == 0) {
            return 64.0 - 20.0 * ((height * 100.0) / waist.value());
        }
        return 76.0 - 20.0 * ((height * 100.0) / waist.value());
    }

    double lbm_james() const {
        double h = height;
        double w = weight;
        if (sex.find('m') == 0) {
            return 1.10 * w - 128.0 * ((w / h) * (w / h));
        }
        return 1.07 * w - 148.0 * ((w / h) * (w / h));
    }

    double fat_mass_from_lbm(std::optional<double> lbm_kg = std::nullopt) const {
        double lbm = lbm_kg ? lbm_kg.value() : lbm_james();
        return weight - lbm;
    }

    // ---------------------------
    // Energy & metabolic
    // ---------------------------
    double bmr_mifflin() const {
        double base = 10.0 * weight + 6.25 * height_cm() - 5.0 * age;
        return base + (sex.find('m') == 0 ? 5.0 : -161.0);
    }

    double bmr_harris_benedict() const {
        if (sex.find('m') == 0) {
            return 66.47 + 13.75 * weight + 5.003 * height_cm() - 6.755 * age;
        }
        return 655.1 + 9.563 * weight + 1.85 * height_cm() - 4.676 * age;
    }

    double bmr_katch_mcardle(std::optional<double> lbm_kg = std::nullopt) const {
        double lbm = lbm_kg ? lbm_kg.value() : std::max(0.0, lbm_james());
        return 370.0 + 21.6 * lbm;
    }

    double tdee(double activity_factor = 1.55) const {
        return bmr_mifflin() * activity_factor;
    }

    // ---------------------------
    // Cardiovascular / hemodynamics
    // ---------------------------
    std::optional<double> map() const {
        if (!sbp || !dbp) {
            return std::nullopt;
        }
        return (sbp.value() + 2.0 * dbp.value()) / 3.0;
    }

    std::optional<double> rate_pressure_product() const {
        if (!sbp || !hr) {
            return std::nullopt;
        }
        return sbp.value() * hr.value();
    }

    std::optional<double> shock_index() const {
        if (!hr || !sbp) {
            return std::nullopt;
        }
        return hr.value() / sbp.value();
    }

    std::optional<double> cardiac_index(std::optional<double> co_l_min = std::nullopt) const {
        if (!co_l_min) {
            return std::nullopt;
        }
        return co_l_min.value() / body_surface_area_m2();
    }

    std::optional<double> svr(std::optional<double> co_l_min = std::nullopt, double cvp = 0.0) const {
        auto map_val = map();
        if (!co_l_min || !map_val) {
            return std::nullopt;
        }
        return ((map_val.value() - cvp) * 80.0) / co_l_min.value();
    }

    std::optional<double> cardiac_output_from_fick(double vo2_ml_min, double cao2_ml_dl, 
                                                   double cvo2_ml_dl) const {
        double a_v_diff = cao2_ml_dl - cvo2_ml_dl;
        if (a_v_diff <= 0) {
            return std::nullopt;
        }
        return vo2_ml_min / (a_v_diff * 10.0);
    }

    std::optional<double> ca_o2(std::optional<double> hb_g_dl = std::nullopt,
                                std::optional<double> sa_o2_frac = std::nullopt,
                                std::optional<double> pa_o2_mm = std::nullopt) const {
        auto hb_val = hb_g_dl ? hb_g_dl : hb;
        auto sa_val = sa_o2_frac ? sa_o2_frac : sa_o2;
        auto pa_val = pa_o2_mm ? pa_o2_mm : pa_o2;
        
        if (!hb_val || !sa_val || !pa_val) {
            return std::nullopt;
        }
        
        // Convert percentage to fraction if needed
        double sa = (sa_val.value() > 1.0) ? sa_val.value() / 100.0 : sa_val.value();
        
        return 1.34 * hb_val.value() * sa + 0.0031 * pa_val.value();
    }

    std::optional<double> cv_o2(std::optional<double> hb_g_dl = std::nullopt,
                                std::optional<double> sv_o2_frac = std::nullopt,
                                std::optional<double> pv_o2_mm = std::nullopt) const {
        auto hb_val = hb_g_dl ? hb_g_dl : hb;
        auto sv_val = sv_o2_frac ? sv_o2_frac : sv_o2;
        
        if (!hb_val || !sv_val) {
            return std::nullopt;
        }
        
        double sv = (sv_val.value() > 1.0) ? sv_val.value() / 100.0 : sv_val.value();
        double pv_val = pv_o2_mm ? pv_o2_mm.value() : 40.0;
        
        return 1.34 * hb_val.value() * sv + 0.0031 * pv_val;
    }

    std::optional<double> oxygen_delivery(double co_l_min, double ca_o2_ml_dl) const {
        return co_l_min * ca_o2_ml_dl * 10.0;
    }

    // ---------------------------
    // Respiratory / gas exchange
    // ---------------------------
    std::optional<double> alveolar_gas_eq(double fio2_frac = 0.21, double pb_mm = 760.0,
                                          double ph2o_mm = 47.0, double rq = 0.8) const {
        if (!pa_co2) {
            return std::nullopt;
        }
        return fio2_frac * (pb_mm - ph2o_mm) - (pa_co2.value() / rq);
    }

    std::optional<double> a_a_gradient(std::optional<double> pao2 = std::nullopt,
                                       std::optional<double> pao2_measured = std::nullopt) const {
        auto pao2_calc = pao2 ? pao2 : alveolar_gas_eq();
        if (!pao2_calc || !pao2_measured) {
            return std::nullopt;
        }
        return pao2_calc.value() - pao2_measured.value();
    }

    double oxygenation_index(double fio2_frac, double map_cm_h2o, double pao2_mm) const {
        return (fio2_frac * map_cm_h2o * 100.0) / pao2_mm;
    }

    // ---------------------------
    // Acid-base / electrolytes
    // ---------------------------
    double anion_gap(double na, std::optional<double> k, double cl, double hco3) const {
        if (!k) {
            return na - (cl + hco3);
        }
        return (na + k.value()) - (cl + hco3);
    }

    std::optional<double> corrected_anion_gap(double ag, 
                                              std::optional<double> albumin_gdl = std::nullopt) const {
        auto alb = albumin_gdl ? albumin_gdl : albumin;
        if (!alb) {
            return std::nullopt;
        }
        return ag + 2.5 * (4.0 - alb.value());
    }

    double calculated_osmolality(double na, std::optional<double> glucose_mgdl = std::nullopt,
                                 std::optional<double> bun_mgdl = std::nullopt,
                                 std::optional<double> ethanol_mgdl = std::nullopt) const {
        auto g = glucose_mgdl ? glucose_mgdl : glucose;
        auto b = bun_mgdl ? bun_mgdl : bun;
        auto e = ethanol_mgdl ? ethanol_mgdl : ethanol;
        
        double glucose_val = g ? g.value() : 0.0;
        double bun_val = b ? b.value() : 0.0;
        double ethanol_val = e ? e.value() : 0.0;
        
        return 2.0 * na + glucose_val / 18.0 + bun_val / 2.8 + ethanol_val / 3.7;
    }

    double osmolar_gap(double measured_osm, double na, 
                       std::optional<double> glucose_mgdl = std::nullopt,
                       std::optional<double> bun_mgdl = std::nullopt,
                       std::optional<double> ethanol_mgdl = std::nullopt) const {
        double calc = calculated_osmolality(na, glucose_mgdl, bun_mgdl, ethanol_mgdl);
        return measured_osm - calc;
    }

    // ---------------------------
    // Renal function
    // ---------------------------
    std::optional<double> cockcroft_gault() const {
        if (!creatinine) {
            return std::nullopt;
        }
        double sex_factor = sex.find('m') == 0 ? 1.0 : 0.85;
        return ((140.0 - age) * weight * sex_factor) / (72.0 * creatinine.value());
    }

    std::optional<double> mdrd_egfr() const {
        if (!creatinine) {
            return std::nullopt;
        }
        double sex_factor = sex.find('m') == 0 ? 1.0 : 0.742;
        return 175.0 * std::pow(creatinine.value(), -1.154) * std::pow(age, -0.203) * sex_factor;
    }

    // ---------------------------
    // Lipids / cardiometabolic indices
    // ---------------------------
    std::optional<double> ldl_friedewald() const {
        if (!tc || !hdl || !tg) {
            return std::nullopt;
        }
        return tc.value() - hdl.value() - (tg.value() / 5.0);
    }

    std::optional<double> non_hdl() const {
        if (!tc || !hdl) {
            return std::nullopt;
        }
        return tc.value() - hdl.value();
    }

    std::optional<double> atherogenic_index_of_plasma() const {
        if (!tg || !hdl) {
            return std::nullopt;
        }
        if (tg.value() <= 0 || hdl.value() <= 0) {
            return std::nullopt;
        }
        return std::log10(tg.value() / hdl.value());
    }

    std::optional<double> tyg_index() const {
        if (!tg || !glucose) {
            return std::nullopt;
        }
        return std::log((tg.value() * glucose.value()) / 2.0);
    }

    // ---------------------------
    // Insulin resistance indices
    // ---------------------------
    std::optional<double> homa_ir() const {
        if (!glucose || !insulin) {
            return std::nullopt;
        }
        return (glucose.value() * insulin.value()) / 405.0;
    }

    std::optional<double> quicki() const {
        if (!glucose || !insulin) {
            return std::nullopt;
        }
        return 1.0 / (std::log10(insulin.value()) + std::log10(glucose.value()));
    }

    // ---------------------------
    // Pharmacokinetics (basic)
    // ---------------------------
    double loading_dose(double target_conc_mg_l, double vd_l, double f = 1.0) const {
        return (target_conc_mg_l * vd_l) / f;
    }

    double maintenance_rate(double cl_l_hr, double css_mg_l, double f = 1.0) const {
        return (cl_l_hr * css_mg_l) / f;
    }

    double half_life(double vd_l, double cl_l_hr) const {
        return 0.693 * vd_l / cl_l_hr;
    }

    double michaelis_menten(double c_mg_l, double vmax_mg_hr, double km_mg_l) const {
        return (vmax_mg_hr * c_mg_l) / (km_mg_l + c_mg_l);
    }

    // ---------------------------
    // Compute blocks for organized output
    // ---------------------------
    std::map<std::string, std::optional<double>> compute_basic_block() const {
        std::map<std::string, std::optional<double>> out;
        out["BMI"] = bmi();
        out["BMI Prime"] = bmi_prime();
        out["Ponderal Index"] = ponderal_index();
        out["IBW (Devine kg)"] = ibw_devine();
        out["Adjusted BW (example)"] = adjusted_body_weight(weight);
        out["BSA (m^2)"] = body_surface_area_m2();
        out["Waist-Hip Ratio"] = waist_hip_ratio();
        out["Waist-Height Ratio"] = waist_height_ratio();
        out["BAI"] = body_adiposity_index();
        out["RFM"] = relative_fat_mass();
        out["LBM (James)"] = lbm_james();
        out["Fat Mass (kg)"] = fat_mass_from_lbm();
        return out;
    }

    std::map<std::string, std::optional<double>> compute_energy_block() const {
        std::map<std::string, std::optional<double>> out;
        out["BMR (Mifflin)"] = bmr_mifflin();
        out["BMR (Harris-Benedict)"] = bmr_harris_benedict();
        out["BMR (Katch-McArdle)"] = bmr_katch_mcardle();
        out["TDEE (activity factor 1.55)"] = tdee();
        out["Calories for Loss (TDEE-500)"] = tdee() - 500.0;
        out["Calories for Gain (TDEE+500)"] = tdee() + 500.0;
        out["Protein (1.6 g/kg) g/day"] = 1.6 * weight;
        out["Water (ml/day 35 ml/kg)"] = 35 * weight;
        return out;
    }

    std::map<std::string, std::optional<double>> compute_cardio_block() const {
        std::map<std::string, std::optional<double>> out;
        out["MAP (mmHg)"] = map();
        out["Rate Pressure Product"] = rate_pressure_product();
        out["Shock Index"] = shock_index();
        
        std::optional<double> conicity = std::nullopt;
        if (waist) {
            conicity = (waist.value() / 100.0) / (0.109 * std::sqrt(weight / height));
        }
        out["Conicity Index"] = conicity;
        return out;
    }

    std::map<std::string, std::optional<double>> compute_renal_block() const {
        std::map<std::string, std::optional<double>> out;
        out["Cockcroft-Gault CrCl (mL/min)"] = cockcroft_gault();
        out["MDRD eGFR (mL/min/1.73m^2)"] = mdrd_egfr();
        return out;
    }

    std::map<std::string, std::optional<double>> compute_lipid_block() const {
        std::map<std::string, std::optional<double>> out;
        out["LDL (Friedewald)"] = ldl_friedewald();
        out["Non-HDL"] = non_hdl();
        out["AIP"] = atherogenic_index_of_plasma();
        out["TyG"] = tyg_index();
        return out;
    }

    std::map<std::string, std::optional<double>> compute_insulin_ir_block() const {
        std::map<std::string, std::optional<double>> out;
        out["HOMA-IR"] = homa_ir();
        out["QUICKI"] = quicki();
        return out;
    }

    std::map<std::string, std::optional<double>> compute_pk_block() const {
        std::map<std::string, std::optional<double>> out;
        out["Example half-life for Vd=40L Cl=5L/hr"] = half_life(40.0, 5.0);
        return out;
    }

    std::map<std::string, std::optional<double>> compute_all() const {
        std::map<std::string, std::optional<double>> res;
        auto basic = compute_basic_block();
        auto energy = compute_energy_block();
        auto cardio = compute_cardio_block();
        auto renal = compute_renal_block();
        auto lipid = compute_lipid_block();
        auto insulin_ir = compute_insulin_ir_block();
        auto pk = compute_pk_block();
        
        res.insert(basic.begin(), basic.end());
        res.insert(energy.begin(), energy.end());
        res.insert(cardio.begin(), cardio.end());
        res.insert(renal.begin(), renal.end());
        res.insert(lipid.begin(), lipid.end());
        res.insert(insulin_ir.begin(), insulin_ir.end());
        res.insert(pk.begin(), pk.end());
        
        return res;
    }
};

// ---------------------------
// Interactive CLI functions
// ---------------------------
std::optional<double> float_input(const std::string& prompt, bool optional = false) {
    std::string input;
    std::cout << prompt;
    std::getline(std::cin, input);
    
    if (input.empty() && optional) {
        return std::nullopt;
    }
    
    try {
        return std::stod(input);
    } catch (const std::invalid_argument&) {
        std::cout << "Invalid number; try again.\n";
        return float_input(prompt, optional);
    }
}

void print_results(const std::map<std::string, std::optional<double>>& results) {
    std::cout << "\n--- Results ---\n";
    std::cout << std::fixed << std::setprecision(4);
    
    for (const auto& [key, value] : results) {
        std::cout << key << ": ";
        if (value) {
            std::cout << value.value();
        } else {
            std::cout << "(insufficient inputs)";
        }
        std::cout << "\n";
    }
}

int main() {
    std::cout << "=== BioMax Health Assistant – All-in-one C++ Version ===\n";
    
    auto weight = float_input("Weight (kg): ");
    auto height = float_input("Height (m): ");
    auto age = float_input("Age (years): ");
    
    std::string sex;
    std::cout << "Sex (male/female): ";
    std::getline(std::cin, sex);
    if (sex.empty()) sex = "male";
    
    auto waist = float_input("Waist (cm) [optional]: ", true);
    auto hip = float_input("Hip (cm) [optional]: ", true);
    auto hr = float_input("Heart rate (bpm) [optional]: ", true);
    auto sbp = float_input("Systolic BP (mmHg) [optional]: ", true);
    auto dbp = float_input("Diastolic BP (mmHg) [optional]: ", true);
    
    std::cout << "\n--- Optional labs (press Enter to skip) ---\n";
    auto creat = float_input("Serum creatinine (mg/dL) [optional]: ", true);
    auto hb = float_input("Hemoglobin (g/dL) [optional]: ", true);
    auto sa_o2 = float_input("SpO2 (%) [optional]: ", true);
    auto pa_o2 = float_input("PaO2 (mmHg) [optional]: ", true);
    auto sv_o2 = float_input("SvO2 (%) [optional]: ", true);
    auto pa_co2 = float_input("PaCO2 (mmHg) [optional]: ", true);
    auto glucose = float_input("Glucose (mg/dL) [optional]: ", true);
    auto insulin = float_input("Insulin (µU/mL) [optional]: ", true);
    auto tg = float_input("Triglycerides (mg/dL) [optional]: ", true);
    auto tc = float_input("Total Cholesterol (mg/dL) [optional]: ", true);
    auto hdl = float_input("HDL (mg/dL) [optional]: ", true);
    auto alb = float_input("Albumin (g/dL) [optional]: ", true);
    auto bun = float_input("BUN (mg/dL) [optional]: ", true);
    auto ethanol = float_input("Ethanol (mg/dL) [optional]: ", true);
    
    BioMax bio(weight.value(), height.value(), age.value(), sex,
               waist, hip, hr, sbp, dbp, hb, sa_o2, pa_o2, sv_o2, pa_co2,
               creat, glucose, insulin, tg, tc, hdl, alb, bun, ethanol);
    
    std::cout << "\nChoose category to compute:\n";
    std::cout << " 1) Basic anthropometry\n";
    std::cout << " 2) Energy / metabolic (BMR/TDEE)\n";
    std::cout << " 3) Cardio / hemodynamics\n";
    std::cout << " 4) Renal\n";
    std::cout << " 5) Lipids & cardiometabolic indices\n";
    std::cout << " 6) Insulin resistance\n";
    std::cout << " 7) Pharmacokinetics examples\n";
    std::cout << " 8) Compute ALL\n";
    
    std::string choice;
    std::cout << "Enter choice (1-8): ";
    std::getline(std::cin, choice);
    if (choice.empty()) choice = "8";
    
    std::map<std::string, std::optional<double>> results;
    
    if (choice == "1") {
        results = bio.compute_basic_block();
    } else if (choice == "2") {
        results = bio.compute_energy_block();
    } else if (choice == "3") {
        results = bio.compute_cardio_block();
    } else if (choice == "4") {
        results = bio.compute_renal_block();
    } else if (choice == "5") {
        results = bio.compute_lipid_block();
    } else if (choice == "6") {
        results = bio.compute_insulin_ir_block();
    } else if (choice == "7") {
        results = bio.compute_pk_block();
    } else {
        results = bio.compute_all();
    }
    
    print_results(results);
    
    std::cout << "\nDone. Compile with: g++ -std=c++17 -o biomax biomax_all_in_one.cpp\n";
    std::cout << "Run with: ./biomax\n";
    
    return 0;
}