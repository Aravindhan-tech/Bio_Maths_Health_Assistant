import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Calendar, Target } from 'lucide-react';

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

const HealthStats: React.FC = () => {
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    const savedRecords = localStorage.getItem('vitalRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const filterRecordsByTimeRange = (records: VitalRecord[], range: string) => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (range) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        return records;
    }
    
    return records.filter(record => new Date(record.date) >= cutoffDate);
  };

  const filteredRecords = filterRecordsByTimeRange(records, timeRange);

  const calculateStats = () => {
    if (filteredRecords.length === 0) {
      return {
        avgSystolic: 0,
        avgDiastolic: 0,
        avgHeartRate: 0,
        avgTemperature: 0,
        avgOxygenSat: 0,
        recordCount: 0
      };
    }

    const totals = filteredRecords.reduce((acc, record) => ({
      systolic: acc.systolic + record.bloodPressure.systolic,
      diastolic: acc.diastolic + record.bloodPressure.diastolic,
      heartRate: acc.heartRate + record.heartRate,
      temperature: acc.temperature + record.temperature,
      oxygenSat: acc.oxygenSat + record.oxygenSaturation
    }), { systolic: 0, diastolic: 0, heartRate: 0, temperature: 0, oxygenSat: 0 });

    const count = filteredRecords.length;
    return {
      avgSystolic: Math.round(totals.systolic / count),
      avgDiastolic: Math.round(totals.diastolic / count),
      avgHeartRate: Math.round(totals.heartRate / count),
      avgTemperature: Math.round((totals.temperature / count) * 10) / 10,
      avgOxygenSat: Math.round(totals.oxygenSat / count),
      recordCount: count
    };
  };

  const getTrends = () => {
    if (filteredRecords.length < 2) return null;

    const sorted = [...filteredRecords].sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
    const recent = sorted.slice(-Math.ceil(sorted.length / 2));
    const older = sorted.slice(0, Math.floor(sorted.length / 2));

    if (recent.length === 0 || older.length === 0) return null;

    const recentAvg = {
      systolic: recent.reduce((sum, r) => sum + r.bloodPressure.systolic, 0) / recent.length,
      diastolic: recent.reduce((sum, r) => sum + r.bloodPressure.diastolic, 0) / recent.length,
      heartRate: recent.reduce((sum, r) => sum + r.heartRate, 0) / recent.length,
      temperature: recent.reduce((sum, r) => sum + r.temperature, 0) / recent.length,
      oxygenSat: recent.reduce((sum, r) => sum + r.oxygenSaturation, 0) / recent.length
    };

    const olderAvg = {
      systolic: older.reduce((sum, r) => sum + r.bloodPressure.systolic, 0) / older.length,
      diastolic: older.reduce((sum, r) => sum + r.bloodPressure.diastolic, 0) / older.length,
      heartRate: older.reduce((sum, r) => sum + r.heartRate, 0) / older.length,
      temperature: older.reduce((sum, r) => sum + r.temperature, 0) / older.length,
      oxygenSat: older.reduce((sum, r) => sum + r.oxygenSaturation, 0) / older.length
    };

    return {
      systolic: recentAvg.systolic - olderAvg.systolic,
      diastolic: recentAvg.diastolic - olderAvg.diastolic,
      heartRate: recentAvg.heartRate - olderAvg.heartRate,
      temperature: recentAvg.temperature - olderAvg.temperature,
      oxygenSat: recentAvg.oxygenSat - olderAvg.oxygenSat
    };
  };

  const stats = calculateStats();
  const trends = getTrends();

  const getTrendIcon = (value: number) => {
    if (value > 0) return '↗️';
    if (value < 0) return '↘️';
    return '➡️';
  };

  const getTrendColor = (value: number, isGoodWhenLow: boolean = false) => {
    if (Math.abs(value) < 0.1) return 'text-gray-600';
    if (isGoodWhenLow) {
      return value > 0 ? 'text-red-600' : 'text-green-600';
    } else {
      return value > 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Health Statistics</h1>
          <p className="text-lg text-gray-600">Analyze your health trends and patterns</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
              { key: 'all', label: 'All Time' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeRange(option.key as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  timeRange === option.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No data available</p>
            <p className="text-gray-400">Start tracking your vital signs to see statistics</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-700">Records</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.recordCount}</div>
                <p className="text-sm text-gray-600">Total measurements in {timeRange === 'all' ? 'all time' : timeRange}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-semibold text-gray-700">Avg Blood Pressure</span>
                  </div>
                  {trends && (
                    <span className={getTrendColor(trends.systolic, true)}>
                      {getTrendIcon(trends.systolic)}
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.avgSystolic}/{stats.avgDiastolic}
                </div>
                <p className="text-sm text-gray-600">mmHg</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-700">Avg Heart Rate</span>
                  </div>
                  {trends && (
                    <span className={getTrendColor(trends.heartRate)}>
                      {getTrendIcon(trends.heartRate)}
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avgHeartRate}</div>
                <p className="text-sm text-gray-600">bpm</p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Averages */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Average Values</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Temperature</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{stats.avgTemperature}°F</div>
                      {trends && (
                        <div className={`text-sm ${getTrendColor(trends.temperature)}`}>
                          {trends.temperature > 0 ? '+' : ''}{trends.temperature.toFixed(1)}°F
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">O2 Saturation</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{stats.avgOxygenSat}%</div>
                      {trends && (
                        <div className={`text-sm ${getTrendColor(trends.oxygenSat)}`}>
                          {trends.oxygenSat > 0 ? '+' : ''}{trends.oxygenSat.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Records */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Records</h2>
                <div className="space-y-3">
                  {filteredRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">{record.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">
                          {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
                        </div>
                        <div className="text-sm text-gray-600">{record.heartRate} bpm</div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredRecords.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No records in selected time range</p>
                  )}
                </div>
              </div>
            </div>

            {/* Health Insights */}
            {stats.recordCount > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Blood Pressure Status</h3>
                    <p className="text-blue-800">
                      {stats.avgSystolic < 120 && stats.avgDiastolic < 80 && 'Your average blood pressure is in the normal range.'}
                      {stats.avgSystolic >= 120 && stats.avgSystolic < 130 && stats.avgDiastolic < 80 && 'Your average blood pressure is elevated.'}
                      {(stats.avgSystolic >= 130 || stats.avgDiastolic >= 80) && 'Your average blood pressure indicates hypertension. Consult your healthcare provider.'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Heart Rate Analysis</h3>
                    <p className="text-green-800">
                      {stats.avgHeartRate >= 60 && stats.avgHeartRate <= 100 && 'Your average heart rate is within the normal resting range.'}
                      {stats.avgHeartRate < 60 && 'Your average heart rate is below normal. This could be normal for athletes or may require medical attention.'}
                      {stats.avgHeartRate > 100 && 'Your average heart rate is elevated. Consider consulting with a healthcare provider.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthStats;