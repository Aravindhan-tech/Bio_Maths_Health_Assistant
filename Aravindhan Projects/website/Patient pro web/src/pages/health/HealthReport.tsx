import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Printer, Share } from 'lucide-react';

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

const HealthReports: React.FC = () => {
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'trends'>('summary');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    const savedRecords = localStorage.getItem('vitalRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const filterRecordsByDateRange = (records: VitalRecord[], range: string) => {
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

  const filteredRecords = filterRecordsByDateRange(records, dateRange);

  const generateSummaryStats = () => {
    if (filteredRecords.length === 0) return null;

    const totals = filteredRecords.reduce((acc, record) => ({
      systolic: acc.systolic + record.bloodPressure.systolic,
      diastolic: acc.diastolic + record.bloodPressure.diastolic,
      heartRate: acc.heartRate + record.heartRate,
      temperature: acc.temperature + record.temperature,
      oxygenSat: acc.oxygenSat + record.oxygenSaturation
    }), { systolic: 0, diastolic: 0, heartRate: 0, temperature: 0, oxygenSat: 0 });

    const count = filteredRecords.length;
    
    const ranges = {
      systolic: { min: Math.min(...filteredRecords.map(r => r.bloodPressure.systolic)), max: Math.max(...filteredRecords.map(r => r.bloodPressure.systolic)) },
      diastolic: { min: Math.min(...filteredRecords.map(r => r.bloodPressure.diastolic)), max: Math.max(...filteredRecords.map(r => r.bloodPressure.diastolic)) },
      heartRate: { min: Math.min(...filteredRecords.map(r => r.heartRate)), max: Math.max(...filteredRecords.map(r => r.heartRate)) },
      temperature: { min: Math.min(...filteredRecords.map(r => r.temperature)), max: Math.max(...filteredRecords.map(r => r.temperature)) },
      oxygenSat: { min: Math.min(...filteredRecords.map(r => r.oxygenSaturation)), max: Math.max(...filteredRecords.map(r => r.oxygenSaturation)) }
    };

    return {
      averages: {
        systolic: Math.round(totals.systolic / count),
        diastolic: Math.round(totals.diastolic / count),
        heartRate: Math.round(totals.heartRate / count),
        temperature: Math.round((totals.temperature / count) * 10) / 10,
        oxygenSat: Math.round(totals.oxygenSat / count)
      },
      ranges,
      count
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    const stats = generateSummaryStats();
    const dateStr = new Date().toLocaleDateString();
    
    let content = `HEALTH REPORT\n`;
    content += `Generated on: ${dateStr}\n`;
    content += `Time Period: ${dateRange === 'all' ? 'All Time' : dateRange}\n`;
    content += `Total Records: ${filteredRecords.length}\n\n`;

    if (stats) {
      content += `SUMMARY STATISTICS\n`;
      content += `Average Blood Pressure: ${stats.averages.systolic}/${stats.averages.diastolic} mmHg\n`;
      content += `Average Heart Rate: ${stats.averages.heartRate} bpm\n`;
      content += `Average Temperature: ${stats.averages.temperature}°F\n`;
      content += `Average O2 Saturation: ${stats.averages.oxygenSat}%\n\n`;

      content += `RANGES\n`;
      content += `Blood Pressure: ${stats.ranges.systolic.min}-${stats.ranges.systolic.max}/${stats.ranges.diastolic.min}-${stats.ranges.diastolic.max} mmHg\n`;
      content += `Heart Rate: ${stats.ranges.heartRate.min}-${stats.ranges.heartRate.max} bpm\n`;
      content += `Temperature: ${stats.ranges.temperature.min}-${stats.ranges.temperature.max}°F\n`;
      content += `O2 Saturation: ${stats.ranges.oxygenSat.min}-${stats.ranges.oxygenSat.max}%\n\n`;
    }

    if (reportType === 'detailed') {
      content += `DETAILED RECORDS\n`;
      filteredRecords.forEach(record => {
        content += `Date: ${record.date} ${record.time}\n`;
        content += `Blood Pressure: ${record.bloodPressure.systolic}/${record.bloodPressure.diastolic} mmHg\n`;
        content += `Heart Rate: ${record.heartRate} bpm\n`;
        content += `Temperature: ${record.temperature}°F\n`;
        content += `O2 Saturation: ${record.oxygenSaturation}%\n`;
        if (record.notes) content += `Notes: ${record.notes}\n`;
        content += `\n`;
      });
    }

    return content;
  };

  const stats = generateSummaryStats();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Health Reports</h1>
          <p className="text-lg text-gray-600">Generate comprehensive health reports</p>
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="trends">Trends Analysis</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handlePrint}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 print:shadow-none print:rounded-none">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No data available for report generation</p>
              <p className="text-gray-400">Start tracking your vital signs to generate reports</p>
            </div>
          ) : (
            <>
              {/* Report Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Report</h2>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Generated on {new Date().toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>Period: {dateRange === 'all' ? 'All Time' : dateRange}</span>
                  <span className="mx-2">•</span>
                  <span>Records: {filteredRecords.length}</span>
                </div>
              </div>

              {/* Summary Statistics */}
              {stats && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-red-800">Average Blood Pressure</div>
                      <div className="text-2xl font-bold text-red-900">
                        {stats.averages.systolic}/{stats.averages.diastolic}
                      </div>
                      <div className="text-sm text-red-600">mmHg</div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Average Heart Rate</div>
                      <div className="text-2xl font-bold text-blue-900">{stats.averages.heartRate}</div>
                      <div className="text-sm text-blue-600">bpm</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-orange-800">Average Temperature</div>
                      <div className="text-2xl font-bold text-orange-900">{stats.averages.temperature}</div>
                      <div className="text-sm text-orange-600">°F</div>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-teal-800">Average O2 Saturation</div>
                      <div className="text-2xl font-bold text-teal-900">{stats.averages.oxygenSat}</div>
                      <div className="text-sm text-teal-600">%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ranges */}
              {stats && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Value Ranges</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-700">Vital Sign</th>
                          <th className="text-left py-2 font-medium text-gray-700">Minimum</th>
                          <th className="text-left py-2 font-medium text-gray-700">Maximum</th>
                          <th className="text-left py-2 font-medium text-gray-700">Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Systolic BP (mmHg)</td>
                          <td className="py-2">{stats.ranges.systolic.min}</td>
                          <td className="py-2">{stats.ranges.systolic.max}</td>
                          <td className="py-2">{stats.averages.systolic}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Diastolic BP (mmHg)</td>
                          <td className="py-2">{stats.ranges.diastolic.min}</td>
                          <td className="py-2">{stats.ranges.diastolic.max}</td>
                          <td className="py-2">{stats.averages.diastolic}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Heart Rate (bpm)</td>
                          <td className="py-2">{stats.ranges.heartRate.min}</td>
                          <td className="py-2">{stats.ranges.heartRate.max}</td>
                          <td className="py-2">{stats.averages.heartRate}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Temperature (°F)</td>
                          <td className="py-2">{stats.ranges.temperature.min}</td>
                          <td className="py-2">{stats.ranges.temperature.max}</td>
                          <td className="py-2">{stats.averages.temperature}</td>
                        </tr>
                        <tr>
                          <td className="py-2">O2 Saturation (%)</td>
                          <td className="py-2">{stats.ranges.oxygenSat.min}</td>
                          <td className="py-2">{stats.ranges.oxygenSat.max}</td>
                          <td className="py-2">{stats.averages.oxygenSat}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Detailed Records */}
              {reportType === 'detailed' && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Records</h3>
                  <div className="space-y-4">
                    {filteredRecords.slice(0, 10).map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString()} at {record.time}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">BP:</span> {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
                          </div>
                          <div>
                            <span className="text-gray-600">HR:</span> {record.heartRate} bpm
                          </div>
                          <div>
                            <span className="text-gray-600">Temp:</span> {record.temperature}°F
                          </div>
                          <div>
                            <span className="text-gray-600">O2:</span> {record.oxygenSaturation}%
                          </div>
                        </div>
                        {record.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Notes:</strong> {record.notes}
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredRecords.length > 10 && (
                      <p className="text-gray-500 text-sm">
                        Showing first 10 records. Download full report to see all {filteredRecords.length} records.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Health Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Health Insights</h3>
                <div className="text-blue-800 space-y-2">
                  {stats && (
                    <>
                      {stats.averages.systolic >= 130 || stats.averages.diastolic >= 80 ? (
                        <p>• Your average blood pressure indicates hypertension. Consider consulting with a healthcare provider.</p>
                      ) : (
                        <p>• Your average blood pressure is within a healthy range.</p>
                      )}
                      
                      {stats.averages.heartRate > 100 ? (
                        <p>• Your average heart rate is elevated. This may warrant medical evaluation.</p>
                      ) : stats.averages.heartRate < 60 ? (
                        <p>• Your average heart rate is below normal. This could be normal for athletes or may require attention.</p>
                      ) : (
                        <p>• Your average heart rate is within the normal resting range.</p>
                      )}
                      
                      <p>• Continue regular monitoring and maintain healthy lifestyle habits.</p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthReports;