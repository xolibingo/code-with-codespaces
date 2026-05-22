import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, Package, MapPin, Shield, Clock, Star, ChevronRight, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react'
import { ROUTES, calculateRate, COUNTRY_NAMES } from '../lib/courier'
import { generateQuotePDF } from '../lib/pdf'
import { getSettings } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'

function RateCalculator() {
  const { user } = useAuth()
  const settings = getSettings()
  const [origin, setOrigin] = useState('ZA')
  const [destination, setDestination] = useState('ZW')
  const [weight, setWeight] = useState(1)
  const [clearance, setClearance] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateRate> | null>(null)

  function calculate() {
    const r = calculateRate(origin, destination, weight, clearance, user?.discount || 0)
    setResult(r)
  }

  function sendWhatsApp() {
    if (!result) return
    const route = `${COUNTRY_NAMES[origin]} → ${COUNTRY_NAMES[destination]}`
    const clearanceLine = clearance ? `Clearance%20Fee:%20R${result.clearance}%0A` : ''
    const msg = `*Bingo%20Couriers%20Quote*%0ARoute:%20${encodeURIComponent(route)}%0AWeight:%20${weight}kg%0ABase:%20R${result.base.toFixed(2)}%0A${clearanceLine}*Total:%20R${result.total.toFixed(2)}*%0ATransit:%20${result.days}%0A%0APlease%20confirm%20booking.`
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${msg}`, '_blank')
  }

  function downloadQuote() {
    if (!result) return
    generateQuotePDF({
      route: `${COUNTRY_NAMES[origin]} → ${COUNTRY_NAMES[destination]}`,
      weight,
      base: result.base,
      clearance: result.clearance,
      total: result.total,
      days: result.days,
      discount: user?.discount,
      clientName: user?.name,
    })
  }

  const countries = Object.entries(COUNTRY_NAMES)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-orange-600" /> Instant Rate Calculator
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Origin</label>
          <select className="input" value={origin} onChange={e => setOrigin(e.target.value)}>
            {countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Destination</label>
          <select className="input" value={destination} onChange={e => setDestination(e.target.value)}>
            {countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Weight (kg)</label>
          <input type="number" className="input" min={0.1} step={0.1} value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 1)} />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={clearance} onChange={e => setClearance(e.target.checked)} className="w-5 h-5 accent-orange-600" />
            <span className="text-sm font-medium text-gray-700">Clearance Docs (+R200)</span>
          </label>
        </div>
      </div>
      <button onClick={calculate} className="btn-primary w-full justify-center mb-4">
        Calculate Rate
      </button>
      {result && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base shipping ({weight}kg × R{result.pricePerKg}/kg)</span>
            <span className="font-medium">R{result.base.toFixed(2)}</span>
          </div>
          {clearance && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Clearance documentation</span>
              <span className="font-medium">R{result.clearance.toFixed(2)}</span>
            </div>
          )}
          {(user?.discount || 0) > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({user!.discount}%)</span>
              <span>-R{((result.base + result.clearance) * user!.discount / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-orange-700 border-t border-orange-200 pt-2">
            <span>Total</span>
            <span>R{result.total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500">Estimated transit: {result.days}</p>
          <div className="flex gap-2 pt-2">
            <button onClick={sendWhatsApp} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp Quote
            </button>
            <button onClick={downloadQuote} className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors">
              <Package className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const settings = getSettings()

  const features = [
    { icon: Clock, title: 'Express Delivery', desc: '2–7 day cross-border delivery across Southern Africa' },
    { icon: Package, title: 'Real-Time Tracking', desc: 'Track every package with live status updates' },
    { icon: MapPin, title: '5 Countries', desc: 'ZA, ZW, BW, ZM, MZ, NA — fully covered' },
    { icon: Shield, title: 'Secure & Insured', desc: 'Your goods protected door-to-door' },
  ]

  const steps = [
    { n: '01', title: 'Get a Quote', desc: 'Use our rate calculator for an instant price' },
    { n: '02', title: 'Book & Pay', desc: 'Confirm your shipment and pay securely' },
    { n: '03', title: 'We Deliver', desc: 'Track your package all the way to its destination' },
  ]

  const testimonials = [
    { name: 'Thabo M.', country: 'ZA→ZW', text: 'Package arrived in 4 days! Excellent service and real-time tracking made it stress-free.', stars: 5 },
    { name: 'Naledi K.', country: 'ZA→BW', text: 'Bingo Couriers handled our customs clearance perfectly. Will use again!', stars: 5 },
    { name: 'Prosper C.', country: 'ZA→ZM', text: 'Best courier for the Southern Africa region. Professional and reliable.', stars: 5 },
  ]

  return (
    <div>
      {/* Promo banner */}
      {settings.promoBanner && (
        <div className="bg-orange-600 text-white text-center py-2 text-sm font-medium">
          🎉 {settings.promoBanner}
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-yellow-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Now serving 5 countries
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                {settings.heroHeadline || 'Fast, Reliable Cross-Border Delivery'}
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                {settings.heroSubheading || 'Connecting Southern Africa with express courier services'}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#rate-calc" className="btn-secondary">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </a>
                <Link to="/track" className="btn-secondary">
                  Track Package <Package className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-orange-200 text-sm">
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> No hidden fees</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> Live tracking</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> Customs support</span>
              </div>
            </div>
            <div className="flex justify-center">
              {settings.heroImageUrl ? (
                <img src={settings.heroImageUrl} alt="Courier" className="rounded-2xl shadow-2xl max-h-80 object-cover" />
              ) : (
                <div className="relative">
                  <div className="w-72 h-72 bg-white/10 rounded-3xl flex items-center justify-center">
                    <Truck className="w-40 h-40 text-white/80 pkg-float" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-2 text-sm font-bold shadow-lg">
                    Delivered! ✓
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white text-orange-700 rounded-2xl px-4 py-2 text-sm font-bold shadow-lg">
                    2–7 Day Delivery
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rate Calculator */}
      <section id="rate-calc" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Get an Instant Quote</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Calculate your shipping cost in seconds and send it directly to WhatsApp</p>
          </div>
          <div className="max-w-lg mx-auto">
            <RateCalculator />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Bingo Couriers?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="card text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="text-center text-white">
                <div className="text-6xl font-extrabold text-white/20 mb-2">{s.n}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-orange-100">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-8 h-8 text-white/30 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/signup" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors inline-flex items-center gap-2 shadow-lg">
              Start Shipping Today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Routes preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Routes</h2>
              <p className="text-gray-500 mt-1">Competitive rates across Southern Africa</p>
            </div>
            <Link to="/pricing" className="text-orange-600 font-semibold flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROUTES.slice(0, 3).map(r => (
              <div key={r.label} className="card hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{r.label}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{r.minDays}–{r.maxDays} days</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-600">R{r.pricePerKg}/kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ship across Southern Africa?</h2>
          <p className="text-gray-400 mb-8">Join thousands of businesses and individuals trusting Bingo Couriers</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg py-4 px-8">
              Create Free Account
            </Link>
            <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
