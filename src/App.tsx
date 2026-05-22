import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Track = lazy(() => import('./pages/Track'))
const Pricing = lazy(() => import('./pages/Pricing'))
const RoutesPage = lazy(() => import('./pages/Routes'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview'))
const DashboardPackages = lazy(() => import('./pages/dashboard/Packages'))
const DashboardInvoices = lazy(() => import('./pages/dashboard/Invoices'))
const DashboardInventory = lazy(() => import('./pages/dashboard/Inventory'))
const DashboardTaxDocs = lazy(() => import('./pages/dashboard/TaxDocs'))
const DashboardProfile = lazy(() => import('./pages/dashboard/Profile'))
const DashboardSettings = lazy(() => import('./pages/dashboard/Settings'))
const RequestTruck = lazy(() => import('./pages/dashboard/RequestTruck'))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminOverview = lazy(() => import('./pages/admin/Overview'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminPackages = lazy(() => import('./pages/admin/Packages'))
const AdminInvoices = lazy(() => import('./pages/admin/Invoices'))
const AdminTrucks = lazy(() => import('./pages/admin/Trucks'))
const AdminTaxDocs = lazy(() => import('./pages/admin/TaxDocs'))
const AdminAuditLog = lazy(() => import('./pages/admin/AuditLog'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-600 border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes with main layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/track" element={<Track />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Client dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="packages" element={<DashboardPackages />} />
            <Route path="invoices" element={<DashboardInvoices />} />
            <Route path="inventory" element={<DashboardInventory />} />
            <Route path="tax-docs" element={<DashboardTaxDocs />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="settings" element={<DashboardSettings />} />
            <Route path="request-truck" element={<RequestTruck />} />
          </Route>

          {/* Admin console */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="trucks" element={<AdminTrucks />} />
            <Route path="tax-docs" element={<AdminTaxDocs />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
