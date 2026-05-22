import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Package, FileText, Truck, FileArchive, ClipboardList, Settings, Menu, X, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/admin/overview',  icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/users',     icon: Users,           label: 'Clients' },
  { to: '/admin/packages',  icon: Package,         label: 'Packages' },
  { to: '/admin/invoices',  icon: FileText,        label: 'Invoices' },
  { to: '/admin/trucks',    icon: Truck,           label: 'Trucks' },
  { to: '/admin/tax-docs',  icon: FileArchive,     label: 'Tax Docs' },
  { to: '/admin/audit-log', icon: ClipboardList,   label: 'Audit Log' },
  { to: '/admin/settings',  icon: Settings,        label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  function handleLogout() { logout(); navigate('/') }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[#2d3348] bg-[#1a1f2e] transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#2d3348]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">BINGO COURIERS</div>
              <div className="text-orange-400 text-xs font-semibold tracking-widest">ADMIN</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b border-[#2d3348]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm truncate">{user?.name}</div>
              <div className="text-xs text-orange-400">Administrator</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />{item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#2d3348]">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-[#2d3348] bg-[#1a1f2e] px-4 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white"><Menu className="w-5 h-5" /></button>
          <span className="font-semibold text-white">Admin Console</span>
          <div className="ml-auto">
            <span className="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">Admin Session</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0f1117]"><Outlet /></main>
      </div>
    </div>
  )
}
