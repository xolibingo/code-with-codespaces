import React, { useState } from 'react'
import { Edit2, Trash2, Shield, ShieldOff, UserX, UserCheck, UserPlus, Mail } from 'lucide-react'
import { getUsers, updateUser, deleteUser, saveUser } from '../../lib/storage'
import { addAuditLog } from '../../lib/storage'
import { useAuth } from '../../contexts/AuthContext'
import { User } from '../../types'
import { format } from 'date-fns'

export default function AdminUsers() {
  const { user: adminUser } = useAuth()
  const [users, setUsers] = useState(() => getUsers())
  const [editUser, setEditUser] = useState<User | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [search, setSearch] = useState('')

  function refresh() { setUsers(getUsers()) }

  function handleEdit(u: User) { setEditUser({ ...u }) }

  function handleSaveEdit() {
    if (!editUser) return
    updateUser(editUser)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Updated client ${editUser.email}`, targetType: 'user', targetId: editUser.id, details: `Name: ${editUser.name}, Discount: ${editUser.discount}%` })
    refresh(); setEditUser(null)
  }

  function handleDelete(u: User) {
    if (!confirm(`Delete ${u.email}?`)) return
    deleteUser(u.id)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Deleted user ${u.email}`, targetType: 'user', targetId: u.id, details: '' })
    refresh()
  }

  function handleBlock(u: User) {
    const updated = { ...u, blocked: !u.blocked }
    updateUser(updated)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `${updated.blocked ? 'Blocked' : 'Unblocked'} user ${u.email}`, targetType: 'user', targetId: u.id, details: '' })
    refresh()
  }

  function handleRole(u: User) {
    const newRole = u.role === 'admin' ? 'client' : 'admin'
    const updated = { ...u, role: newRole } as User
    updateUser(updated)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Role changed: ${u.email} → ${newRole}`, targetType: 'user', targetId: u.id, details: `From ${u.role} to ${newRole}` })
    refresh()
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return
    const existing = getUsers().find(u => u.email.toLowerCase() === inviteEmail.toLowerCase())
    if (existing) { alert('Email already registered'); return }
    const newUser: User = {
      id: crypto.randomUUID(), email: inviteEmail, name: 'Invited User', phone: '', country: 'ZA',
      role: 'client', referralCode: Math.random().toString(36).substring(2,10).toUpperCase(),
      discount: 0, createdAt: new Date().toISOString(), blocked: false
    }
    saveUser(newUser)
    addAuditLog({ performedBy: adminUser?.email ?? 'admin', action: `Invited user ${inviteEmail}`, targetType: 'user', targetId: newUser.id, details: '' })
    setInviteEmail(''); setShowInvite(false); refresh()
    alert(`User ${inviteEmail} added. They can log in and set their password.`)
  }

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || u.name.toLowerCase().includes(search.toLowerCase()))

  const cell = 'px-3 py-3 text-sm'
  const th = 'px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide'

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 sm:w-56 px-3 py-2 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
            <UserPlus className="w-4 h-4" /> Invite
          </button>
        </div>
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-orange-400" /> Invite User</h3>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email address" className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowInvite(false)} className="flex-1 py-2 border border-[#2d3348] text-gray-400 rounded-lg text-sm hover:border-gray-500">Cancel</button>
              <button onClick={handleInvite} className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {editUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2"><Edit2 className="w-5 h-5 text-orange-400" /> Edit Client</h3>
            {(['name','phone','country'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">{field}</label>
                <input value={(editUser as unknown as Record<string, string>)[field] || ''} onChange={e => setEditUser(p => p ? ({ ...p, [field]: e.target.value }) : p)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white focus:outline-none focus:border-orange-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Discount (%)</label>
              <input type="number" min={0} max={100} value={editUser.discount}
                onChange={e => setEditUser(p => p ? ({ ...p, discount: parseInt(e.target.value) || 0 }) : p)}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#0f1117] border border-[#2d3348] text-white focus:outline-none focus:border-orange-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditUser(null)} className="flex-1 py-2 border border-[#2d3348] text-gray-400 rounded-lg text-sm">Cancel</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1a1f2e] border border-[#2d3348] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#2d3348]">
              <tr>
                <th className={th}>Name / Email</th>
                <th className={th}>Country</th>
                <th className={th}>Role</th>
                <th className={th}>Discount</th>
                <th className={th}>Status</th>
                <th className={th}>Joined</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3348]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/2">
                  <td className={cell}>
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className={`${cell} text-gray-300`}>{u.country}</td>
                  <td className={cell}>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-orange-900/40 text-orange-400' : 'bg-blue-900/40 text-blue-400'}`}>{u.role}</span>
                  </td>
                  <td className={`${cell} text-gray-300`}>{u.discount > 0 ? <span className="text-green-400">{u.discount}%</span> : '—'}</td>
                  <td className={cell}>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.blocked ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>{u.blocked ? 'Blocked' : 'Active'}</span>
                  </td>
                  <td className={`${cell} text-gray-500 text-xs`}>{format(new Date(u.createdAt), 'dd MMM yy')}</td>
                  <td className={cell}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(u)} title="Edit" className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleRole(u)} title={u.role === 'admin' ? 'Demote' : 'Promote'} className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded transition-colors">{u.role === 'admin' ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}</button>
                      <button onClick={() => handleBlock(u)} title={u.blocked ? 'Unblock' : 'Block'} className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors">{u.blocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}</button>
                      <button onClick={() => handleDelete(u)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No clients found</div>}
      </div>
    </div>
  )
}
