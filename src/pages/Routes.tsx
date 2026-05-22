import React from 'react'
import { MapPin, Clock, Package } from 'lucide-react'
import { ROUTES, COUNTRY_NAMES } from '../lib/courier'

const COUNTRY_COORDS: Record<string, [number, number]> = {
  ZA: [-26.2041, 28.0473],
  ZW: [-17.8251, 31.0335],
  BW: [-22.3285, 24.6849],
  ZM: [-13.1339, 27.8493],
  MZ: [-18.6657, 35.5296],
  NA: [-22.9576, 18.4904],
}

const COUNTRY_DOT_POSITION: Record<string, { x: number; y: number }> = {
  ZA: { x: 38, y: 82 },
  ZW: { x: 62, y: 40 },
  BW: { x: 42, y: 55 },
  ZM: { x: 52, y: 22 },
  MZ: { x: 70, y: 55 },
  NA: { x: 22, y: 55 },
}

export default function Routes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Our Routes</h1>
          <p className="text-orange-100 text-lg">Connecting 5 countries across Southern Africa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* SVG map */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Coverage Map</h2>
            <div className="bg-blue-50 rounded-xl p-4">
              <svg viewBox="0 0 100 100" className="w-full max-w-sm mx-auto" style={{ height: 320 }}>
                {/* Background */}
                <rect width="100" height="100" fill="#e8f4fd" rx="4" />

                {/* Route lines from ZA to all destinations */}
                {Object.keys(COUNTRY_COORDS).filter(c => c !== 'ZA').map(dest => {
                  const from = COUNTRY_DOT_POSITION['ZA']
                  const to = COUNTRY_DOT_POSITION[dest]
                  return (
                    <line
                      key={dest}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#ea580c"
                      strokeWidth="0.8"
                      strokeDasharray="2,1.5"
                      opacity="0.6"
                    />
                  )
                })}

                {/* Country dots */}
                {Object.entries(COUNTRY_DOT_POSITION).map(([code, pos]) => (
                  <g key={code}>
                    <circle
                      cx={pos.x} cy={pos.y} r={code === 'ZA' ? 4 : 3}
                      fill={code === 'ZA' ? '#ea580c' : '#3b82f6'}
                      opacity="0.9"
                    />
                    <text
                      x={pos.x + 3} y={pos.y - 3}
                      fontSize="4.5" fill="#1f2937" fontWeight="bold"
                    >
                      {COUNTRY_NAMES[code]}
                    </text>
                    <text
                      x={pos.x + 3} y={pos.y + 5}
                      fontSize="3.5" fill="#6b7280"
                    >
                      {code}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-600 inline-block" /> Origin (ZA)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Destination
              </span>
              <span className="flex items-center gap-1">
                <span className="w-6 border-t-2 border-dashed border-orange-500 inline-block" /> Route
              </span>
            </div>
          </div>

          {/* Route list */}
          <div className="space-y-4">
            {ROUTES.map(r => (
              <div key={r.label} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{r.label}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {r.minDays}–{r.maxDays} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" /> Min 0.1kg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">R{r.pricePerKg}/kg</div>
                    <div className="text-xs text-gray-400">+R200 clearance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countries info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Countries We Serve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
              <div key={code} className="card flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center text-white font-extrabold text-lg">
                  {code}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{name}</div>
                  {code === 'ZA' ? (
                    <div className="text-xs text-orange-600">Origin Hub</div>
                  ) : (
                    <div className="text-xs text-blue-600">Destination Available</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
