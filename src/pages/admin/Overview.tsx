import React from 'react'
import { Users, Package, FileText, Truck, TrendingUp, AlertTriangle } from 'lucide-react'
import { getUsers, getPackages, getInvoices, getTrucks, getAuditLogs } from '../../lib/storage'
import { format } from 'date-fns'

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType, label: string, value: string | number, sub?: string, color: string }) {
  return (
    <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}

export default function AdminOverview() {
  const users = getUsers()
  const packages = getPackages()
  const invoices = getInvoices()
  const trucks = getTrucks()
  const logs = getAuditLogs().slice(0, 8)

  const revenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const pending = packages.filter(p => p.status === 'pending').length
  const trucksOnRoute = trucks.filter(t => t.status === 'on_route').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Live system metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}    label="Total Clients" value={users.filter(u => u.role === 'client').length} color="bg-blue-600" />
        <StatCard icon={Package}  label="All Packages"  value={packages.length}  sub={`${pending} pending`}    color="bg-orange-600" />
        <StatCard icon={FileText} label="Revenue (ZAR)" value={`R${revenue.toLocaleString()}`} sub="paid invoices" color="bg-green-700" />
        <StatCard icon={Truck}    label="Trucks Active" value={trucksOnRoute} sub={`${trucks.length} total`} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400" /> Package Status</h2>
          {(['pending','in_transit','delivered','cancelled'] as const).map(s => {
            const count = packages.filter(p => p.status === s).length
            const pct = packages.length ? (count / packages.length) * 100 : 0
            const colors: Record<string, string> = { pending: 'bg-yellow-500', in_transit: 'bg-blue-500', delivered: 'bg-green-500', cancelled: 'bg-red-500' }
            return (
              <div key={s} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 capitalize">{s.replace('_', ' ')}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="h-1.5 bg-[#0f1117] rounded-full overflow-hidden">
                  <div className={`h-full ${colors[s]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-400" /> Recent Activity</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet</p>
          ) : (
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="text-xs border-l-2 border-orange-600/40 pl-3 py-1">
                  <div className="text-gray-300">{log.action}</div>
                  <div className="text-gray-500">{log.performedBy} · {format(new Date(log.timestamp), 'dd MMM, HH:mm')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
