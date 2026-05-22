import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const COUNTRIES = [
  { code: 'ZA', name: 'South Africa' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' },
]

export default function Signup() {
  const { signup, googleSignIn } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', country: 'ZA', referredBy: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successDiscount, setSuccessDiscount] = useState(false)
  const [googleModal, setGoogleModal] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await signup(formData)
      if (user.discount > 0) {
        setSuccessDiscount(true)
        setTimeout(() => navigate('/dashboard/overview'), 2500)
      } else {
        navigate('/dashboard/overview')
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setGoogleModal(false)
    setLoading(true)
    try {
      const user = await googleSignIn()
      navigate('/dashboard/overview')
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  if (successDiscount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Bingo Couriers!</h2>
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-4">
            <div className="text-brand-700 font-bold text-lg mb-1">10% Discount Unlocked!</div>
            <p className="text-gray-600 text-sm">You're one of our first 50 users — enjoy 10% off all shipments automatically!</p>
          </div>
          <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xl text-gray-900 leading-tight">BINGO</div>
              <div className="text-brand-600 text-xs font-bold tracking-widest">COURIERS</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">First 50 users get 10% off!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Your full name" className="input" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Choose a password" className="input" minLength={6} />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+27 XX XXX XXXX" className="input" />
            </div>
            <div>
              <label className="label">Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className="input">
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Referral Code (optional)</label>
              <input name="referredBy" type="text" value={formData.referredBy} onChange={handleChange} placeholder="Friend's referral code" className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button onClick={() => setGoogleModal(true)} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>

      {googleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sign up with Google</h3>
            <p className="text-sm text-gray-500 mb-6">This is a simulated Google sign-up for demonstration purposes.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">G</div>
              <div>
                <div className="font-semibold text-sm text-gray-900">Google User</div>
                <div className="text-xs text-gray-500">demo.user@gmail.com</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setGoogleModal(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleGoogleSignIn} className="flex-1 py-2 bg-blue-600 rounded-xl text-sm font-medium text-white hover:bg-blue-700">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
