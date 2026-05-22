import React, { useState } from 'react'
import { Package, DollarSign, Clock, Users, Copy, CheckCircle, Tag } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPackages, getInvoices } from '../../lib/storage'
import { getReferralCount } from '../../lib/auth'
import { format } from 'date-fns'

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-yellow',
  in_transit: 'badge-blue',
  delivered: 'badge-green',
  cancelled: 'badge-red',
}

export default function DashboardOverview() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const packages = getPackages().filter(p => p.userId === user.id)
  const invoices = getInvoices().filter(i => i.userId === user.id)
  const totalSpent = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const pending = packages.filter(p => p.status === 'pending' || p.status === 'in_transit').length
  const referralCount = getReferralCount(user.id)
  const referralLink = `${window.location.origin}/signup?ref=${user.referralCode}`

  function copyReferral() {
    navigator.clipboard.writeText(referralLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    { label: 'Total Packages', value: packages.length, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Shipments', value: pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Spent', value: `R${totalSpent.toFixed(0)}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Referrals Made', value: referralCount, icon: Users, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 text-sm mt-0.5">{new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {user.discount > 0 && (
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">First-50 User Discount Active!</div>
            <div className="text-orange-100 text-sm">You save {user.discount}% on every shipment</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-1">Your Referral Link</h3>
        <p className="text-sm text-gray-500 mb-3">Share your code and earn rewards when friends sign up!</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 truncate">{referralLink}</code>
          <button onClick={copyReferral} className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors">
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="mt-2 text-sm text-brand-600 font-semibold">Your code: {user.referralCode} · {referralCount} referrals made</div>
      </div>

      {/* Recent packages */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Packages</h3>
        </div>
        {packages.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No packages yet. Create your first shipment!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {packages.slice(0, 5).map(pkg => (
              <div key={pkg.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{pkg.trackingNumber}</div>
                  <div className="text-xs text-gray-400">{pkg.origin} → {pkg.destination} · {pkg.weight}kg</div>
                </div>
                <div className="text-right">
                  <span className={`badge ${STATUS_BADGE[pkg.status]}`}>{pkg.status.replace('_', ' ')}</span>
                  <div className="text-xs text-gray-400 mt-1">{format(new Date(pkg.createdAt), 'dd MMM yyyy')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
