import React, { useState } from 'react'
import { Eye, Trash2, FileArchive } from 'lucide-react'
import { getTaxDocs, deleteTaxDoc, getUsers } from '../../lib/storage'
import { addAuditLog } from '../../lib/storage'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'

export default function AdminTaxDocs() {
  const { user: adminUser } = useAuth()
  const [docs, setDocs] = useState(() => getTaxDocs())
  const users = getUsers()

  function getUserEmail(id: string) { return users.find(u => u.id === id)?.email ?? id }

  function handleView(url: string) {
    const win = window.open()
    if (win) win.document.write(`<html><body style="margin:0"><iframe src="${url}" width="100%" height="100%" style="border:none"/></body></html>`)
  }

  function handleDelete(id: string, filename: string) {
    if (!confirm(`Delete ${filename}?`)) return
    deleteTaxDoc(id)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Deleted tax doc ${filename}`, targetType: 'tax_doc', targetId: id, details: '' })
    setDocs(getTaxDocs())
  }

  const th = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase'
  const cell = 'px-3 py-3 text-sm'

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Tax Documents</h1>
      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        {docs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileArchive className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No tax documents uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#2d3348]">
                <tr><th className={th}>Filename</th><th className={th}>Client</th><th className={th}>Type</th><th className={th}>Uploaded</th><th className={th}>Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#2d3348]">
                {docs.map(d => (
                  <tr key={d.id} className="hover:bg-white/2">
                    <td className={`${cell} text-gray-200`}>{d.filename}</td>
                    <td className={`${cell} text-gray-400 text-xs`}>{getUserEmail(d.userId)}</td>
                    <td className={`${cell} text-gray-400 text-xs`}>{d.type}</td>
                    <td className={`${cell} text-gray-500 text-xs`}>{format(new Date(d.uploadedAt), 'dd MMM yyyy, HH:mm')}</td>
                    <td className={cell}>
                      <div className="flex gap-2">
                        <button onClick={() => handleView(d.url)} className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"><Eye className="w-3.5 h-3.5" /> View</button>
                        <button onClick={() => handleDelete(d.id, d.filename)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /> Del</button>
                      </div>
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
