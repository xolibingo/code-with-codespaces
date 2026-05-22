import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Info, Truck } from 'lucide-react'
import { ROUTES } from '../lib/courier'
import { getSettings } from '../lib/storage'

export default function Pricing() {
  const settings = getSettings()
  const weights = [0.5, 1, 2, 5, 10, 20]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-orange-100 text-lg">No hidden fees. Pay only for what you ship.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rate table */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Rates by Route & Weight</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="text-left px-4 py-3 rounded-tl-lg">Route</th>
                  <th className="px-3 py-3">Transit</th>
                  <th className="px-3 py-3">Rate/kg</th>
                  {weights.map(w => (
                    <th key={w} className="px-3 py-3">{w}kg</th>
                  ))}
                  <th className="px-3 py-3 rounded-tr-lg">+Clearance</th>
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r, i) => (
                  <tr key={r.label} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{r.label}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{r.minDays}–{r.maxDays}d</td>
                    <td className="px-3 py-3 text-center font-bold text-orange-600">R{r.pricePerKg}</td>
                    {weights.map(w => (
                      <td key={w} className="px-3 py-3 text-center text-gray-700">
                        R{(r.pricePerKg * w).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center text-purple-600 font-medium">+R{settings.clearanceFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional fees */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card border-l-4 border-orange-500">
            <h3 className="font-bold text-gray-900 mb-2">Clearance Documentation</h3>
            <div className="text-2xl font-extrabold text-orange-600 mb-2">R{settings.clearanceFee}</div>
            <p className="text-sm text-gray-500">Optional customs agent service. Our agents handle all paperwork for cross-border compliance.</p>
          </div>
          <div className="card border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-2">Truck Rental</h3>
            <div className="text-2xl font-extrabold text-blue-600 mb-2">R{settings.truckRentalPerDay.toLocaleString()}/day</div>
            <p className="text-sm text-gray-500">Full truck hire for large loads. Includes driver and fuel. Available subject to fleet availability.</p>
          </div>
          <div className="card border-l-4 border-green-500">
            <h3 className="font-bold text-gray-900 mb-2">First-User Promo</h3>
            <div className="text-2xl font-extrabold text-green-600 mb-2">10% OFF</div>
            <p className="text-sm text-gray-500">First 50 users on the platform receive a 10% discount on all shipments automatically applied.</p>
          </div>
        </div>

        {/* What's included */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included in Every Shipment</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Real-time tracking updates',
              'Digital invoice & receipt',
              'Secure packaging guidelines',
              'Cross-border compliance support',
              'Customer service via WhatsApp',
              'Insurance claim assistance',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Truck rental */}
        <div className="card bg-gray-800 text-white">
          <div className="flex items-start gap-4">
            <Truck className="w-12 h-12 text-orange-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Need a Full Truck?</h2>
              <p className="text-gray-300 mb-4">For large consignments, request one of our fleet trucks. Rates from R{settings.truckRentalPerDay.toLocaleString()}/day including driver.</p>
              <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl inline-block transition-colors">
                Request a Truck
              </Link>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 flex items-start gap-3 text-sm text-gray-500">
          <Info className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <p>Prices are in South African Rand (ZAR) and include basic handling. Prices are subject to change. A surcharge may apply for oversize items. Contact us for bulk or business rates.</p>
        </div>
      </div>
    </div>
  )
}
