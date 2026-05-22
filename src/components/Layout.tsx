import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatBot from './ChatBot'

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      <style>{`
        @keyframes truckSlide {
          0% { transform: translateX(-200px); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
        }
        @keyframes floatBox {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        .truck-slide-1 { animation: truckSlide 20s linear infinite; opacity: 0.04; }
        .truck-slide-2 { animation: truckSlide 28s linear infinite 10s; opacity: 0.03; }
        .float-box-1 { animation: floatBox 7s ease-in-out infinite; opacity: 0.05; }
        .float-box-2 { animation: floatBox 9s ease-in-out infinite 3s; opacity: 0.04; }
      `}</style>

      {/* Floating package boxes */}
      <svg className="float-box-1 absolute" style={{ top: '15%', right: '8%', width: 60, height: 60 }} viewBox="0 0 60 60" fill="#ea580c">
        <rect x="0" y="0" width="60" height="60" rx="6"/>
        <rect x="0" y="0" width="60" height="12" rx="6" fill="#c2410c"/>
        <line x1="30" y1="12" x2="30" y2="60" stroke="#c2410c" strokeWidth="2"/>
        <line x1="0" y1="30" x2="60" y2="30" stroke="#c2410c" strokeWidth="1" opacity="0.5"/>
      </svg>
      <svg className="float-box-2 absolute" style={{ top: '65%', left: '5%', width: 45, height: 45 }} viewBox="0 0 45 45" fill="#f97316">
        <rect x="0" y="0" width="45" height="45" rx="5"/>
        <rect x="0" y="0" width="45" height="9" rx="5" fill="#ea580c"/>
        <line x1="22" y1="9" x2="22" y2="45" stroke="#ea580c" strokeWidth="1.5"/>
      </svg>

      {/* Animated trucks */}
      <svg className="truck-slide-1 absolute" style={{ top: '35%', width: 100, height: 50 }} viewBox="0 0 100 50" fill="#ea580c">
        <rect x="0" y="12" width="65" height="28" rx="4"/>
        <rect x="65" y="18" width="30" height="22" rx="4"/>
        <path d="M65 18 L82 10 L95 18" />
        <circle cx="18" cy="44" r="8"/>
        <circle cx="78" cy="44" r="8"/>
        <circle cx="18" cy="44" r="3" fill="#fff7ed"/>
        <circle cx="78" cy="44" r="3" fill="#fff7ed"/>
      </svg>
      <svg className="truck-slide-2 absolute" style={{ top: '70%', width: 80, height: 40 }} viewBox="0 0 80 40" fill="#f97316">
        <rect x="0" y="8" width="52" height="24" rx="3"/>
        <rect x="52" y="14" width="24" height="18" rx="3"/>
        <path d="M52 14 L66 8 L76 14"/>
        <circle cx="14" cy="36" r="7"/>
        <circle cx="62" cy="36" r="7"/>
        <circle cx="14" cy="36" r="3" fill="#fff7ed"/>
        <circle cx="62" cy="36" r="3" fill="#fff7ed"/>
      </svg>
    </div>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AmbientBackground />
      <Navbar />
      <main className="flex-1 relative" style={{ zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
