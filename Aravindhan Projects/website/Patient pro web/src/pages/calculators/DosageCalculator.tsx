import React, { useState, useEffect } from 'react';
import { Pill, AlertTriangle, Info, Calculator } from 'lucide-react';

interface Medication {
  name: string;
  concentrations: number[];
  unit: string;
  maxDose?: number;
  weightBased?: boolean;
}

const DosageCalculator: React.FC = () => {
  const [selectedMed, setSelectedMed] = useState<string>('');
  const [patientWeight, setPatientWeight] = useState<string>('');
  const [dose, setDose] = useState<string>('');
  const [concentration, setConcentration] = useState<string>('');
  const [calculatedVolume, setCalculatedVolume] = useState<number | null>(null);
  const [warning, setWarning] = useState<string>('');

  const medications: Record<string, Medication> = {
    paracetamol: {
      name: 'Paracetamol',
      concentrations: [120, 250], // mg/5ml
      unit: 'mg/5ml',
      maxDose: 15, // mg/kg/dose
      weightBased: true
    },
    ibuprofen: {
      name: 'Ibuprofen',
      concentrations: [100, 200], // mg/5ml
      unit: 'mg/5ml',
      maxDose: 10, // mg/kg/dose
      weightBased: true
    },
    amoxicillin: {
      name: 'Amoxicillin',
      concentrations: [125, 250], // mg/5ml
      unit: 'mg/5ml',
      maxDose: 40, // mg/kg/dose
      weightBased: true
    },
    aspirin: {
      name: 'Aspirin',
      concentrations: [81, 325, 500], // mg/tablet
      unit: 'mg/tablet',
      maxDose: 1000, // mg/dose (adult)
      weightBased: false
    }
  };

  const calculateDosage = () => {
    const weight = parseFloat(patientWeight);
    const doseValue = parseFloat(dose);
    const concentrationValue = parseFloat(concentration);
    
    if (!doseValue || !concentrationValue) {
      setCalculatedVolume(null);
      setWarning('');
      return;
    }

    const medication = medications[selectedMed];
    if (!medication) return;

    let finalDose = doseValue;
    
    // Check if it's weight-based
    if (medication.weightBased && weight) {
      if (doseValue > weight) {
        // Assume dose is total dose, calculate per kg
        finalDose = doseValue;
      } else {
        // Assume dose is per kg, calculate total
        finalDose = doseValue * weight;
      }
    }

    // Calculate volume needed
    let volume: number;
    if (medication.unit.includes('5ml')) {
      // Liquid medication
      volume = (finalDose / concentrationValue) * 5;
    } else {
      // Tablet/solid medication
      volume = finalDose / concentrationValue;
    }

    setCalculatedVolume(Math.round(volume * 100) / 100);

    // Check for warnings
    let warningMessage = '';
    if (medication.maxDose) {
      if (medication.weightBased && weight) {
        const maxTotalDose = medication.maxDose * weight;
        if (finalDose > maxTotalDose) {
          warningMessage = `Warning: Dose exceeds maximum recommended dose of ${medication.maxDose} mg/kg (${maxTotalDose} mg total)`;
        }
      } else if (!medication.weightBased && finalDose > medication.maxDose) {
        warningMessage = `Warning: Dose exceeds maximum recommended dose of ${medication.maxDose} mg`;
      }
    }
    setWarning(warningMessage);
  };

  useEffect(() => {
    calculateDosage();
  }, [selectedMed, patientWeight, dose, concentration]);

  const handleMedicationChange = (medKey: string) => {
    setSelectedMed(medKey);
    setConcentration('');
    setCalculatedVolume(null);
    setWarning('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Pill className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dosage Calculator</h1>
          <p className="text-lg text-gray-600">Calculate medication dosages and volumes</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This calculator is for educational purposes only. Always verify calculations and consult prescribing information before administering medications.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Calculate Dosage</h2>
            
            {/* Medication Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
              <select
                value={selectedMed}
                onChange={(e) => handleMedicationChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select medication</option>
                {Object.entries(medications).map(([key, med]) => (
                  <option key={key} value={key}>{med.name}</option>
                ))}
              </select>
            </div>

            {selectedMed && (
              <>
                {/* Patient Weight */}
                {medications[selectedMed].weightBased && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Weight (kg)</label>
                    <input
                      type="number"
                      value={patientWeight}
                      onChange={(e) => setPatientWeight(e.target.value)}
                      placeholder="e.g., 70"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}

                {/* Dose */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dose {medications[selectedMed].weightBased ? '(mg/kg or total mg)' : '(mg)'}
                  </label>
                  <input
                    type="number"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    placeholder={medications[selectedMed].weightBased ? "e.g., 10 or 500" : "e.g., 500"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Concentration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Concentration ({medications[selectedMed].unit})
                  </label>
                  <select
                    value={concentration}
                    onChange={(e) => setConcentration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select concentration</option>
                    {medications[selectedMed].concentrations.map((conc) => (
                      <option key={conc} value={conc}>{conc} {medications[selectedMed].unit}</option>
                    ))}
                  </select>
                </div>

                {/* Result */}
                {calculatedVolume !== null && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Calculator className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-semibold text-gray-900">Required Amount</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {calculatedVolume} {medications[selectedMed].unit.includes('5ml') ? 'ml' : 'tablets'}
                      </div>
                      {medications[selectedMed].unit.includes('5ml') && calculatedVolume > 0 && (
                        <p className="text-sm text-gray-600">
                          {calculatedVolume <= 2.5 && 'Use oral syringe for accuracy'}
                          {calculatedVolume > 2.5 && calculatedVolume <= 10 && 'Use measuring spoon or oral syringe'}
                          {calculatedVolume > 10 && 'Use measuring cup'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Warning */}
                {warning && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                      <p className="text-sm text-red-800">{warning}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Medication Info */}
            {selectedMed && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Pill className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{medications[selectedMed].name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Available Concentrations:</span>
                    <ul className="mt-1 space-y-1">
                      {medications[selectedMed].concentrations.map((conc) => (
                        <li key={conc} className="text-gray-600 ml-4">
                          • {conc} {medications[selectedMed].unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {medications[selectedMed].maxDose && (
                    <div>
                      <span className="font-medium text-gray-700">Maximum Dose:</span>
                      <p className="text-gray-600 mt-1">
                        {medications[selectedMed].maxDose} {medications[selectedMed].weightBased ? 'mg/kg/dose' : 'mg/dose'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dosage Formula */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Dosage Calculation</h3>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>Basic Formula:</strong><br />
                  Volume = (Dose Required / Concentration) × Volume of concentration
                </p>
                <p>
                  <strong>For liquids (mg/5ml):</strong><br />
                  Volume (ml) = (Dose in mg / Concentration per 5ml) × 5
                </p>
                <p>
                  <strong>For tablets:</strong><br />
                  Number of tablets = Total dose (mg) / Strength per tablet (mg)
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Safety Notes:</strong>
                  <br />• Always double-check calculations
                  <br />• Verify patient weight and allergies
                  <br />• Check maximum dose limits
                  <br />• Use appropriate measuring devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosageCalculator;