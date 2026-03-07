export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-sky-400">AquaFlow AI Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm text-slate-400 mb-1">Total Consumption</h3>
          <p className="text-3xl font-bold text-sky-400">2,850L</p>
          <span className="text-sm text-emerald-400">+5.2% from yesterday</span>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm text-slate-400 mb-1">Active Alerts</h3>
          <p className="text-3xl font-bold text-orange-400">2</p>
          <span className="text-sm text-slate-500">Requires attention</span>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm text-slate-400 mb-1">Avg Consumption</h3>
          <p className="text-3xl font-bold text-emerald-400">28.5L/hr</p>
          <span className="text-sm text-slate-500">Within normal range</span>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm text-slate-400 mb-1">System Status</h3>
          <p className="text-3xl font-bold text-emerald-400">Normal</p>
          <span className="text-sm text-slate-500">All systems operational</span>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded">
              <div>
                <p className="font-medium">Flat A-101</p>
                <p className="text-sm text-slate-400">Consumption spike detected</p>
              </div>
              <span className="text-orange-400 text-sm">10:30 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded">
              <div>
                <p className="font-medium">Flat B-203</p>
                <p className="text-sm text-slate-400">Night leak suspected</p>
              </div>
              <span className="text-red-400 text-sm">3:15 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded">
              <div>
                <p className="font-medium">Building Total</p>
                <p className="text-sm text-slate-400">Daily report generated</p>
              </div>
              <span className="text-slate-400 text-sm">Yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-400">Total Flats</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Monitored</p>
              <p className="text-2xl font-bold text-emerald-400">24</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Anomalies</p>
              <p className="text-2xl font-bold text-orange-400">2</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Efficiency</p>
              <p className="text-2xl font-bold text-sky-400">94%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
