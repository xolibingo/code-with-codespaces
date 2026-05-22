import React, { useState } from 'react'
import { Download, ClipboardList } from 'lucide-react'
import { getAuditLogs } from '../../lib/storage'
import { format } from 'date-fns'

export default function AdminAuditLog() {
  const [logs] = useState(() => getAuditLogs())
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = logs.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.performedBy.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || l.targetType === typeFilter
    return matchSearch && matchType
  })

  function exportCSV() {
    const headers = ['Timestamp', 'Performed By', 'Action', 'Target Type', 'Target ID', 'Details']
    const rows = filtered.map(l => [
      l.timestamp, l.performedBy, l.action, l.targetType, l.targetId, l.details
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `bingo-audit-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const TYPE_COLORS: Record<string, string> = {
    user: 'text-blue-400', package: 'text-orange-400', invoice: 'text-green-400',
    truck: 'text-purple-400', tax_doc: 'text-yellow-400', settings: 'text-pink-400',
  }
  const th = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase'
  const cell = 'px-3 py-3 text-sm'

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <div className="flex gap-2 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 w-44" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white focus:outline-none focus:border-orange-500">
            <option value="all">All Types</option>
            {['user','package','invoice','truck','tax_doc','settings'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
          </select>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No audit entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#2d3348]">
                <tr><th className={th}>Timestamp</th><th className={th}>Performed By</th><th className={th}>Action</th><th className={th}>Type</th><th className={th}>Details</th></tr>
              </thead>
              <tbody className="divide-y divide-[#2d3348]">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-white/2">
                    <td className={`${cell} text-gray-500 text-xs font-mono whitespace-nowrap`}>{format(new Date(l.timestamp), 'dd MMM yy HH:mm:ss')}</td>
                    <td className={`${cell} text-orange-400 text-xs`}>{l.performedBy}</td>
                    <td className={`${cell} text-gray-200`}>{l.action}</td>
                    <td className={cell}><span className={`text-xs font-semibold ${TYPE_COLORS[l.targetType] ?? 'text-gray-400'}`}>{l.targetType.replace('_',' ')}</span></td>
                    <td className={`${cell} text-gray-500 text-xs max-w-xs truncate`}>{l.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
