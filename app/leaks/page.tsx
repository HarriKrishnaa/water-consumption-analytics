'use client';

import { useState, useEffect } from 'react';

interface Alert {
  flatId: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  avgNightFlow?: number;
  threshold?: number;
  currentUsage?: number;
  baseline?: number;
  multiplier?: number;
  duration?: number;
  nightCount?: number;
  description: string;
  timestamp: string;
}

export default function LeaksPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockAlerts: Alert[] = [
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
  }, []);

  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'HIGH': return 'border-red-500 bg-red-50';
      case 'MEDIUM': return 'border-yellow-500 bg-yellow-50';
      case 'LOW': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ 
            background: 'linear-gradient(to right, #667eea, #764ba2)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚠️ Water Leak Alerts
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Real-Time Leak Detection & Anomaly Monitoring | DynamoDB + Timestream Integration
          </p>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-lg p-4 text-white" style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)' }}>
              <div className="text-3xl font-bold">{alerts.length}</div>
              <div className="text-sm opacity-90">Active Alerts</div>
            </div>
            <div className="rounded-lg p-4 text-white" style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)' }}>
              <div className="text-3xl font-bold">2</div>
              <div className="text-sm opacity-90">High Priority</div>
            </div>
            <div className="rounded-lg p-4 text-white" style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}>
              <div className="text-3xl font-bold">847</div>
              <div className="text-sm opacity-90">Monitored Flats</div>
            </div>
            <div className="rounded-lg p-4 text-white" style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}>
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
            <a href="/leaks" className="px-4 py-2 rounded-lg text-white transition" style={{ background: '#667eea' }}>
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
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#667eea' }}></div>
            <p className="mt-4 text-gray-600">Loading leak alerts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-xl p-6 border-l-4 ${getSeverityClass(alert.severity)} transition hover:shadow-2xl`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700">
                        {alert.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {alert.flatId}
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                      {alert.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>🕒 {new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.avgNightFlow && <span>💧 Nighttime: {alert.avgNightFlow} L</span>}
                      {alert.currentUsage && <span>📊 Current: {alert.currentUsage} L/hr</span>}
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 text-white rounded-lg transition" style={{ background: '#667eea' }} onMouseEnter={e => e.currentTarget.style.background = '#5568d3'} onMouseLeave={e => e.currentTarget.style.background = '#667eea'}>
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
            {[
              { name: 'DynamoDB', desc: 'Alert Storage', color: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' },
              { name: 'Timestream', desc: 'Time-Series Query', color: 'linear-gradient(to bottom right, #a855f7, #9333ea)' },
              { name: 'Lambda', desc: '3AM Leak Detector', color: 'linear-gradient(to bottom right, #ec4899, #db2777)' },
              { name: 'SES', desc: 'Email Notifications', color: 'linear-gradient(to bottom right, #6366f1, #4f46e5)' }
            ].map((service, i) => (
              <div key={i} className="rounded-lg p-4 text-white text-center" style={{ background: service.color }}>
                <div className="font-bold">{service.name}</div>
                <div className="text-xs opacity-90">{service.desc}</div>
              </div>
            ))}
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
