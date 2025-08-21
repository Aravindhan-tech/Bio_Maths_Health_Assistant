import React, { useState } from 'react';
import { TestTube, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface LabTest {
  name: string;
  unit: string;
  ranges: {
    male?: { min: number; max: number };
    female?: { min: number; max: number };
    general?: { min: number; max: number };
  };
  description: string;
}

const LabsCalculator: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<'normal' | 'low' | 'high' | null>(null);

  const labTests: Record<string, LabTest> = {
    hemoglobin: {
      name: 'Hemoglobin',
      unit: 'g/dL',
      ranges: {
        male: { min: 13.8, max: 17.2 },
        female: { min: 12.1, max: 15.1 }
      },
      description: 'Measures oxygen-carrying capacity of blood'
    },
    hematocrit: {
      name: 'Hematocrit',
      unit: '%',
      ranges: {
        male: { min: 40.7, max: 50.3 },
        female: { min: 36.1, max: 44.3 }
      },
      description: 'Percentage of blood volume occupied by red blood cells'
    },
    wbc: {
      name: 'White Blood Cell Count',
      unit: '×10³/μL',
      ranges: {
        general: { min: 4.0, max: 11.0 }
      },
      description: 'Measures immune system cells'
    },
    platelet: {
      name: 'Platelet Count',
      unit: '×10³/μL',
      ranges: {
        general: { min: 150, max: 450 }
      },
      description: 'Cell fragments important for blood clotting'
    },
    glucose: {
      name: 'Blood Glucose (Fasting)',
      unit: 'mg/dL',
      ranges: {
        general: { min: 70, max: 100 }
      },
      description: 'Blood sugar level after fasting'
    },
    cholesterol: {
      name: 'Total Cholesterol',
      unit: 'mg/dL',
      ranges: {
        general: { min: 0, max: 200 }
      },
      description: 'Total cholesterol in blood'
    },
    hdl: {
      name: 'HDL Cholesterol',
      unit: 'mg/dL',
      ranges: {
        male: { min: 40, max: 999 },
        female: { min: 50, max: 999 }
      },
      description: 'Good cholesterol'
    },
    ldl: {
      name: 'LDL Cholesterol',
      unit: 'mg/dL',
      ranges: {
        general: { min: 0, max: 100 }
      },
      description: 'Bad cholesterol'
    },
    triglycerides: {
      name: 'Triglycerides',
      unit: 'mg/dL',
      ranges: {
        general: { min: 0, max: 150 }
      },
      description: 'Type of fat in blood'
    },
    bun: {
      name: 'Blood Urea Nitrogen',
      unit: 'mg/dL',
      ranges: {
        general: { min: 7, max: 20 }
      },
      description: 'Kidney function marker'
    },
    creatinine: {
      name: 'Serum Creatinine',
      unit: 'mg/dL',
      ranges: {
        male: { min: 0.74, max: 1.35 },
        female: { min: 0.59, max: 1.04 }
      },
      description: 'Kidney function marker'
    }
  };

  const analyzeResult = () => {
    const testValue = parseFloat(value);
    if (!testValue || !selectedTest) {
      setResult(null);
      return;
    }

    const test = labTests[selectedTest];
    if (!test) return;

    let range = test.ranges.general;
    if (test.ranges[gender]) {
      range = test.ranges[gender];
    }

    if (!range) return;

    if (testValue < range.min) {
      setResult('low');
    } else if (testValue > range.max) {
      setResult('high');
    } else {
      setResult('normal');
    }
  };

  React.useEffect(() => {
    analyzeResult();
  }, [selectedTest, value, gender]);

  const getResultColor = () => {
    switch (result) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getResultIcon = () => {
    switch (result) {
      case 'normal': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'low': return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      case 'high': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <TestTube className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lab Values Calculator</h1>
          <p className="text-lg text-gray-600">Interpret common laboratory test results</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This tool provides reference ranges for educational purposes. Always consult healthcare providers for result interpretation.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Lab Results</h2>
            
            {/* Test Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Test</label>
              <select
                value={selectedTest}
                onChange={(e) => {
                  setSelectedTest(e.target.value);
                  setValue('');
                  setResult(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select a test</option>
                {Object.entries(labTests).map(([key, test]) => (
                  <option key={key} value={key}>{test.name}</option>
                ))}
              </select>
            </div>

            {selectedTest && (
              <>
                {/* Gender Selection */}
                {labTests[selectedTest].ranges.male && labTests[selectedTest].ranges.female && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="male"
                          checked={gender === 'male'}
                          onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                          className="mr-2"
                        />
                        Male
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="female"
                          checked={gender === 'female'}
                          onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                          className="mr-2"
                        />
                        Female
                      </label>
                    </div>
                  </div>
                )}

                {/* Value Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Value ({labTests[selectedTest].unit})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter test result"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Result Display */}
                {result && value && (
                  <div className={`border rounded-lg p-4 ${getResultColor()}`}>
                    <div className="flex items-center justify-center mb-2">
                      {getResultIcon()}
                      <span className="ml-2 font-semibold capitalize">{result}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">{value} {labTests[selectedTest].unit}</div>
                      <div className="text-sm">
                        {(() => {
                          const test = labTests[selectedTest];
                          const range = test.ranges[gender] || test.ranges.general;
                          if (range) {
                            return `Reference range: ${range.min} - ${range.max} ${test.unit}`;
                          }
                          return '';
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Description */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{labTests[selectedTest].description}</p>
                </div>
              </>
            )}
          </div>

          {/* Reference Ranges */}
          <div className="space-y-6">
            {selectedTest && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <TestTube className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Reference Ranges</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(labTests[selectedTest].ranges).map(([key, range]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">
                        {key === 'general' ? 'All' : key}
                      </span>
                      <span className="text-gray-900">
                        {range.min} - {range.max} {labTests[selectedTest].unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Information Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>Reference Ranges:</strong> Normal values can vary between laboratories and depend on the testing method used.
                </p>
                <p>
                  <strong>Interpretation:</strong> Results outside normal ranges don't always indicate disease. Many factors can affect lab values.
                </p>
                <p>
                  <strong>Clinical Context:</strong> Lab results should always be interpreted in conjunction with clinical symptoms and medical history.
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Always consult with a healthcare provider for proper interpretation and medical advice.</strong>
                </p>
              </div>
            </div>

            {/* Color Legend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Result Indicators</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Normal - Within reference range</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Low - Below reference range</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-3" />
                  <span className="text-gray-700">High - Above reference range</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabsCalculator;