'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const [consumption, setConsumption] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data for demo
    const mockData = [
      { flatId: 'A-101', consumption: 45, baseline: 50, status: 'normal' },
      { flatId: 'A-102', consumption: 145, baseline: 50, status: 'warning' },
      { flatId: 'A-103', consumption: 320, baseline: 50, status: 'critical' },
      { flatId: 'A-104', consumption: 48, baseline: 50, status: 'normal' },
      { flatId: 'A-105', consumption: 155, baseline: 50, status: 'warning' },
    ];
    setTimeout(() => {
      setConsumption(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">💧 Water Analytics</h1>
              <p className="text-gray-600 mt-1">Real-time Consumption & Leak Detection</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Dashboard
              </Link>
              <Link href="/leaks" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Leaks
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Water Consumption Analytics</h2>
          <p className="text-gray-600 mb-6">
            Monitor real-time water consumption across apartment flats, detect leaks instantly, and optimize water conservation efforts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-blue-900">Real-time Monitoring</h3>
              <p className="text-sm text-gray-600 mt-2">Hourly consumption tracking per flat</p>
            </div>
            <div className="bg-amber-50 p-4 rounded">
              <h3 className="font-bold text-amber-900">Leak Detection</h3>
              <p className="text-sm text-gray-600 mt-2">3x baseline and nighttime detection</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-bold text-green-900">Conservation</h3>
              <p className="text-sm text-gray-600 mt-2">Track monthly trends and billing</p>
            </div>
          </div>
        </section>

        {/* Consumption Grid */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Current Consumption Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consumption.map((item) => (
              <div key={item.flatId} className={`rounded-lg shadow-lg p-6 ${
                item.status === 'critical' ? 'bg-red-50 border-2 border-red-500' :
                item.status === 'warning' ? 'bg-yellow-50 border-2 border-yellow-500' :
                'bg-green-50 border-2 border-green-500'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{item.flatId}</h3>
                  <span className={`px-3 py-1 rounded-full text-white font-bold ${
                    item.status === 'critical' ? 'bg-red-600' :
                    item.status === 'warning' ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Current Consumption</p>
                    <p className="text-2xl font-bold text-gray-800">{item.consumption} L/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Daily Baseline</p>
                    <p className="text-lg font-semibold text-gray-700">{item.baseline} L/hr</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Usage</span>
                      <span>{Math.round((item.consumption / (item.baseline * 3)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === 'critical' ? 'bg-red-600' :
                          item.status === 'warning' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(100, (item.consumption / (item.baseline * 3)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
// Water consumption monitoring dashboard

export default HomePage;
