'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  const [consumption, setConsumption] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      { flatId: 'A-101', consumption: 45, baseline: 50, status: 'normal', hourly: [12, 15, 45, 30, 20] },
      { flatId: 'A-102', consumption: 145, baseline: 50, status: 'warning', hourly: [40, 60, 145, 120, 110] },
      { flatId: 'A-103', consumption: 320, baseline: 50, status: 'critical', hourly: [100, 200, 320, 310, 300] },
      { flatId: 'A-104', consumption: 48, baseline: 50, status: 'normal', hourly: [40, 42, 48, 45, 43] },
      { flatId: 'A-105', consumption: 155, baseline: 50, status: 'warning', hourly: [50, 90, 155, 140, 130] },
    ];
    setTimeout(() => {
      setConsumption(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 min-h-screen p-6 text-white hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">💧</span>
          <h1 className="text-xl font-bold tracking-tight text-white">AquaFlow AI</h1>
        </div>
        <nav className="space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
            <span>🏠</span> Home
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/20">
            <span>📊</span> Analytics
          </Link>
          <Link href="/leaks" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
            <span>⚠️</span> Leak Reports
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
            <span>⚙️</span> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Advanced Analytics</h2>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">Harri Krishnaa</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Admin Account</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border-2 border-white shadow-sm">HK</div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Main Chart Simulation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Consumption Trends</h3>
                <p className="text-sm text-slate-400">Total volume across all monitored nodes (last 24h)</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Hourly</button>
                <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition-colors">Daily</button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-slate-100 pb-2">
              {[45, 60, 35, 80, 55, 90, 110, 85, 45, 30, 25, 40].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-blue-100 group-hover:bg-blue-600 transition-all duration-500 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} L/hr
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>00:00</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Leak Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6">Incident Summary</h3>
               <div className="space-y-4">
                  {consumption.filter(i => i.status !== 'normal').map(item => (
                    <div key={item.flatId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          {item.status === 'critical' ? '⚡' : '💧'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.flatId}</p>
                          <p className="text-xs text-slate-400">{item.status === 'critical' ? 'Burst Pipe Potential' : 'Ongoing Slow Leak'}</p>
                        </div>
                      </div>
                      <Link href={`/leaks/${item.flatId}`} className="text-xs font-bold text-blue-600 hover:underline">Details →</Link>
                    </div>
                  ))}
               </div>
            </div>

            {/* Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6">Efficiency Distribution</h3>
               <div className="relative h-48 flex items-center justify-center">
                  {/* Mock Donut Chart UI */}
                  <div className="w-32 h-32 rounded-full border-[12px] border-slate-100 relative">
                     <div className="absolute inset-0 border-[12px] border-blue-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-800">82%</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Efficient</span>
                     </div>
                  </div>
                  <div className="ml-12 space-y-3">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Within Baseline</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Warning Level</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Anomalous</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
