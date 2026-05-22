import React, { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { getSettings, saveSettings } from '../../lib/storage'
import { addAuditLog } from '../../lib/storage'
import { useAuth } from '../../contexts/AuthContext'
import { AppSettings, RoutePrice } from '../../types'
import { COUNTRY_NAMES } from '../../lib/courier'

export default function AdminSettings() {
  const { user: adminUser } = useAuth()
  const [settings, setSettings] = useState<AppSettings>(() => getSettings())
  const [saved, setSaved] = useState<string | null>(null)

  function save(section: string) {
    saveSettings(settings)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Settings updated: ${section}`, targetType: 'settings', targetId: 'settings', details: '' })
    setSaved(section); setTimeout(() => setSaved(null), 2000)
  }

  function updateRoute(idx: number, field: keyof RoutePrice, value: string | number) {
    const routes = [...settings.routes]
    routes[idx] = { ...routes[idx], [field]: typeof value === 'string' ? parseFloat(value) || 0 : value }
    setSettings(p => ({ ...p, routes }))
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
  const labelClass = "block text-xs font-medium text-gray-400 mb-1"
  const sectionClass = "bg-[#1a1f2e] border border-[#2d3348] rounded-xl p-5 space-y-4"

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Admin Settings</h1>

      {/* Homepage */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-white text-lg border-b border-[#2d3348] pb-3">Homepage Settings</h2>
        <div>
          <label className={labelClass}>Hero Headline</label>
          <input className={inputClass} value={settings.heroHeadline} onChange={e => setSettings(p => ({ ...p, heroHeadline: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Hero Sub-heading</label>
          <input className={inputClass} value={settings.heroSubheading} onChange={e => setSettings(p => ({ ...p, heroSubheading: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Hero Image URL</label>
          <input className={inputClass} value={settings.heroImageUrl} onChange={e => setSettings(p => ({ ...p, heroImageUrl: e.target.value }))} placeholder="https://..." />
          {settings.heroImageUrl && <img src={settings.heroImageUrl} alt="Hero preview" className="mt-2 rounded-lg h-24 object-cover w-full opacity-70" />}
        </div>
        <div>
          <label className={labelClass}>Promo Banner</label>
          <input className={inputClass} value={settings.promoBanner} onChange={e => setSettings(p => ({ ...p, promoBanner: e.target.value }))} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.firstPromoEnabled} onChange={e => setSettings(p => ({ ...p, firstPromoEnabled: e.target.checked }))} className="w-4 h-4 accent-orange-600" />
          <span className="text-sm text-gray-300">First-50 promo enabled (10% discount)</span>
        </label>
        <SaveButton saved={saved === 'homepage'} onClick={() => save('homepage')} />
      </div>

      {/* Pricing */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-white text-lg border-b border-[#2d3348] pb-3">Pricing Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Clearance Fee (R)</label>
            <input type="number" className={inputClass} value={settings.clearanceFee} onChange={e => setSettings(p => ({ ...p, clearanceFee: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>Truck Rental / Day (R)</label>
            <input type="number" className={inputClass} value={settings.truckRentalPerDay} onChange={e => setSettings(p => ({ ...p, truckRentalPerDay: parseFloat(e.target.value) || 0 }))} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Route Prices (R/kg)</div>
          {settings.routes.map((r, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <div className="text-sm text-gray-300 col-span-1">{COUNTRY_NAMES[r.origin] ?? r.origin} → {COUNTRY_NAMES[r.destination] ?? r.destination}</div>
              <div>
                <input type="number" className={inputClass} value={r.pricePerKg} onChange={e => updateRoute(i, 'pricePerKg', e.target.value)} placeholder="R/kg" />
              </div>
              <div className="flex gap-1">
                <input type="number" className={inputClass} value={r.minDays} onChange={e => updateRoute(i, 'minDays', parseInt(e.target.value)||1)} placeholder="Min days" />
                <input type="number" className={inputClass} value={r.maxDays} onChange={e => updateRoute(i, 'maxDays', parseInt(e.target.value)||1)} placeholder="Max days" />
              </div>
            </div>
          ))}
        </div>
        <SaveButton saved={saved === 'pricing'} onClick={() => save('pricing')} />
      </div>

      {/* System */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-white text-lg border-b border-[#2d3348] pb-3">System Settings</h2>
        <div>
          <label className={labelClass}>Company Name</label>
          <input className={inputClass} value={settings.companyName} onChange={e => setSettings(p => ({ ...p, companyName: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>WhatsApp Number (with country code, no +)</label>
          <input className={inputClass} value={settings.whatsappNumber} onChange={e => setSettings(p => ({ ...p, whatsappNumber: e.target.value }))} placeholder="27XXXXXXXXX" />
        </div>
        <div>
          <label className={labelClass}>Stripe Payment Link</label>
          <input className={inputClass} value={settings.stripeLink} onChange={e => setSettings(p => ({ ...p, stripeLink: e.target.value }))} placeholder="https://buy.stripe.com/..." />
        </div>
        <SaveButton saved={saved === 'system'} onClick={() => save('system')} />
      </div>
    </div>
  )
}

function SaveButton({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-green-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}>
      {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
    </button>
  )
}
