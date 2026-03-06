'use client';
import React from 'react';
import Link from 'next/link';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 min-h-screen p-6 text-white hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">💧</span>
          <h1 className="text-xl font-bold tracking-tight">AquaFlow AI</h1>
        </div>
        <nav className="space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
            <span>🏠</span> Home
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
            <span>📊</span> Analytics
          </Link>
          <Link href="/leaks" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
            <span>⚠️</span> Leak Reports
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/20 font-bold">
            <span>📈</span> Deep Insights
          </Link>
        </nav>
      </aside>

      <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
         <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm">📈</div>
         <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Advanced Analytics Engine</h1>
         <p className="text-slate-500 max-w-md mb-8 leading-relaxed">Our AI models are currently processing 40TB of historical consumption data to generate your personalized efficiency reports.</p>
         <div className="flex gap-4">
            <Link href="/dashboard" className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all">Return to Dashboard</Link>
            <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-white transition-all">View API Docs</button>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
