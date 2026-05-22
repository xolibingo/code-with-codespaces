import React, { useState } from 'react'
import { Box, Plus, Pencil, Trash2, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getInventory, saveInventoryItem, deleteInventoryItem } from '../../lib/storage'
import { InventoryItem } from '../../types'
import { format } from 'date-fns'

const EMPTY_FORM = { name: '', quantity: 1, value: 0, notes: '' }

export default function DashboardInventory() {
  const { user } = useAuth()
  const [items, setItems] = useState<InventoryItem[]>(() => user ? getInventory(user.id) : [])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  if (!user) return null

  function refresh() { setItems(getInventory(user!.id)) }

  function openAdd() { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true) }
  function openEdit(item: InventoryItem) { setForm({ name: item.name, quantity: item.quantity, value: item.value, notes: item.notes }); setEditItem(item); setShowForm(true) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const item: InventoryItem = {
      id: editItem?.id || crypto.randomUUID(),
      userId: user!.id,
      name: form.name,
      quantity: form.quantity,
      value: form.value,
      notes: form.notes,
      createdAt: editItem?.createdAt || new Date().toISOString(),
    }
    saveInventoryItem(user!.id, item)
    refresh()
    setShowForm(false)
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    deleteInventoryItem(user!.id, id)
    refresh()
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(p => ({ ...p, [name]: type === 'number' ? parseFloat(value) || 0 : value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editItem ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Item Name</label>
                <input name="name" required className="input" value={form.name} onChange={handleChange} placeholder="e.g. Electronics, Clothing" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Quantity</label>
                  <input name="quantity" type="number" min={1} className="input" value={form.quantity} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Value (ZAR)</label>
                  <input name="value" type="number" min={0} className="input" value={form.value} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <input name="notes" className="input" value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary justify-center">{editItem ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No inventory items</p>
            <p className="text-sm">Track items you're planning to ship</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Notes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Added</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm font-semibold">R{item.value.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{item.notes || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{format(new Date(item.createdAt), 'dd MMM yy')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="text-blue-500 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
