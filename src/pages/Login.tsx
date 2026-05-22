import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { sendOTP, verifyOTP } from '../lib/auth'

export default function Login() {
  const { login, googleSignIn, user } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sentCode, setSentCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleModal, setGoogleModal] = useState(false)

  function redirectUser(u: { role: string; email?: string }) {
    if (u.role === 'admin' || u.email === 'bingosamu@gmail.com') {
      navigate('/admin/overview')
    } else {
      navigate('/dashboard/overview')
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
      redirectUser(u)
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  function handleSendOTP() {
    if (!phone) { setError('Enter phone number'); return }
    const code = sendOTP(phone)
    setSentCode(code)
    setOtpSent(true)
    setError('')
  }

  async function handleOTPLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const valid = verifyOTP(phone, otp)
    if (!valid) { setError('Invalid or expired OTP'); return }
    setError('No account found for this phone. Please sign up first.')
  }

  async function handleGoogleSignIn() {
    setGoogleModal(false)
    setLoading(true)
    try {
      const u = await googleSignIn()
      redirectUser(u)
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button onClick={() => setMode('password')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'password' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
              Email & Password
            </button>
            <button onClick={() => setMode('otp')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'otp' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
              Phone OTP
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {mode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input pl-10" />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter any password" className="input pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPLogin} className="space-y-4">
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 XX XXX XXXX" className="input pl-10" />
                </div>
              </div>
              {!otpSent ? (
                <button type="button" onClick={handleSendOTP} className="btn-primary w-full justify-center">
                  Send OTP
                </button>
              ) : (
                <>
                  <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">OTP sent! (Demo code: {sentCode})</div>
                  <div>
                    <label className="label">Enter OTP</label>
                    <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} className="input" />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">Verify & Sign In</button>
                </>
              )}
            </form>
          )}

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
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/signup" className="text-brand-600 font-semibold hover:underline">Sign up free</Link>
        </p>
      </div>

      {googleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sign in with Google</h3>
            <p className="text-sm text-gray-500 mb-6">This is a simulated Google sign-in for demonstration purposes.</p>
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
