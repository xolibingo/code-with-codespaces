import React, { useState } from 'react'
import { Truck, CheckCircle, Clock, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getTrucks, getTruckRequests, saveTruckRequest } from '../../lib/storage'
import { getSettings } from '../../lib/storage'
import { TruckRequest } from '../../types'
import { COUNTRY_NAMES } from '../../lib/courier'

const STATUS_COLORS: Record<string, string> = { pending: 'badge-yellow', approved: 'badge-green', rejected: 'badge-red' }

export default function RequestTruck() {
  const { user } = useAuth()
  const settings = getSettings()
  const [showForm, setShowForm] = useState(false)
  const [requests, setRequests] = useState<TruckRequest[]>(() => getTruckRequests().filter(r => r.userId === user?.id))
  const trucks = getTrucks()
  const availableTrucks = trucks.filter(t => t.status === 'available')
  const [form, setForm] = useState({ truckId: availableTrucks[0]?.id || '', origin: 'ZA', destination: 'ZW', startDate: '', endDate: '' })

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  const days = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
    : 0
  const totalPrice = days * settings.truckRentalPerDay

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const req: TruckRequest = {
      id: crypto.randomUUID(),
      userId: user!.id,
      truckId: form.truckId,
      startDate: form.startDate,
      endDate: form.endDate,
      origin: form.origin,
      destination: form.destination,
      status: 'pending',
      totalPrice,
      createdAt: new Date().toISOString(),
    }
    saveTruckRequest(req)
    setRequests(getTruckRequests().filter(r => r.userId === user?.id))
    setShowForm(false)
  }

  const countries = Object.entries(COUNTRY_NAMES)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Request a Truck</h1>
        <button onClick={() => setShowForm(true)} disabled={availableTrucks.length === 0} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
          <Truck className="w-4 h-4"/> Request Truck
        </button>
      </div>

      {/* Fleet overview */}
      <div className="grid grid-cols-3 gap-4">
        {['available', 'on_route', 'maintenance'].map(status => (
          <div key={status} className="card text-center">
            <div className={`text-2xl font-bold mb-1 ${status === 'available' ? 'text-green-600' : status === 'on_route' ? 'text-blue-600' : 'text-gray-400'}`}>
              {trucks.filter(t => t.status === status).length}
            </div>
            <div className="text-sm text-gray-500 capitalize">{status.replace('_', ' ')}</div>
          </div>
        ))}
      </div>

      {/* Request form */}
      {showForm && (
        <div className="card border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">New Truck Request</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400"/></button>
          </div>
          {availableTrucks.length === 0 ? (
            <p className="text-gray-500">No trucks currently available. Please try again later.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Select Truck</label>
                <select className="input" value={form.truckId} onChange={e => update('truckId', e.target.value)} required>
                  {availableTrucks.map(t => (
                    <option key={t.id} value={t.id}>{t.plate} — {t.capacity} (Driver: {t.driver})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Origin</label>
                  <select className="input" value={form.origin} onChange={e => update('origin', e.target.value)}>
                    {countries.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Destination</label>
                  <select className="input" value={form.destination} onChange={e => update('destination', e.target.value)}>
                    {countries.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input" value={form.startDate} onChange={e => update('startDate', e.target.value)} min={new Date().toISOString().split('T')[0]} required/>
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input" value={form.endDate} onChange={e => update('endDate', e.target.value)} min={form.startDate} required/>
                </div>
              </div>
              {days > 0 && (
                <div className="bg-orange-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Duration</span><span>{days} day{days !== 1 ? 's' : ''}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Rate</span><span>R{settings.truckRentalPerDay.toLocaleString()}/day</span></div>
                  <div className="flex justify-between font-bold text-orange-700 border-t border-orange-200 mt-2 pt-2"><span>Total</span><span>R{totalPrice.toLocaleString()}</span></div>
                </div>
              )}
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Submit Request</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Past requests */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4">My Truck Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Truck className="w-12 h-12 mx-auto mb-2 opacity-40"/>
            <p>No truck requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(r => {
              const truck = trucks.find(t => t.id === r.truckId)
              return (
                <div key={r.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-medium text-gray-900">{truck?.plate || r.truckId} — {r.origin} → {r.destination}</div>
                    <div className="text-sm text-gray-500">{r.startDate} to {r.endDate} · R{r.totalPrice.toLocaleString()}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
