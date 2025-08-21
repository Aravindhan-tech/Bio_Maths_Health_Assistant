import React, { useState } from 'react';
import { Calculator, Activity, FileText, User, Home, Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import BMICalculator from './pages/calculators/BMICalculator';
import BMRCalculator from './pages/calculators/BMRCalculator';
import DosageCalculator from './pages/calculators/DosageCalculator';
import LabsCalculator from './pages/calculators/LabsCalculator';
import VitalsTracker from './pages/health/VitalsTracker';
import HealthStats from './pages/health/HealthStats';
import HealthReports from './pages/health/HealthReports';
import AboutPage from './pages/AboutPage';

type Page = 'home' | 'bmi' | 'bmr' | 'dosage' | 'labs' | 'vitals' | 'stats' | 'reports' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { 
      id: 'calculators', 
      label: 'Calculators', 
      icon: Calculator,
      submenu: [
        { id: 'bmi', label: 'BMI Calculator' },
        { id: 'bmr', label: 'BMR Calculator' },
        { id: 'dosage', label: 'Dosage Calculator' },
        { id: 'labs', label: 'Lab Values' }
      ]
    },
    { 
      id: 'health', 
      label: 'Health Tracking', 
      icon: Activity,
      submenu: [
        { id: 'vitals', label: 'Vital Signs' },
        { id: 'stats', label: 'Health Stats' },
        { id: 'reports', label: 'Reports' }
      ]
    },
    { id: 'about', label: 'About', icon: User }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'bmi': return <BMICalculator />;
      case 'bmr': return <BMRCalculator />;
      case 'dosage': return <DosageCalculator />;
      case 'labs': return <LabsCalculator />;
      case 'vitals': return <VitalsTracker />;
      case 'stats': return <HealthStats />;
      case 'reports': return <HealthReports />;
      case 'about': return <AboutPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Calculator className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">BioMaths Health Assistant</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <div key={item.id} className="relative group">
                  {item.submenu ? (
                    <div className="relative">
                      <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setCurrentPage(subItem.id as Page);
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentPage(item.id as Page);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <div>
                      <div className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </div>
                      <div className="pl-8 space-y-1">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setCurrentPage(subItem.id as Page);
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentPage(item.id as Page);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Calculator className="h-8 w-8 text-blue-400 mr-3" />
                <h2 className="text-xl font-bold">BioMaths Health Assistant</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Professional-grade health calculators and tracking tools for medical professionals and health-conscious individuals.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Calculators</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => setCurrentPage('bmi')} className="hover:text-white">BMI Calculator</button></li>
                <li><button onClick={() => setCurrentPage('bmr')} className="hover:text-white">BMR Calculator</button></li>
                <li><button onClick={() => setCurrentPage('dosage')} className="hover:text-white">Dosage Calculator</button></li>
                <li><button onClick={() => setCurrentPage('labs')} className="hover:text-white">Lab Values</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Health Tools</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => setCurrentPage('vitals')} className="hover:text-white">Vital Signs</button></li>
                <li><button onClick={() => setCurrentPage('stats')} className="hover:text-white">Health Stats</button></li>
                <li><button onClick={() => setCurrentPage('reports')} className="hover:text-white">Reports</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">About</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BioMaths Health Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;