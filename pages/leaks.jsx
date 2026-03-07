import Head from 'next/head';
import { useState, useEffect } from 'react';
import '../styles/globals.css';

export default function LeakAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated leak alerts data (replace with actual API call)
    const fetchAlerts = async () => {
      const mockAlerts = [
        {
          flatId: 'A-101',
          type: '3AM_LEAK',
          severity: 'HIGH',
          avgNightFlow: 67.3,
          threshold: 50,
          description: '3AM leak detected - Average nighttime flow 67.3 L (Threshold: 50 L) | Last 7 nights avg',
          timestamp: new Date().toISOString()
        },
        {
          flatId: 'B-204',
          type: 'SPIKE',
          severity: 'HIGH',
          currentUsage: 650,
          baseline: 200,
          multiplier: 3.2,
          description: 'Usage spike - 650 L in last hour (3.2x baseline of 200 L/hour)',
          timestamp: new Date().toISOString()
        },
        {
          flatId: 'Common Area - Terrace',
          type: 'CONTINUOUS_FLOW',
          severity: 'MEDIUM',
          duration: 14,
          description: 'Continuous flow detected for 14 hours (Possible tank overflow)',
          timestamp: new Date().toISOString()
        },
        {
          flatId: 'C-305',
          type: 'PERSISTENT_LEAK',
          severity: 'MEDIUM',
          nightCount: 5,
          description: 'Persistent leak - Nighttime consumption pattern for 5 consecutive nights',
          timestamp: new Date().toISOString()
        }
      ];
      setAlerts(mockAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'HIGH': return 'bg-red-100 border-red-500 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'LOW': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <Head>
        <title>Leak Alerts - Water Consumption Analytics</title>
        <meta name="description" content="Real-time water leak detection and alerting system" />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            ⚠️ Water Leak Alerts
          </h1>
          <p className="text-gray-600 text-lg">
            Real-Time Leak Detection & Anomaly Monitoring | DynamoDB + Timestream Integration
          </p>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
              <div className="text-3xl font-bold">{alerts.length}</div>
              <div className="text-sm opacity-90">Active Alerts</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
              <div className="text-3xl font-bold">2</div>
              <div className="text-sm opacity-90">High Priority</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
              <div className="text-3xl font-bold">847</div>
              <div className="text-sm opacity-90">Monitored Flats</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
              <div className="text-3xl font-bold">3.2M L</div>
              <div className="text-sm opacity-90">Water Saved</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-8">
          <nav className="flex space-x-4">
            <a href="/" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              📊 Dashboard
            </a>
            <a href="/leaks" className="px-4 py-2 rounded-lg bg-indigo-600 text-white transition">
              ⚠️ Leak Alerts
            </a>
            <a href="/analytics" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              📈 Deep Analytics
            </a>
          </nav>
        </div>

        {/* Alerts List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leak alerts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl shadow-xl p-6 border-l-4 ${getSeverityColor(alert.severity)} transition hover:shadow-2xl`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        alert.severity === 'HIGH' ? 'bg-red-500' :
                        alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                      } text-white`}>
                        {alert.severity}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                        {alert.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {alert.flatId}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {alert.description}
                    </p>
                    <div className="mt-4 flex space-x-4 text-sm text-gray-500">
                      <span>🕒 {new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.avgNightFlow && (
                        <span>💧 Nighttime: {alert.avgNightFlow} L</span>
                      )}
                      {alert.currentUsage && (
                        <span>📊 Current: {alert.currentUsage} L/hr</span>
                      )}
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AWS Integration Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ AWS Backend Integration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
              <div className="font-bold">DynamoDB</div>
              <div className="text-xs opacity-90">Alert Storage</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
              <div className="font-bold">Timestream</div>
              <div className="text-xs opacity-90">Time-Series Query</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-4 text-center">
              <div className="font-bold">Lambda</div>
              <div className="text-xs opacity-90">3AM Leak Detector</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-4 text-center">
              <div className="font-bold">SES</div>
              <div className="text-xs opacity-90">Email Notifications</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white">
          <p className="text-sm opacity-90">
            © 2026 Smart Water Management | AWS Account: 462633925085 | Region: us-east-1
          </p>
          <p className="text-xs opacity-75 mt-2">
            Powered by Next.js + Tailwind CSS | Deployed on Vercel
          </p>
        </div>
      </div>
    </div>
  );
}
