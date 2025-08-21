import React from 'react';
import { Calculator, Activity, FileText, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Calculator,
      title: 'Advanced Calculators',
      description: 'Professional-grade BMI, BMR, dosage, and lab value calculators with precise formulas.',
      action: () => onNavigate('bmi'),
      color: 'bg-blue-500'
    },
    {
      icon: Activity,
      title: 'Health Tracking',
      description: 'Monitor vital signs, track health metrics, and generate comprehensive reports.',
      action: () => onNavigate('vitals'),
      color: 'bg-green-500'
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Generate professional health reports with charts, trends, and recommendations.',
      action: () => onNavigate('reports'),
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Health Analytics',
      description: 'Visualize health trends and patterns with interactive charts and statistics.',
      action: () => onNavigate('stats'),
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Medical Calculations', value: '15+', icon: Calculator },
    { label: 'Health Metrics', value: '25+', icon: Activity },
    { label: 'Report Types', value: '10+', icon: FileText },
    { label: 'Users Served', value: '5000+', icon: Users }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Health
              <span className="text-blue-300"> Calculations</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Comprehensive biomedical calculators and health tracking tools designed for medical professionals and health-conscious individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('bmi')}
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Start Calculating <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Health Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade calculators and tracking tools built with medical accuracy and user experience in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200"
                  onClick={feature.action}
                >
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-200 mr-4" />
            <h2 className="text-3xl md:text-4xl font-bold">Trusted by Professionals</h2>
          </div>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Our calculations are based on peer-reviewed medical formulas and guidelines, ensuring accuracy and reliability for professional use.
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            Learn About Our Methodology <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;