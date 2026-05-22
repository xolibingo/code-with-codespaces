import React, { useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { getTrucks, saveTruck, getTruckRequests, updateTruckRequest, getUsers } from '../../lib/storage'
import { addAuditLog } from '../../lib/storage'
import { useAuth } from '../../contexts/AuthContext'
import { Truck, TruckRequest } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-900/40 text-green-400',
  on_route: 'bg-blue-900/40 text-blue-400',
  maintenance: 'bg-gray-700 text-gray-400',
}

export default function AdminTrucks() {
  const { user: adminUser } = useAuth()
  const [trucks, setTrucks] = useState(() => getTrucks())
  const [requests, setRequests] = useState(() => getTruckRequests())
  const users = getUsers()

  function getUserEmail(id: string) { return users.find(u => u.id === id)?.email ?? id }
  function getTruckPlate(id: string) { return trucks.find(t => t.id === id)?.plate ?? id }

  function handleTruckStatus(truck: Truck, status: Truck['status']) {
    const updated = { ...truck, status }
    saveTruck(updated)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Truck ${truck.plate} → ${status}`, targetType: 'truck', targetId: truck.id, details: '' })
    setTrucks(getTrucks())
  }

  function handleRequest(req: TruckRequest, status: 'approved' | 'rejected') {
    const updated = { ...req, status }
    updateTruckRequest(updated)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Truck request ${status}`, targetType: 'truck', targetId: req.id, details: `User: ${getUserEmail(req.userId)}` })
    setRequests(getTruckRequests())
  }

  const th = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase'
  const cell = 'px-3 py-3 text-sm'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Trucks</h1>

      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#2d3348]">
          <h2 className="text-white font-semibold">Fleet</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#2d3348]">
              <tr><th className={th}>Plate</th><th className={th}>Capacity</th><th className={th}>Driver</th><th className={th}>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-[#2d3348]">
              {trucks.map(t => (
                <tr key={t.id} className="hover:bg-white/2">
                  <td className={`${cell} font-mono text-orange-400 font-bold`}>{t.plate}</td>
                  <td className={`${cell} text-gray-300`}>{t.capacity}</td>
                  <td className={`${cell} text-gray-300`}>{t.driver}</td>
                  <td className={cell}>
                    <select value={t.status} onChange={e => handleTruckStatus(t, e.target.value as Truck['status'])}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[t.status]} bg-transparent`}>
                      {(['available','on_route','maintenance'] as const).map(s => <option key={s} value={s} className="bg-[#1a1f2e] text-white">{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#2d3348]">
          <h2 className="text-white font-semibold">Truck Requests</h2>
        </div>
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No truck requests</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#2d3348]">
                <tr><th className={th}>Client</th><th className={th}>Truck</th><th className={th}>Dates</th><th className={th}>Route</th><th className={th}>Price</th><th className={th}>Status</th><th className={th}>Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#2d3348]">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-white/2">
                    <td className={`${cell} text-gray-300 text-xs`}>{getUserEmail(r.userId)}</td>
                    <td className={`${cell} font-mono text-orange-400 text-xs`}>{getTruckPlate(r.truckId)}</td>
                    <td className={`${cell} text-gray-400 text-xs`}>{r.startDate} → {r.endDate}</td>
                    <td className={`${cell} text-gray-300 text-xs`}>{r.origin} → {r.destination}</td>
                    <td className={`${cell} text-white font-semibold`}>R{r.totalPrice.toLocaleString()}</td>
                    <td className={cell}>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-green-900/40 text-green-400' : r.status === 'rejected' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'}`}>{r.status}</span>
                    </td>
                    <td className={cell}>
                      {r.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleRequest(r, 'approved')} className="p-1 text-green-400 hover:bg-green-900/20 rounded"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleRequest(r, 'rejected')} className="p-1 text-red-400 hover:bg-red-900/20 rounded"><XCircle className="w-4 h-4" /></button>
                        </div>
                      )}
                      {r.status !== 'pending' && <span className="text-gray-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Done</span>}
                    </td>
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
