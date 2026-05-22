import React, { useState, useRef } from 'react'
import { FileArchive, Upload, Trash2, Eye } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getTaxDocs, saveTaxDoc, deleteTaxDoc } from '../../lib/storage'
import { TaxDoc } from '../../types'
import { format } from 'date-fns'

export default function DashboardTaxDocs() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<TaxDoc[]>(() => user ? getTaxDocs().filter(d => d.userId === user.id) : [])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  function refresh() { setDocs(getTaxDocs().filter(d => d.userId === user!.id)) }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const doc: TaxDoc = {
        id: crypto.randomUUID(),
        userId: user!.id,
        filename: file.name,
        type: file.type,
        url: reader.result as string,
        uploadedAt: new Date().toISOString(),
      }
      saveTaxDoc(doc)
      refresh()
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
    reader.readAsDataURL(file)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this document?')) return
    deleteTaxDoc(id)
    refresh()
  }

  function handleView(doc: TaxDoc) {
    const win = window.open()
    if (win) {
      win.document.write(`<html><body style="margin:0"><iframe src="${doc.url}" width="100%" height="100%" style="border:none" /></body></html>`)
    }
  }

  function getFileIcon(type: string) {
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    return '📎'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tax Documents</h1>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-sm text-gray-600">
        Accepted formats: PDF, JPG, PNG, GIF. Store your SARS documents, clearance certificates, and import/export permits here.
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {docs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileArchive className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No documents uploaded</p>
            <p className="text-sm">Upload your tax and customs documents for safekeeping</p>
            <button onClick={() => fileRef.current?.click()} className="mt-4 btn-primary text-sm py-2 px-4">
              <Upload className="w-4 h-4" /> Upload First Document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-4">
                <div className="text-2xl">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">{doc.filename}</div>
                  <div className="text-xs text-gray-400">{doc.type} · Uploaded {format(new Date(doc.uploadedAt), 'dd MMM yyyy, HH:mm')}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleView(doc)} className="flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-medium">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
