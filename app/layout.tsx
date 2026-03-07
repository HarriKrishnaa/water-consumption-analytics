import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Activity, Droplets, AlertTriangle, BarChart3 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AquaFlow AI - Water Consumption Analytics',
  description: 'Real-time water consumption monitoring and leak detection for apartment buildings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex bg-slate-950 text-slate-100">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Droplets className="w-8 h-8 text-sky-400" />
                <div>
                  <h1 className="text-xl font-bold text-sky-400">AquaFlow AI</h1>
                  <p className="text-xs text-slate-400">Water Analytics</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <Activity className="w-5 h-5 text-slate-400 group-hover:text-sky-400" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              <Link
                href="/leak-alerts"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <AlertTriangle className="w-5 h-5 text-slate-400 group-hover:text-orange-400" />
                <span className="text-sm font-medium">Leak Alerts</span>
              </Link>

              <Link
                href="/deep-analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                <span className="text-sm font-medium">Deep Analytics</span>
              </Link>            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="text-xs text-slate-500">
                <p>© 2026 AquaFlow AI</p>
                <p className="mt-1">Powered by AWS</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
