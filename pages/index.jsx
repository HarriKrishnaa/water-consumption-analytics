'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
  const [consumption, setConsumption] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      { flatId: 'A-101', consumption: 45, baseline: 50, status: 'normal', trend: [30, 45, 40, 50, 45] },
      { flatId: 'A-102', consumption: 145, baseline: 50, status: 'warning', trend: [40, 60, 100, 130, 145] },
      { flatId: 'A-103', consumption: 320, baseline: 50, status: 'critical', trend: [50, 150, 250, 300, 320] },
      { flatId: 'A-104', consumption: 48, baseline: 50, status: 'normal', trend: [40, 45, 42, 47, 48] },
      { flatId: 'A-105', consumption: 155, baseline: 50, status: 'warning', trend: [45, 80, 120, 140, 155] },
    ];
    setTimeout(() => {
      setConsumption(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-blue-600">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const stats = {
    total: consumption.reduce((acc, curr) => acc + curr.consumption, 0),
    leaks: consumption.filter(i => i.status !== 'normal').length,
    avg: Math.round(consumption.reduce((acc, curr) => acc + curr.consumption, 0) / consumption.length)
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Overlay for Mobile */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 min-h-screen hidden lg:block p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <span className="text-3xl">💧</span>
            <h1 className="text-xl font-bold text-white tracking-tight">AquaFlow AI</h1>
          </div>
          <nav className="space-y-1">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20">
              <span className="text-lg">📊</span> Dashboard
            </Link>
            <Link href="/leaks" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all group">
              <span className="text-lg group-hover:scale-110 transition-transform">⚠️</span> Leak Alerts
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all group">
              <span className="text-lg group-hover:scale-110 transition-transform">📈</span> Deep Analytics
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Overview</h2>
              <h1 className="text-2xl font-bold text-slate-800">Operational Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Live
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">🔔</button>
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold">HK</div>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">🌊</div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12% vs last hr</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Total Consumption</p>
                <h3 className="text-3xl font-black text-slate-800">{stats.total} <span className="text-lg font-medium text-slate-400">L/hr</span></h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl">🚨</div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Action Required</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Active Anomalies</p>
                <h3 className="text-3xl font-black text-slate-800">{stats.leaks} <span className="text-lg font-medium text-slate-400">Units</span></h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">📊</div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded">Stable Baseline</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Average Consumption</p>
                <h3 className="text-3xl font-black text-slate-800">{stats.avg} <span className="text-lg font-medium text-slate-400">L/hr</span></h3>
              </div>
            </div>

            {/* Consumption Grid */}
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              Unit Monitoring <span className="text-sm font-normal text-slate-400">Real-time telemetry</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consumption.map((item) => (
                <div key={item.flatId} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className={`h-1.5 w-full ${
                    item.status === 'critical' ? 'bg-red-500' : 
                    item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{item.flatId}</h3>
                        <p className="text-xs text-slate-400 font-medium">Device ID: {item.flatId.toLowerCase()}-node</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'critical' ? 'bg-red-100 text-red-600' : 
                        item.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Live Usage</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-800 tracking-tight">{item.consumption}</span>
                            <span className="text-slate-400 text-sm font-bold uppercase">L/hr</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Baseline</p>
                          <p className="text-sm font-bold text-slate-600">{item.baseline} L/hr</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tighter">
                          <span>Capacity Utilization</span>
                          <span className={item.consumption > item.baseline ? 'text-red-500' : 'text-slate-600'}>
                            {Math.round((item.consumption / item.baseline) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              item.status === 'critical' ? 'bg-red-500' : 
                              item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.consumption / (item.baseline * 2.5)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full mt-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 transition-colors">
                        View Detailed Log
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
