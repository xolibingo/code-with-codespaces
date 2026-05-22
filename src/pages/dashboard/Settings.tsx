import React, { useState } from 'react'
import { Settings, Bell, Globe, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { COUNTRY_NAMES } from '../../lib/courier'

export default function DashboardSettings() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    packageUpdates: true,
    invoiceAlerts: true,
    promotions: false,
    weeklyReport: true,
  })
  const [defaultOrigin, setDefaultOrigin] = useState(user?.country || 'ZA')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    localStorage.setItem('bc_user_prefs', JSON.stringify({ notifications, defaultOrigin }))
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Notifications */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-orange-600"/> Notification Preferences</h2>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, val]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <div className={`w-11 h-6 rounded-full transition-colors ${val ? 'bg-orange-600' : 'bg-gray-300'} relative cursor-pointer`}
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-5' : 'translate-x-0.5'}`}/>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Default route */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-orange-600"/> Shipping Preferences</h2>
        <div>
          <label className="label">Default Origin Country</label>
          <select className="input" value={defaultOrigin} onChange={e => setDefaultOrigin(e.target.value)}>
            {Object.entries(COUNTRY_NAMES).map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-orange-600"/> Security</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div><div className="text-sm font-medium text-gray-900">Email</div><div className="text-xs text-gray-500">{user?.email}</div></div>
            <span className="badge badge-green">Verified</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div><div className="text-sm font-medium text-gray-900">Password</div><div className="text-xs text-gray-500">Last changed: N/A</div></div>
            <button className="text-sm text-orange-600 font-medium hover:underline">Change</button>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
