import React, { useState } from 'react'
import { getPackages, updatePackage, getUsers } from '../../lib/storage'
import { addAuditLog } from '../../lib/storage'
import { useAuth } from '../../contexts/AuthContext'
import { Package as PkgType, PackageStatus } from '../../types'
import { COUNTRY_NAMES } from '../../lib/courier'
import { format } from 'date-fns'

const STATUS_OPTS: PackageStatus[] = ['pending', 'in_transit', 'delivered', 'cancelled']
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-900/40 text-yellow-400',
  in_transit: 'bg-blue-900/40 text-blue-400',
  delivered: 'bg-green-900/40 text-green-400',
  cancelled: 'bg-red-900/40 text-red-400',
}

export default function AdminPackages() {
  const { user: adminUser } = useAuth()
  const [packages, setPackages] = useState(() => getPackages())
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const users = getUsers()

  function getUserEmail(id: string) { return users.find(u => u.id === id)?.email ?? id }

  function handleStatus(pkg: PkgType, status: PackageStatus) {
    const updated = { ...pkg, status, updatedAt: new Date().toISOString() }
    updatePackage(updated)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Package ${pkg.trackingNumber} → ${status}`, targetType: 'package', targetId: pkg.id, details: '' })
    setPackages(getPackages())
  }

  const filtered = packages.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = p.trackingNumber.toLowerCase().includes(search.toLowerCase()) || getUserEmail(p.userId).toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const th = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase'
  const cell = 'px-3 py-3 text-sm'

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Packages</h1>
        <div className="flex gap-2 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 w-44" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white focus:outline-none focus:border-orange-500">
            <option value="all">All Status</option>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#2d3348]">
              <tr>
                <th className={th}>Tracking #</th>
                <th className={th}>Client</th>
                <th className={th}>Route</th>
                <th className={th}>Weight</th>
                <th className={th}>Price</th>
                <th className={th}>Status</th>
                <th className={th}>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3348]">
              {filtered.map(pkg => (
                <tr key={pkg.id} className="hover:bg-white/2">
                  <td className={cell}><span className="font-mono text-orange-400 font-bold text-xs">{pkg.trackingNumber}</span></td>
                  <td className={`${cell} text-gray-300 text-xs`}>{getUserEmail(pkg.userId)}</td>
                  <td className={`${cell} text-gray-300`}>{COUNTRY_NAMES[pkg.origin] ?? pkg.origin} → {COUNTRY_NAMES[pkg.destination] ?? pkg.destination}</td>
                  <td className={`${cell} text-gray-300`}>{pkg.weight}kg</td>
                  <td className={`${cell} text-white font-semibold`}>R{pkg.price.toFixed(0)}</td>
                  <td className={cell}>
                    <select value={pkg.status} onChange={e => handleStatus(pkg, e.target.value as PackageStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[pkg.status]} bg-transparent`}>
                      {STATUS_OPTS.map(s => <option key={s} value={s} className="bg-[#1a1f2e] text-white">{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                  <td className={`${cell} text-gray-500 text-xs`}>{format(new Date(pkg.createdAt), 'dd MMM yy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No packages found</div>}
      </div>
    </div>
  )
}
