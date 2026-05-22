import React, { useState } from 'react'
import { User, Copy, CheckCircle, Tag, Share2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { updateUser, setCurrentUser } from '../../lib/storage'
import { getReferralCount } from '../../lib/auth'

const COUNTRIES = [
  { code: 'ZA', name: 'South Africa' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' },
]

export default function DashboardProfile() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', country: user?.country || 'ZA' })
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const referralCount = getReferralCount(user.id)
  const referralLink = `${window.location.origin}/signup?ref=${user.referralCode}`

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const updated = { ...user!, name: form.name, phone: form.phone, country: form.country }
    updateUser(updated)
    setCurrentUser(updated)
    refreshUser()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function copyCode() {
    navigator.clipboard.writeText(user!.referralCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function getRank() {
    if (referralCount >= 20) return { label: 'Ambassador', color: 'text-purple-600 bg-purple-100' }
    if (referralCount >= 10) return { label: 'Champion', color: 'text-blue-600 bg-blue-100' }
    if (referralCount >= 5) return { label: 'Advocate', color: 'text-green-600 bg-green-100' }
    if (referralCount >= 1) return { label: 'Starter', color: 'text-yellow-600 bg-yellow-100' }
    return { label: 'New Member', color: 'text-gray-600 bg-gray-100' }
  }

  const rank = getRank()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Discount badge */}
      {user.discount > 0 && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl p-4">
          <Tag className="w-6 h-6" />
          <div>
            <div className="font-bold">First-50 Discount: {user.discount}% off all shipments</div>
            <div className="text-orange-100 text-sm">Applied automatically at checkout</div>
          </div>
        </div>
      )}

      {/* Edit form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-brand-700 font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="font-bold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-400">{user.email}</div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+27 XX XXX XXXX" />
          </div>
          <div>
            <label className="label">Country</label>
            <select className="input" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Email (cannot be changed)</label>
            <input className="input bg-gray-50" value={user.email} disabled />
          </div>
          <button type="submit" className="btn-primary">
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Referral section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-brand-600" /> Referral Program
        </h2>

        <div className="flex items-center gap-2 mb-4">
          <span className={`badge ${rank.color} text-sm px-3 py-1.5`}>{rank.label}</span>
          <span className="text-sm text-gray-500">{referralCount} referrals made</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="label">Your Referral Code</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold text-brand-700 tracking-wider">{user.referralCode}</code>
              <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-2.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors">
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Shareable Link</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-600 break-all">{referralLink}</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          Share your code! When friends sign up with your referral code, they know you sent them. Earn rankings as you refer more people!
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { count: 1, label: 'Starter' },
            { count: 5, label: 'Advocate' },
            { count: 10, label: 'Champion' },
            { count: 20, label: 'Ambassador' },
          ].map(r => (
            <div key={r.label} className={`rounded-lg p-2 ${referralCount >= r.count ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-400'}`}>
              <div className="font-bold">{r.count}+</div>
              <div>{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
