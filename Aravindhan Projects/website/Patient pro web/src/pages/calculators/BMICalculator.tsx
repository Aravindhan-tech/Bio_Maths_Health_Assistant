import React, { useState, useEffect } from 'react';
import { Calculator, Info, TrendingUp } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [categoryColor, setCategoryColor] = useState<string>('');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (!h || !w || h <= 0 || w <= 0) {
      setBmi(null);
      setCategory('');
      return;
    }

    let bmiValue: number;
    if (unit === 'metric') {
      // BMI = weight (kg) / height (m)²
      bmiValue = w / ((h / 100) ** 2);
    } else {
      // BMI = (weight (lbs) / height (inches)²) * 703
      bmiValue = (w / (h ** 2)) * 703;
    }

    setBmi(Math.round(bmiValue * 10) / 10);
    
    // Determine category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
      setCategoryColor('text-blue-600 bg-blue-50');
    } else if (bmiValue < 25) {
      setCategory('Normal weight');
      setCategoryColor('text-green-600 bg-green-50');
    } else if (bmiValue < 30) {
      setCategory('Overweight');
      setCategoryColor('text-orange-600 bg-orange-50');
    } else {
      setCategory('Obese');
      setCategoryColor('text-red-600 bg-red-50');
    }
  };

  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit]);

  const bmiCategories = [
    { range: 'Below 18.5', category: 'Underweight', color: 'bg-blue-100 text-blue-800' },
    { range: '18.5 - 24.9', category: 'Normal weight', color: 'bg-green-100 text-green-800' },
    { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-orange-100 text-orange-800' },
    { range: '30.0 and above', category: 'Obese', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">BMI Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your Body Mass Index and understand your weight category</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Result */}
            {bmi && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{bmi}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                    {category}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* BMI Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">BMI Categories</h3>
              </div>
              <div className="space-y-3">
                {bmiCategories.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-900">{cat.range}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.color}`}>
                      {cat.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">About BMI</h3>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>
                  Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women.
                </p>
                <p>
                  <strong>Formula:</strong><br />
                  Metric: BMI = weight (kg) / [height (m)]²<br />
                  Imperial: BMI = (weight (lbs) / [height (in)]²) × 703
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Note:</strong> BMI is a screening tool and is not diagnostic. Consult with a healthcare provider for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;