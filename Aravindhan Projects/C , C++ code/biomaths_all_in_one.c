/*
 * biomax_all_in_one.c
 * 
 * Unified BioMax Health Assistant - All-in-one interactive C program.
 * Covers many formulas from basic to advanced clinical/research level.
 * 
 * Usage:
 *     gcc -std=c99 -o biomax biomax_all_in_one.c -lm
 *     ./biomax
 * Enter requested values when prompted. Choose categories or "all" to compute everything.
 * 
 * Converted from Python version for comprehensive health calculations.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>

#define MAX_STRING_LEN 100
#define MAX_RESULTS 50
#define INVALID_VALUE -999999.0

// Structure to hold optional double values
typedef struct {
    double value;
    int has_value;
} OptionalDouble;

// Structure to hold calculation results
typedef struct {
    char name[MAX_STRING_LEN];
    OptionalDouble result;
} CalculationResult;

// Main BioMax structure
typedef struct {
    // Core measurements
    double weight;      // kg
    double height;      // m
    double age;         // years
    char sex[10];       // male/female
    
    // Anthropometric measurements
    OptionalDouble waist;     // cm
    OptionalDouble hip;       // cm
    
    // Vital signs
    OptionalDouble hr;        // bpm
    OptionalDouble sbp;       // mmHg
    OptionalDouble dbp;       // mmHg
    
    // Laboratory values
    OptionalDouble hb;           // g/dL
    OptionalDouble sa_o2;        // %
    OptionalDouble pa_o2;        // mmHg
    OptionalDouble sv_o2;        // %
    OptionalDouble pa_co2;       // mmHg
    OptionalDouble creatinine;   // mg/dL
    OptionalDouble glucose;      // mg/dL
    OptionalDouble insulin;      // µU/mL
    OptionalDouble tg;           // mg/dL
    OptionalDouble tc;           // mg/dL
    OptionalDouble hdl;          // mg/dL
    OptionalDouble albumin;      // g/dL
    OptionalDouble bun;          // mg/dL
    OptionalDouble ethanol;      // mg/dL
} BioMax;

// Helper functions for optional values
OptionalDouble make_optional(double value) {
    OptionalDouble opt = {value, 1};
    return opt;
}

OptionalDouble make_empty() {
    OptionalDouble opt = {0.0, 0};
    return opt;
}

int has_value(OptionalDouble opt) {
    return opt.has_value;
}

double get_value(OptionalDouble opt) {
    return opt.value;
}

// String utility functions
void to_lower(char* str) {
    for (int i = 0; str[i]; i++) {
        str[i] = tolower(str[i]);
    }
}

int starts_with(const char* str, char c) {
    return str[0] == c;
}

// Unit conversion helpers
double height_cm(const BioMax* bio) {
    return bio->height * 100.0;
}

double height_in(const BioMax* bio) {
    return bio->height * 39.3700787;
}

// ---------------------------
// Basic anthropometric formulas
// ---------------------------
double bmi(const BioMax* bio) {
    return bio->weight / (bio->height * bio->height);
}

double bmi_prime(const BioMax* bio) {
    return bmi(bio) / 25.0;
}

double ponderal_index(const BioMax* bio) {
    if (bio->height <= 0) {
        return INVALID_VALUE;
    }
    return bio->weight / (bio->height * bio->height * bio->height);
}

double ibw_devine(const BioMax* bio) {
    double h_in = height_in(bio);
    if (starts_with(bio->sex, 'm')) {
        return 50.0 + 2.3 * (h_in - 60.0);
    }
    return 45.5 + 2.3 * (h_in - 60.0);
}

OptionalDouble adjusted_body_weight(const BioMax* bio, double actual_weight_kg, double factor) {
    double ibw = ibw_devine(bio);
    return make_optional(ibw + factor * (actual_weight_kg - ibw));
}

OptionalDouble waist_hip_ratio(const BioMax* bio) {
    if (!has_value(bio->waist) || !has_value(bio->hip)) {
        return make_empty();
    }
    return make_optional(get_value(bio->waist) / get_value(bio->hip));
}

OptionalDouble waist_height_ratio(const BioMax* bio) {
    if (!has_value(bio->waist)) {
        return make_empty();
    }
    return make_optional(get_value(bio->waist) / height_cm(bio));
}

double body_surface_area_m2(const BioMax* bio) {
    return 0.007184 * pow(bio->weight, 0.425) * pow(height_cm(bio), 0.725);
}

OptionalDouble body_adiposity_index(const BioMax* bio) {
    if (!has_value(bio->hip) || bio->height <= 0) {
        return make_empty();
    }
    return make_optional((get_value(bio->hip) / pow(bio->height, 1.5)) - 18.0);
}

OptionalDouble relative_fat_mass(const BioMax* bio) {
    if (!has_value(bio->waist)) {
        return make_empty();
    }
    if (starts_with(bio->sex, 'm')) {
        return make_optional(64.0 - 20.0 * ((bio->height * 100.0) / get_value(bio->waist)));
    }
    return make_optional(76.0 - 20.0 * ((bio->height * 100.0) / get_value(bio->waist)));
}

double lbm_james(const BioMax* bio) {
    double h = bio->height;
    double w = bio->weight;
    if (starts_with(bio->sex, 'm')) {
        return 1.10 * w - 128.0 * ((w / h) * (w / h));
    }
    return 1.07 * w - 148.0 * ((w / h) * (w / h));
}

double fat_mass_from_lbm(const BioMax* bio, double lbm_kg) {
    return bio->weight - lbm_kg;
}

// ---------------------------
// Energy & metabolic
// ---------------------------
double bmr_mifflin(const BioMax* bio) {
    double base = 10.0 * bio->weight + 6.25 * height_cm(bio) - 5.0 * bio->age;
    return base + (starts_with(bio->sex, 'm') ? 5.0 : -161.0);
}

double bmr_harris_benedict(const BioMax* bio) {
    if (starts_with(bio->sex, 'm')) {
        return 66.47 + 13.75 * bio->weight + 5.003 * height_cm(bio) - 6.755 * bio->age;
    }
    return 655.1 + 9.563 * bio->weight + 1.85 * height_cm(bio) - 4.676 * bio->age;
}

double bmr_katch_mcardle(const BioMax* bio, double lbm_kg) {
    double lbm = (lbm_kg > 0) ? lbm_kg : fmax(0.0, lbm_james(bio));
    return 370.0 + 21.6 * lbm;
}

double tdee(const BioMax* bio, double activity_factor) {
    return bmr_mifflin(bio) * activity_factor;
}

// ---------------------------
// Cardiovascular / hemodynamics
// ---------------------------
OptionalDouble map_pressure(const BioMax* bio) {
    if (!has_value(bio->sbp) || !has_value(bio->dbp)) {
        return make_empty();
    }
    return make_optional((get_value(bio->sbp) + 2.0 * get_value(bio->dbp)) / 3.0);
}

OptionalDouble rate_pressure_product(const BioMax* bio) {
    if (!has_value(bio->sbp) || !has_value(bio->hr)) {
        return make_empty();
    }
    return make_optional(get_value(bio->sbp) * get_value(bio->hr));
}

OptionalDouble shock_index(const BioMax* bio) {
    if (!has_value(bio->hr) || !has_value(bio->sbp)) {
        return make_empty();
    }
    return make_optional(get_value(bio->hr) / get_value(bio->sbp));
}

OptionalDouble cardiac_index(const BioMax* bio, double co_l_min) {
    if (co_l_min <= 0) {
        return make_empty();
    }
    return make_optional(co_l_min / body_surface_area_m2(bio));
}

OptionalDouble svr(const BioMax* bio, double co_l_min, double cvp) {
    OptionalDouble map_val = map_pressure(bio);
    if (co_l_min <= 0 || !has_value(map_val)) {
        return make_empty();
    }
    return make_optional(((get_value(map_val) - cvp) * 80.0) / co_l_min);
}

OptionalDouble cardiac_output_from_fick(double vo2_ml_min, double cao2_ml_dl, double cvo2_ml_dl) {
    double a_v_diff = cao2_ml_dl - cvo2_ml_dl;
    if (a_v_diff <= 0) {
        return make_empty();
    }
    return make_optional(vo2_ml_min / (a_v_diff * 10.0));
}

OptionalDouble ca_o2(const BioMax* bio, OptionalDouble hb_g_dl, OptionalDouble sa_o2_frac, OptionalDouble pa_o2_mm) {
    OptionalDouble hb_val = has_value(hb_g_dl) ? hb_g_dl : bio->hb;
    OptionalDouble sa_val = has_value(sa_o2_frac) ? sa_o2_frac : bio->sa_o2;
    OptionalDouble pa_val = has_value(pa_o2_mm) ? pa_o2_mm : bio->pa_o2;
    
    if (!has_value(hb_val) || !has_value(sa_val) || !has_value(pa_val)) {
        return make_empty();
    }
    
    double sa = (get_value(sa_val) > 1.0) ? get_value(sa_val) / 100.0 : get_value(sa_val);
    return make_optional(1.34 * get_value(hb_val) * sa + 0.0031 * get_value(pa_val));
}

OptionalDouble cv_o2(const BioMax* bio, OptionalDouble hb_g_dl, OptionalDouble sv_o2_frac, double pv_o2_mm) {
    OptionalDouble hb_val = has_value(hb_g_dl) ? hb_g_dl : bio->hb;
    OptionalDouble sv_val = has_value(sv_o2_frac) ? sv_o2_frac : bio->sv_o2;
    
    if (!has_value(hb_val) || !has_value(sv_val)) {
        return make_empty();
    }
    
    double sv = (get_value(sv_val) > 1.0) ? get_value(sv_val) / 100.0 : get_value(sv_val);
    double pv_val = (pv_o2_mm > 0) ? pv_o2_mm : 40.0;
    
    return make_optional(1.34 * get_value(hb_val) * sv + 0.0031 * pv_val);
}

double oxygen_delivery(double co_l_min, double ca_o2_ml_dl) {
    return co_l_min * ca_o2_ml_dl * 10.0;
}

// ---------------------------
// Respiratory / gas exchange
// ---------------------------
OptionalDouble alveolar_gas_eq(const BioMax* bio, double fio2_frac, double pb_mm, double ph2o_mm, double rq) {
    if (!has_value(bio->pa_co2)) {
        return make_empty();
    }
    return make_optional(fio2_frac * (pb_mm - ph2o_mm) - (get_value(bio->pa_co2) / rq));
}

OptionalDouble a_a_gradient(OptionalDouble pao2, OptionalDouble pao2_measured) {
    if (!has_value(pao2) || !has_value(pao2_measured)) {
        return make_empty();
    }
    return make_optional(get_value(pao2) - get_value(pao2_measured));
}

double oxygenation_index(double fio2_frac, double map_cm_h2o, double pao2_mm) {
    return (fio2_frac * map_cm_h2o * 100.0) / pao2_mm;
}

// ---------------------------
// Acid-base / electrolytes
// ---------------------------
double anion_gap(double na, OptionalDouble k, double cl, double hco3) {
    if (!has_value(k)) {
        return na - (cl + hco3);
    }
    return (na + get_value(k)) - (cl + hco3);
}

OptionalDouble corrected_anion_gap(double ag, OptionalDouble albumin_gdl) {
    if (!has_value(albumin_gdl)) {
        return make_empty();
    }
    return make_optional(ag + 2.5 * (4.0 - get_value(albumin_gdl)));
}

double calculated_osmolality(double na, OptionalDouble glucose_mgdl, OptionalDouble bun_mgdl, OptionalDouble ethanol_mgdl) {
    double glucose_val = has_value(glucose_mgdl) ? get_value(glucose_mgdl) : 0.0;
    double bun_val = has_value(bun_mgdl) ? get_value(bun_mgdl) : 0.0;
    double ethanol_val = has_value(ethanol_mgdl) ? get_value(ethanol_mgdl) : 0.0;
    
    return 2.0 * na + glucose_val / 18.0 + bun_val / 2.8 + ethanol_val / 3.7;
}

double osmolar_gap(double measured_osm, double na, OptionalDouble glucose_mgdl, OptionalDouble bun_mgdl, OptionalDouble ethanol_mgdl) {
    double calc = calculated_osmolality(na, glucose_mgdl, bun_mgdl, ethanol_mgdl);
    return measured_osm - calc;
}

// ---------------------------
// Renal function
// ---------------------------
OptionalDouble cockcroft_gault(const BioMax* bio) {
    if (!has_value(bio->creatinine)) {
        return make_empty();
    }
    double sex_factor = starts_with(bio->sex, 'm') ? 1.0 : 0.85;
    return make_optional(((140.0 - bio->age) * bio->weight * sex_factor) / (72.0 * get_value(bio->creatinine)));
}

OptionalDouble mdrd_egfr(const BioMax* bio) {
    if (!has_value(bio->creatinine)) {
        return make_empty();
    }
    double sex_factor = starts_with(bio->sex, 'm') ? 1.0 : 0.742;
    return make_optional(175.0 * pow(get_value(bio->creatinine), -1.154) * pow(bio->age, -0.203) * sex_factor);
}

// ---------------------------
// Lipids / cardiometabolic indices
// ---------------------------
OptionalDouble ldl_friedewald(const BioMax* bio) {
    if (!has_value(bio->tc) || !has_value(bio->hdl) || !has_value(bio->tg)) {
        return make_empty();
    }
    return make_optional(get_value(bio->tc) - get_value(bio->hdl) - (get_value(bio->tg) / 5.0));
}

OptionalDouble non_hdl(const BioMax* bio) {
    if (!has_value(bio->tc) || !has_value(bio->hdl)) {
        return make_empty();
    }
    return make_optional(get_value(bio->tc) - get_value(bio->hdl));
}

OptionalDouble atherogenic_index_of_plasma(const BioMax* bio) {
    if (!has_value(bio->tg) || !has_value(bio->hdl)) {
        return make_empty();
    }
    if (get_value(bio->tg) <= 0 || get_value(bio->hdl) <= 0) {
        return make_empty();
    }
    return make_optional(log10(get_value(bio->tg) / get_value(bio->hdl)));
}

OptionalDouble tyg_index(const BioMax* bio) {
    if (!has_value(bio->tg) || !has_value(bio->glucose)) {
        return make_empty();
    }
    return make_optional(log((get_value(bio->tg) * get_value(bio->glucose)) / 2.0));
}

// ---------------------------
// Insulin resistance indices
// ---------------------------
OptionalDouble homa_ir(const BioMax* bio) {
    if (!has_value(bio->glucose) || !has_value(bio->insulin)) {
        return make_empty();
    }
    return make_optional((get_value(bio->glucose) * get_value(bio->insulin)) / 405.0);
}

OptionalDouble quicki(const BioMax* bio) {
    if (!has_value(bio->glucose) || !has_value(bio->insulin)) {
        return make_empty();
    }
    return make_optional(1.0 / (log10(get_value(bio->insulin)) + log10(get_value(bio->glucose))));
}

// ---------------------------
// Pharmacokinetics (basic)
// ---------------------------
double loading_dose(double target_conc_mg_l, double vd_l, double f) {
    return (target_conc_mg_l * vd_l) / f;
}

double maintenance_rate(double cl_l_hr, double css_mg_l, double f) {
    return (cl_l_hr * css_mg_l) / f;
}

double half_life_calc(double vd_l, double cl_l_hr) {
    return 0.693 * vd_l / cl_l_hr;
}

double michaelis_menten(double c_mg_l, double vmax_mg_hr, double km_mg_l) {
    return (vmax_mg_hr * c_mg_l) / (km_mg_l + c_mg_l);
}

// ---------------------------
// Compute blocks for organized output
// ---------------------------
int compute_basic_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "BMI");
    results[count].result = make_optional(bmi(bio));
    count++;
    
    strcpy(results[count].name, "BMI Prime");
    results[count].result = make_optional(bmi_prime(bio));
    count++;
    
    strcpy(results[count].name, "Ponderal Index");
    double pi = ponderal_index(bio);
    results[count].result = (pi != INVALID_VALUE) ? make_optional(pi) : make_empty();
    count++;
    
    strcpy(results[count].name, "IBW (Devine kg)");
    results[count].result = make_optional(ibw_devine(bio));
    count++;
    
    strcpy(results[count].name, "Adjusted BW (example)");
    results[count].result = adjusted_body_weight(bio, bio->weight, 0.4);
    count++;
    
    strcpy(results[count].name, "BSA (m^2)");
    results[count].result = make_optional(body_surface_area_m2(bio));
    count++;
    
    strcpy(results[count].name, "Waist-Hip Ratio");
    results[count].result = waist_hip_ratio(bio);
    count++;
    
    strcpy(results[count].name, "Waist-Height Ratio");
    results[count].result = waist_height_ratio(bio);
    count++;
    
    strcpy(results[count].name, "BAI");
    results[count].result = body_adiposity_index(bio);
    count++;
    
    strcpy(results[count].name, "RFM");
    results[count].result = relative_fat_mass(bio);
    count++;
    
    strcpy(results[count].name, "LBM (James)");
    results[count].result = make_optional(lbm_james(bio));
    count++;
    
    strcpy(results[count].name, "Fat Mass (kg)");
    results[count].result = make_optional(fat_mass_from_lbm(bio, lbm_james(bio)));
    count++;
    
    return count;
}

int compute_energy_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "BMR (Mifflin)");
    results[count].result = make_optional(bmr_mifflin(bio));
    count++;
    
    strcpy(results[count].name, "BMR (Harris-Benedict)");
    results[count].result = make_optional(bmr_harris_benedict(bio));
    count++;
    
    strcpy(results[count].name, "BMR (Katch-McArdle)");
    results[count].result = make_optional(bmr_katch_mcardle(bio, -1));
    count++;
    
    double tdee_val = tdee(bio, 1.55);
    strcpy(results[count].name, "TDEE (activity factor 1.55)");
    results[count].result = make_optional(tdee_val);
    count++;
    
    strcpy(results[count].name, "Calories for Loss (TDEE-500)");
    results[count].result = make_optional(tdee_val - 500.0);
    count++;
    
    strcpy(results[count].name, "Calories for Gain (TDEE+500)");
    results[count].result = make_optional(tdee_val + 500.0);
    count++;
    
    strcpy(results[count].name, "Protein (1.6 g/kg) g/day");
    results[count].result = make_optional(1.6 * bio->weight);
    count++;
    
    strcpy(results[count].name, "Water (ml/day 35 ml/kg)");
    results[count].result = make_optional(35 * bio->weight);
    count++;
    
    return count;
}

int compute_cardio_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "MAP (mmHg)");
    results[count].result = map_pressure(bio);
    count++;
    
    strcpy(results[count].name, "Rate Pressure Product");
    results[count].result = rate_pressure_product(bio);
    count++;
    
    strcpy(results[count].name, "Shock Index");
    results[count].result = shock_index(bio);
    count++;
    
    strcpy(results[count].name, "Conicity Index");
    if (has_value(bio->waist)) {
        double conicity = (get_value(bio->waist) / 100.0) / (0.109 * sqrt(bio->weight / bio->height));
        results[count].result = make_optional(conicity);
    } else {
        results[count].result = make_empty();
    }
    count++;
    
    return count;
}

int compute_renal_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "Cockcroft-Gault CrCl (mL/min)");
    results[count].result = cockcroft_gault(bio);
    count++;
    
    strcpy(results[count].name, "MDRD eGFR (mL/min/1.73m^2)");
    results[count].result = mdrd_egfr(bio);
    count++;
    
    return count;
}

int compute_lipid_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "LDL (Friedewald)");
    results[count].result = ldl_friedewald(bio);
    count++;
    
    strcpy(results[count].name, "Non-HDL");
    results[count].result = non_hdl(bio);
    count++;
    
    strcpy(results[count].name, "AIP");
    results[count].result = atherogenic_index_of_plasma(bio);
    count++;
    
    strcpy(results[count].name, "TyG");
    results[count].result = tyg_index(bio);
    count++;
    
    return count;
}

int compute_insulin_ir_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "HOMA-IR");
    results[count].result = homa_ir(bio);
    count++;
    
    strcpy(results[count].name, "QUICKI");
    results[count].result = quicki(bio);
    count++;
    
    return count;
}

int compute_pk_block(const BioMax* bio, CalculationResult* results) {
    int count = 0;
    
    strcpy(results[count].name, "Example half-life for Vd=40L Cl=5L/hr");
    results[count].result = make_optional(half_life_calc(40.0, 5.0));
    count++;
    
    return count;
}

int compute_all(const BioMax* bio, CalculationResult* results) {
    int total_count = 0;
    
    total_count += compute_basic_block(bio, &results[total_count]);
    total_count += compute_energy_block(bio, &results[total_count]);
    total_count += compute_cardio_block(bio, &results[total_count]);
    total_count += compute_renal_block(bio, &results[total_count]);
    total_count += compute_lipid_block(bio, &results[total_count]);
    total_count += compute_insulin_ir_block(bio, &results[total_count]);
    total_count += compute_pk_block(bio, &results[total_count]);
    
    return total_count;
}

// ---------------------------
// Interactive CLI functions
// ---------------------------
OptionalDouble float_input(const char* prompt, int optional) {
    char input[100];
    printf("%s", prompt);
    
    if (fgets(input, sizeof(input), stdin) == NULL) {
        return make_empty();
    }
    
    // Remove newline if present
    input[strcspn(input, "\n")] = 0;
    
    if (strlen(input) == 0 && optional) {
        return make_empty();
    }
    
    char* endptr;
    double value = strtod(input, &endptr);
    
    if (*endptr != '\0' && *endptr != '\n') {
        printf("Invalid number; try again.\n");
        return float_input(prompt, optional);
    }
    
    return make_optional(value);
}

void print_results(const CalculationResult* results, int count) {
    printf("\n--- Results ---\n");
    
    for (int i = 0; i < count; i++) {
        printf("%s: ", results[i].name);
        if (has_value(results[i].result)) {
            printf("%.4f", get_value(results[i].result));
        } else {
            printf("(insufficient inputs)");
        }
        printf("\n");
    }
}

int main() {
    printf("=== BioMax Health Assistant – All-in-one C Version ===\n");
    
    BioMax bio = {0};
    
    OptionalDouble weight = float_input("Weight (kg): ", 0);
    OptionalDouble height = float_input("Height (m): ", 0);
    OptionalDouble age = float_input("Age (years): ", 0);
    
    if (!has_value(weight) || !has_value(height) || !has_value(age)) {
        printf("Weight, height, and age are required!\n");
        return 1;
    }
    
    bio.weight = get_value(weight);
    bio.height = get_value(height);
    bio.age = get_value(age);
    
    printf("Sex (male/female): ");
    fgets(bio.sex, sizeof(bio.sex), stdin);
    bio.sex[strcspn(bio.sex, "\n")] = 0; // Remove newline
    if (strlen(bio.sex) == 0) {
        strcpy(bio.sex, "male");
    }
    to_lower(bio.sex);
    
    bio.waist = float_input("Waist (cm) [optional]: ", 1);
    bio.hip = float_input("Hip (cm) [optional]: ", 1);
    bio.hr = float_input("Heart rate (bpm) [optional]: ", 1);
    bio.sbp = float_input("Systolic BP (mmHg) [optional]: ", 1);
    bio.dbp = float_input("Diastolic BP (mmHg) [optional]: ", 1);
    
    printf("\n--- Optional labs (press Enter to skip) ---\n");
    bio.creatinine = float_input("Serum creatinine (mg/dL) [optional]: ", 1);
    bio.hb = float_input("Hemoglobin (g/dL) [optional]: ", 1);
    bio.sa_o2 = float_input("SpO2 (%) [optional]: ", 1);
    bio.pa_o2 = float_input("PaO2 (mmHg) [optional]: ", 1);
    bio.sv_o2 = float_input("SvO2 (%) [optional]: ", 1);
    bio.pa_co2 = float_input("PaCO2 (mmHg) [optional]: ", 1);
    bio.glucose = float_input("Glucose (mg/dL) [optional]: ", 1);
    bio.insulin = float_input("Insulin (µU/mL) [optional]: ", 1);
    bio.tg = float_input("Triglycerides (mg/dL) [optional]: ", 1);
    bio.tc = float_input("Total Cholesterol (mg/dL) [optional]: ", 1);
    bio.hdl = float_input("HDL (mg/dL) [optional]: ", 1);
    bio.albumin = float_input("Albumin (g/dL) [optional]: ", 1);
    bio.bun = float_input("BUN (mg/dL) [optional]: ", 1);
    bio.ethanol = float_input("Ethanol (mg/dL) [optional]: ", 1);
    
    printf("\nChoose category to compute:\n");
    printf(" 1) Basic anthropometry\n");
    printf(" 2) Energy / metabolic (BMR/TDEE)\n");
    printf(" 3) Cardio / hemodynamics\n");
    printf(" 4) Renal\n");
    printf(" 5) Lipids & cardiometabolic indices\n");
    printf(" 6) Insulin resistance\n");
    printf(" 7) Pharmacokinetics examples\n");
    printf(" 8) Compute ALL\n");
    
    char choice[10];
    printf("Enter choice (1-8): ");
    fgets(choice, sizeof(choice), stdin);
    choice[strcspn(choice, "\n")] = 0;
    if (strlen(choice) == 0) {
        strcpy(choice, "8");
    }
    
    CalculationResult results[MAX_RESULTS];
    int result_count = 0;
    
    if (strcmp(choice, "1") == 0) {
        result_count = compute_basic_block(&bio, results);
    } else if (strcmp(choice, "2") == 0) {
        result_count = compute_energy_block(&bio, results);
    } else if (strcmp(choice, "3") == 0) {
        result_count = compute_cardio_block(&bio, results);
    } else if (strcmp(choice, "4") == 0) {
        result_count = compute_renal_block(&bio, results);
    } else if (strcmp(choice, "5") == 0) {
        result_count = compute_lipid_block(&bio, results);
    } else if (strcmp(choice, "6") == 0) {
        result_count = compute_insulin_ir_block(&bio, results);
    } else if (strcmp(choice, "7") == 0) {
        result_count = compute_pk_block(&bio, results);
    } else {
        result_count = compute_all(&bio, results);
    }
    
    print_results(results, result_count);
    
    printf("\nDone. Compile with: gcc -std=c99 -o biomax biomax_all_in_one.c -lm\n");
    printf("Run with: ./biomax\n");
    
    return 0;
}