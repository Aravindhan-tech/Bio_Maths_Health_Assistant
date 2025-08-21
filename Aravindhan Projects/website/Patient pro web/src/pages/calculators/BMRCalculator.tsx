import React, { useState, useEffect } from 'react';
import { Activity, Info, Calculator, Flame } from 'lucide-react';

const BMRCalculator: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<string>('1.2');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);

  const calculateBMR = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) {
      setBmr(null);
      setTdee(null);
      return;
    }

    let weightKg = w;
    let heightCm = h;
    
    if (unit === 'imperial') {
      weightKg = w * 0.453592; // lbs to kg
      heightCm = h * 2.54; // inches to cm
    }

    // Harris-Benedict Equation (Revised)
    let bmrValue: number;
    if (gender === 'male') {
      bmrValue = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * a);
    } else {
      bmrValue = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * a);
    }

    setBmr(Math.round(bmrValue));
    setTdee(Math.round(bmrValue * parseFloat(activityLevel)));
  };

  useEffect(() => {
    calculateBMR();
  }, [age, height, weight, gender, activityLevel, unit]);

  const activityLevels = [
    { value: '1.2', label: 'Sedentary', description: 'Little or no exercise' },
    { value: '1.375', label: 'Lightly active', description: 'Light exercise/sports 1-3 days/week' },
    { value: '1.55', label: 'Moderately active', description: 'Moderate exercise/sports 3-5 days/week' },
    { value: '1.725', label: 'Very active', description: 'Hard exercise/sports 6-7 days/week' },
    { value: '1.9', label: 'Extra active', description: 'Very hard exercise/physical job' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">BMR Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your Basal Metabolic Rate and daily calorie needs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Your Details</h2>
            
            {/* Unit Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="metric"
                    checked={unit === 'metric'}
                    onChange={(e) => setUnit(e.target.value as 'metric' | 'imperial')}
                    className="mr-2"
                  />
                  Metric (kg, cm)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="imperial"
                    checked={unit === 'imperial'}
                    onChange={(e) => setUnit(e.target.value as 'metric' | 'imperial')}
                    className="mr-2"
                  />
                  Imperial (lbs, inches)
                </label>
              </div>
            </div>

            {/* Gender Selection */}
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

            {/* Age Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Height Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height {unit === 'metric' ? '(cm)' : '(inches)'}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={unit === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Weight Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Activity Level */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Results */}
            {bmr && tdee && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calculator className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-900">BMR (Basal Metabolic Rate)</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{bmr} calories/day</div>
                  <p className="text-sm text-gray-600">Calories needed at rest</p>
                </div>
                <div className="border-t pt-3 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="font-semibold text-gray-900">TDEE (Total Daily Energy Expenditure)</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">{tdee} calories/day</div>
                  <p className="text-sm text-gray-600">Total daily calories needed</p>
                </div>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Activity Levels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Activity Levels</h3>
              </div>
              <div className="space-y-3">
                {activityLevels.map((level, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{level.label}</span>
                      <span className="text-sm text-gray-500">×{level.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">About BMR & TDEE</h3>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>BMR</strong> is the number of calories your body needs to perform basic functions like breathing, circulation, and cell production.
                </p>
                <p>
                  <strong>TDEE</strong> is your BMR multiplied by your activity level factor to account for physical activity and exercise.
                </p>
                <p>
                  <strong>Formula (Harris-Benedict Revised):</strong><br />
                  Male: BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)<br />
                  Female: BMR = 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Note:</strong> These are estimates. Individual metabolism may vary. Consult a healthcare provider for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMRCalculator;