import React from 'react';
import { Calculator, Shield, Users, Award, Mail, ExternalLink } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Medical-Grade Calculations',
      description: 'Our calculators use peer-reviewed medical formulas and guidelines, ensuring accuracy for professional use.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'All data is stored locally on your device. We never collect or transmit your personal health information.'
    },
    {
      icon: Users,
      title: 'Professional Use',
      description: 'Designed for healthcare professionals, students, and health-conscious individuals who need reliable tools.'
    },
    {
      icon: Award,
      title: 'Evidence-Based',
      description: 'All formulas and reference ranges are based on current medical literature and clinical guidelines.'
    }
  ];

  const calculators = [
    { name: 'BMI Calculator', description: 'Body Mass Index calculation with WHO categories' },
    { name: 'BMR Calculator', description: 'Basal Metabolic Rate using Harris-Benedict equation' },
    { name: 'Dosage Calculator', description: 'Medication dosage calculations with safety checks' },
    { name: 'Lab Values Interpreter', description: 'Reference ranges for common laboratory tests' }
  ];

  const healthTools = [
    { name: 'Vital Signs Tracker', description: 'Record and monitor blood pressure, heart rate, and more' },
    { name: 'Health Statistics', description: 'Analyze trends and patterns in your health data' },
    { name: 'Report Generator', description: 'Create comprehensive health reports for sharing' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About BioMaths Health Assistant</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive suite of biomedical calculators and health tracking tools designed for medical professionals, students, and health-conscious individuals.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            To provide accurate, reliable, and easy-to-use health calculation tools that support better healthcare decisions. 
            We believe that access to professional-grade medical calculators should be available to everyone, from healthcare 
            professionals to individuals monitoring their own health.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our tools are built with precision, following established medical guidelines and formulas, while maintaining 
            the highest standards of data privacy and security.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Tools */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Tools</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculators */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical Calculators</h3>
              <div className="space-y-4">
                {calculators.map((calc, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">{calc.name}</h4>
                    <p className="text-gray-600 text-sm">{calc.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tools */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Tracking Tools</h3>
              <div className="space-y-4">
                {healthTools.map((tool, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">{tool.name}</h4>
                    <p className="text-gray-600 text-sm">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculation Sources</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Harris-Benedict Equation (Revised) for BMR</li>
                <li>• WHO BMI Classification System</li>
                <li>• AHA Blood Pressure Guidelines</li>
                <li>• Clinical Laboratory Reference Ranges</li>
                <li>• Pediatric and Adult Dosing Guidelines</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data & Privacy</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Local storage only - no data transmission</li>
                <li>• No user accounts or registration required</li>
                <li>• Complete control over your health data</li>
                <li>• Export capabilities for personal records</li>
                <li>• HIPAA-conscious design principles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Accuracy Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-12">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Medical Disclaimer</h3>
              <p className="text-yellow-800 mb-2">
                This tool is designed for educational and informational purposes only. It is not intended to replace 
                professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-yellow-800">
                Always consult with qualified healthcare providers before making medical decisions. The calculations 
                provided are based on established formulas, but individual health factors may require personalized adjustments.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Feedback?</h2>
          <p className="text-gray-600 mb-6">
            We're committed to improving our tools and welcome your input from healthcare professionals and users.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center text-blue-600">
              <Mail className="h-5 w-5 mr-2" />
              <span>support@biomathshealth.com</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 BioMaths Health Assistant. Built with precision for healthcare professionals and health-conscious individuals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;