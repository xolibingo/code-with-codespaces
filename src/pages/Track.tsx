import React, { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react'
import { getPackages } from '../lib/storage'
import { Package as PkgType } from '../types'
import { COUNTRY_NAMES } from '../lib/courier'

const STATUS_CONFIG = {
  pending: { icon: Clock, label: 'Pending', color: 'text-yellow-600 bg-yellow-50', step: 0 },
  in_transit: { icon: Truck, label: 'In Transit', color: 'text-blue-600 bg-blue-50', step: 1 },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-green-600 bg-green-50', step: 2 },
  cancelled: { icon: XCircle, label: 'Cancelled', color: 'text-red-600 bg-red-50', step: -1 },
}

const STEPS = [
  { label: 'Order Placed', desc: 'Package registered in system' },
  { label: 'In Transit', desc: 'Package on its way to destination' },
  { label: 'Delivered', desc: 'Package successfully delivered' },
]

export default function Track() {
  const [tracking, setTracking] = useState('')
  const [result, setResult] = useState<PkgType | null | 'not_found'>(null)

  function search() {
    const t = tracking.trim().toUpperCase()
    if (!t) return
    const pkgs = getPackages()
    const found = pkgs.find(p => p.trackingNumber === t)
    setResult(found || 'not_found')
  }

  const cfg = result && result !== 'not_found' ? STATUS_CONFIG[result.status] : null
  const step = cfg?.step ?? -1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Track Your Package</h1>
          <p className="text-orange-100 text-lg mb-8">Enter your tracking number to get real-time status updates</p>
          <div className="flex gap-2 max-w-lg mx-auto">
            <input
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="e.g. BC123456ABC"
              value={tracking}
              onChange={e => setTracking(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
            <button onClick={search} className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 flex items-center gap-2 shadow">
              <Search className="w-5 h-5" /> Track
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {result === 'not_found' && (
          <div className="card text-center py-12">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Package Not Found</h3>
            <p className="text-gray-500">No package found with tracking number <strong>{tracking}</strong>. Please check and try again.</p>
          </div>
        )}

        {result && result !== 'not_found' && cfg && (
          <div className="space-y-6">
            {/* Status card */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Tracking Number</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">{result.trackingNumber}</div>
                </div>
                <span className={`badge ${cfg.color} text-base px-3 py-1`}>
                  <cfg.icon className="w-4 h-4 mr-1" />
                  {cfg.label}
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 mb-6 text-sm">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{COUNTRY_NAMES[result.origin] || result.origin}</span>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-orange-200 mx-2" />
                <Truck className="w-5 h-5 text-orange-500" />
                <div className="flex-1 border-t-2 border-dashed border-orange-200 mx-2" />
                <div className="flex items-center gap-1.5 text-gray-700">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{COUNTRY_NAMES[result.destination] || result.destination}</span>
                </div>
              </div>

              {/* Progress bar */}
              {result.status !== 'cancelled' && (
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    {STEPS.map((s, i) => (
                      <div key={s.label} className="flex-1 text-center">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto mb-1 ${
                          i <= step ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-300 text-gray-400'
                        }`}>
                          {i < step ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                        </div>
                        <div className={`text-xs font-medium ${i <= step ? 'text-orange-700' : 'text-gray-400'}`}>{s.label}</div>
                        <div className="text-xs text-gray-400">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                    <div className="h-full bg-orange-600 rounded-full transition-all" style={{ width: `${step === 0 ? 15 : step === 1 ? 55 : 100}%` }} />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Weight</div>
                  <div className="font-semibold">{result.weight} kg</div>
                </div>
                <div>
                  <div className="text-gray-500">Price</div>
                  <div className="font-semibold">R{result.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Description</div>
                  <div className="font-semibold">{result.description || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Clearance Docs</div>
                  <div className="font-semibold">{result.clearanceDocs ? 'Yes (+R200)' : 'No'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Shipped</div>
                  <div className="font-semibold">{new Date(result.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Last Updated</div>
                  <div className="font-semibold">{new Date(result.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="card text-center py-12">
            <Package className="w-16 h-16 text-orange-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Tracking Number</h3>
            <p className="text-gray-500">Your tracking number was sent via email when your package was booked.</p>
          </div>
        )}
      </div>
    </div>
  )
}
