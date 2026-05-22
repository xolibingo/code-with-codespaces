import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQS = [
  { q: 'How do I track my package?', a: 'Visit our Track page and enter your tracking number (format: BCxxxxxxXXX). You received your tracking number via email when the shipment was booked. Updates are available 24/7.' },
  { q: 'What countries do you deliver to?', a: 'We currently deliver from South Africa to Zimbabwe, Botswana, Zambia, Mozambique, and Namibia. We are expanding to more countries soon.' },
  { q: 'What are your delivery times?', a: 'Transit times vary by route: ZA→BW is 2–3 days, ZA→ZW is 3–5 days, ZA→MZ is 3–4 days, ZA→NA is 4–5 days, and ZA→ZM is 5–7 days. Times are from collection, not booking.' },
  { q: 'How is pricing calculated?', a: 'Pricing is per kilogram and depends on the destination. Use our Rate Calculator on the homepage for an instant quote. An optional R200 clearance fee applies if you need customs agent support.' },
  { q: 'What is the clearance documentation fee?', a: 'The R200 clearance fee covers our customs agent handling all cross-border paperwork and compliance on your behalf. This is optional but recommended for hassle-free customs clearance.' },
  { q: 'Do you offer truck rental?', a: 'Yes! We offer full truck hire from R3,150/day including driver. This is ideal for large or bulk consignments. Request a truck from your client dashboard.' },
  { q: 'Is my package insured?', a: 'Basic insurance is included for all shipments. We recommend declaring the full value of your goods for full coverage. Contact us to arrange enhanced insurance for high-value items.' },
  { q: 'How do I get a quote on WhatsApp?', a: 'Use the Rate Calculator on the homepage, click "WhatsApp Quote", and our team receives your quotation request instantly via WhatsApp. We respond within business hours.' },
  { q: 'Can I download an invoice?', a: 'Yes, PDF invoices are available from your dashboard under the Invoices tab. Click the download button next to any invoice.' },
  { q: 'What is the first-50 user discount?', a: 'The first 50 users who create an account on our platform receive a 10% discount on all their shipments, applied automatically at checkout.' },
  { q: 'How do referral codes work?', a: 'Each user gets a unique referral code. Share it with a friend when they sign up, and they get credited. Your referral count is visible in your profile — top referrers earn rankings.' },
  { q: 'What documents do I need to upload for tax?', a: 'You can upload any relevant tax documents (invoices, SARS documents, clearance certificates) from the Tax Docs section of your dashboard. Supported formats: PDF, JPG, PNG.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-orange-100 text-lg">Everything you need to know about Bingo Couriers</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
              {open === i ? (
                <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}

        <div className="card mt-8 text-center bg-orange-50 border-orange-200">
          <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 text-sm mb-4">Our team is available via WhatsApp or email Monday to Friday, 8am–6pm SAST.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4">
              Chat on WhatsApp
            </a>
            <a href="mailto:info@bingocouriers.co.za" className="btn-secondary text-sm py-2 px-4">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
