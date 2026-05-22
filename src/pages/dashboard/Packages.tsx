import React, { useState } from 'react'
import { Package, Plus, X, Eye } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPackages, savePackage, saveInvoice } from '../../lib/storage'
import { Package as PkgType } from '../../types'
import { getRoutes, calculateRate, COUNTRY_NAMES, generateTrackingNumber, generateInvoiceNumber } from '../../lib/courier'
import { format } from 'date-fns'

const COUNTRIES = Object.entries(COUNTRY_NAMES)
const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-yellow',
  in_transit: 'badge-blue',
  delivered: 'badge-green',
  cancelled: 'badge-red',
}

export default function DashboardPackages() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [viewPkg, setViewPkg] = useState<PkgType | null>(null)
  const [form, setForm] = useState({ origin: 'ZA', destination: 'ZW', weight: 1, description: '', clearanceDocs: false })
  const [packages, setPackages] = useState(() => getPackages().filter(p => p.userId === user?.id))

  if (!user) return null

  const routes = getRoutes()

  function refreshPackages() {
    setPackages(getPackages().filter(p => p.userId === user!.id))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const rate = calculateRate(form.origin, form.destination, form.weight, form.clearanceDocs, user!.discount)
    const trackingNumber = generateTrackingNumber()
    const now = new Date().toISOString()
    const pkg: PkgType = {
      id: crypto.randomUUID(),
      trackingNumber,
      userId: user!.id,
      origin: form.origin,
      destination: form.destination,
      weight: form.weight,
      status: 'pending',
      description: form.description,
      clearanceDocs: form.clearanceDocs,
      price: rate.total,
      createdAt: now,
      updatedAt: now,
    }
    savePackage(pkg)

    // Auto-create invoice
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)
    const items = [
      { description: `Shipping: ${COUNTRY_NAMES[form.origin]} → ${COUNTRY_NAMES[form.destination]} (${form.weight}kg)`, quantity: 1, unitPrice: rate.base, total: rate.base },
    ]
    if (rate.clearance > 0) {
      items.push({ description: 'Clearance Documentation', quantity: 1, unitPrice: rate.clearance, total: rate.clearance })
    }
    if (user!.discount > 0) {
      const discAmt = -(rate.base + rate.clearance) * user!.discount / 100
      items.push({ description: `Loyalty Discount (${user!.discount}%)`, quantity: 1, unitPrice: discAmt, total: discAmt })
    }
    saveInvoice({
      id: crypto.randomUUID(),
      invoiceNumber: generateInvoiceNumber(),
      userId: user!.id,
      packageId: pkg.id,
      amount: rate.total,
      status: 'unpaid',
      items,
      createdAt: now,
      dueDate: dueDate.toISOString(),
    })

    refreshPackages()
    setShowForm(false)
    setForm({ origin: 'ZA', destination: 'ZW', weight: 1, description: '', clearanceDocs: false })
  }

  const rate = form.origin !== form.destination ? calculateRate(form.origin, form.destination, form.weight, form.clearanceDocs, user.discount) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Packages</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Shipment
        </button>
      </div>

      {/* New package form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">New Shipment</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Origin</label>
                  <select className="input" value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))}>
                    {COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Destination</label>
                  <select className="input" value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}>
                    {COUNTRIES.filter(([c]) => c !== form.origin).map(([c, n]) => <option key={c} value={c}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input type="number" min={0.1} step={0.1} className="input" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: parseFloat(e.target.value) || 0.1 }))} />
              </div>
              <div>
                <label className="label">Description</label>
                <input type="text" className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Package contents..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.clearanceDocs} onChange={e => setForm(p => ({ ...p, clearanceDocs: e.target.checked }))} className="w-4 h-4 accent-orange-600" />
                <span className="text-sm font-medium text-gray-700">Clearance Docs (+R200)</span>
              </label>
              {rate && rate.total > 0 && (
                <div className="bg-orange-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Base</span><span>R{rate.base.toFixed(2)}</span></div>
                  {rate.clearance > 0 && <div className="flex justify-between"><span className="text-gray-600">Clearance</span><span>R{rate.clearance.toFixed(2)}</span></div>}
                  {user.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({user.discount}%)</span><span>-R{((rate.base + rate.clearance) * user.discount / 100).toFixed(2)}</span></div>}
                  <div className="flex justify-between font-bold text-orange-700 border-t border-orange-200 mt-1 pt-1"><span>Total</span><span>R{rate.total.toFixed(2)}</span></div>
                  <div className="text-xs text-gray-400 mt-1">Est. {rate.days}</div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 btn-primary justify-center">Create Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package detail modal */}
      {viewPkg && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Package Details</h2>
              <button onClick={() => setViewPkg(null)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tracking #</span><span className="font-mono font-bold text-brand-600">{viewPkg.trackingNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Route</span><span>{COUNTRY_NAMES[viewPkg.origin]} → {COUNTRY_NAMES[viewPkg.destination]}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Weight</span><span>{viewPkg.weight}kg</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-bold">R{viewPkg.price.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`badge ${STATUS_BADGE[viewPkg.status]}`}>{viewPkg.status.replace('_', ' ')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Clearance</span><span>{viewPkg.clearanceDocs ? 'Yes' : 'No'}</span></div>
              {viewPkg.description && <div className="flex justify-between"><span className="text-gray-500">Description</span><span>{viewPkg.description}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Created</span><span>{format(new Date(viewPkg.createdAt), 'dd MMM yyyy')}</span></div>
            </div>
            <button onClick={() => setViewPkg(null)} className="w-full mt-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700">Close</button>
          </div>
        </div>
      )}

      {/* Packages table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {packages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No shipments yet</p>
            <p className="text-sm">Create your first shipment to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tracking #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Weight</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm font-bold text-brand-600">{pkg.trackingNumber}</td>
                    <td className="px-4 py-3 text-sm">{pkg.origin} → {pkg.destination}</td>
                    <td className="px-4 py-3 text-sm">{pkg.weight}kg</td>
                    <td className="px-4 py-3 text-sm font-semibold">R{pkg.price.toFixed(0)}</td>
                    <td className="px-4 py-3"><span className={`badge ${STATUS_BADGE[pkg.status]}`}>{pkg.status.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-400">{format(new Date(pkg.createdAt), 'dd MMM yy')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewPkg(pkg)} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
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
