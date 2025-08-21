import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Activity, Droplets, Plus, Trash2 } from 'lucide-react';

interface VitalRecord {
  id: string;
  date: string;
  time: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  notes: string;
}

const VitalsTracker: React.FC = () => {
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    notes: ''
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem('vitalRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const saveRecords = (newRecords: VitalRecord[]) => {
    localStorage.setItem('vitalRecords', JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const addRecord = () => {
    const newRecord: VitalRecord = {
      id: Date.now().toString(),
      date: formData.date,
      time: formData.time,
      bloodPressure: {
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic)
      },
      heartRate: parseInt(formData.heartRate),
      temperature: parseFloat(formData.temperature),
      oxygenSaturation: parseInt(formData.oxygenSaturation),
      notes: formData.notes
    };

    const updatedRecords = [newRecord, ...records];
    saveRecords(updatedRecords);
    
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      systolic: '',
      diastolic: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: '',
      notes: ''
    });
  };

  const deleteRecord = (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    saveRecords(updatedRecords);
  };

  const getBloodPressureCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { category: 'Normal', color: 'text-green-600' };
    if (systolic < 130 && diastolic < 80) return { category: 'Elevated', color: 'text-yellow-600' };
    if (systolic < 140 || diastolic < 90) return { category: 'Stage 1 High', color: 'text-orange-600' };
    if (systolic < 180 || diastolic < 120) return { category: 'Stage 2 High', color: 'text-red-600' };
    return { category: 'Crisis', color: 'text-red-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vital Signs Tracker</h1>
          <p className="text-lg text-gray-600">Monitor and record your vital signs over time</p>
        </div>

        {/* Add Record Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Record
          </button>
        </div>

        {/* Add Record Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Vital Signs Record</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={formData.systolic}
                      onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                      placeholder="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={formData.diastolic}
                      onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                      placeholder="80"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                      placeholder="72"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      placeholder="98.6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oxygen Saturation (%)</label>
                  <input
                    type="number"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                    placeholder="98"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={addRecord}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Save Record
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Records List */}
        <div className="space-y-6">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No vital signs recorded yet</p>
              <p className="text-gray-400">Add your first record to start tracking</p>
            </div>
          ) : (
            records.map((record) => {
              const bpCategory = getBloodPressureCategory(record.bloodPressure.systolic, record.bloodPressure.diastolic);
              return (
                <div key={record.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString()} at {record.time}
                      </h3>
                    </div>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Heart className="h-5 w-5 text-red-600 mr-2" />
                        <span className="font-medium text-gray-700">Blood Pressure</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                      </div>
                      <div className={`text-sm ${bpCategory.color}`}>{bpCategory.category}</div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-700">Heart Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{record.heartRate}</div>
                      <div className="text-sm text-gray-600">bpm</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Thermometer className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-medium text-gray-700">Temperature</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{record.temperature}</div>
                      <div className="text-sm text-gray-600">°F</div>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Droplets className="h-5 w-5 text-teal-600 mr-2" />
                        <span className="font-medium text-gray-700">O2 Saturation</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{record.oxygenSaturation}</div>
                      <div className="text-sm text-gray-600">%</div>
                    </div>
                  </div>

                  {record.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default VitalsTracker;