import React from 'react'
import { FileText, Download } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getInvoices } from '../../lib/storage'
import { downloadInvoicePDF } from '../../lib/pdf'
import { format } from 'date-fns'

const STATUS_BADGE: Record<string, string> = {
  unpaid: 'badge-yellow',
  paid: 'badge-green',
  overdue: 'badge-red',
}

export default function DashboardInvoices() {
  const { user } = useAuth()
  if (!user) return null

  const invoices = getInvoices().filter(i => i.userId === user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No invoices yet</p>
            <p className="text-sm">Invoices are created automatically when you add a shipment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm font-bold text-gray-800">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">R{inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-3"><span className={`badge ${STATUS_BADGE[inv.status]}`}>{inv.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-400">{format(new Date(inv.createdAt), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{format(new Date(inv.dueDate), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => downloadInvoicePDF(inv, user)}
                        className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
