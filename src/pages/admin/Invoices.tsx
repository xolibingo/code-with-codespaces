import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { getInvoices, updateInvoice, getUsers } from '../../lib/storage'
import { addAuditLog } from '../../lib/storage'
import { useAuth } from '../../contexts/AuthContext'
import { Invoice } from '../../types'
import { downloadInvoicePDF } from '../../lib/pdf'
import { format } from 'date-fns'

const STATUS_COLORS: Record<string, string> = {
  unpaid: 'bg-yellow-900/40 text-yellow-400',
  paid: 'bg-green-900/40 text-green-400',
  overdue: 'bg-red-900/40 text-red-400',
}

export default function AdminInvoices() {
  const { user: adminUser } = useAuth()
  const [invoices, setInvoices] = useState(() => getInvoices())
  const users = getUsers()

  function getUser(id: string) { return users.find(u => u.id === id) }

  function handleStatus(inv: Invoice, status: Invoice['status']) {
    const updated = { ...inv, status }
    updateInvoice(updated)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Invoice ${inv.invoiceNumber} → ${status}`, targetType: 'invoice', targetId: inv.id, details: '' })
    setInvoices(getInvoices())
  }

  const th = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase'
  const cell = 'px-3 py-3 text-sm'

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Invoices</h1>
      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#2d3348]">
              <tr>
                <th className={th}>Invoice #</th><th className={th}>Client</th><th className={th}>Amount</th>
                <th className={th}>Status</th><th className={th}>Due</th><th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3348]">
              {invoices.map(inv => {
                const u = getUser(inv.userId)
                return (
                  <tr key={inv.id} className="hover:bg-white/2">
                    <td className={cell}><span className="font-mono text-orange-400 text-xs">{inv.invoiceNumber}</span></td>
                    <td className={`${cell} text-gray-300 text-xs`}>{u?.email ?? inv.userId}</td>
                    <td className={`${cell} text-white font-semibold`}>R{inv.amount.toFixed(2)}</td>
                    <td className={cell}>
                      <select value={inv.status} onChange={e => handleStatus(inv, e.target.value as Invoice['status'])}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[inv.status]} bg-transparent`}>
                        {(['unpaid','paid','overdue'] as const).map(s => <option key={s} value={s} className="bg-[#1a1f2e] text-white">{s}</option>)}
                      </select>
                    </td>
                    <td className={`${cell} text-gray-500 text-xs`}>{format(new Date(inv.dueDate), 'dd MMM yy')}</td>
                    <td className={cell}>
                      {u && <button onClick={() => downloadInvoicePDF(inv, u)} className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {invoices.length === 0 && <div className="p-8 text-center text-gray-500">No invoices yet</div>}
      </div>
    </div>
  )
}
