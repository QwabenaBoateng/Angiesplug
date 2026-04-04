import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Crown,
  User,
  Search,
  Filter,
  X,
  Fingerprint
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const UserManagement = () => {
  const { userProfile, isSuperAdmin, hasPermission, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    role: 'user'
  })

  useEffect(() => {
    if (userProfile?.role === 'admin' || userProfile?.role === 'super_admin') {
      fetchUsers()
    }
  }, [userProfile])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userForm.full_name,
            role: userForm.role
          })
          .eq('id', editingUser.id)

        if (error) throw error
      } else {
        const { error } = await supabase.auth.admin.inviteUserByEmail(
          userForm.email,
          {
            data: {
              full_name: userForm.full_name,
              role: userForm.role
            }
          }
        )

        if (error) throw error
      }

      setShowModal(false)
      setEditingUser(null)
      setUserForm({ email: '', full_name: '', role: 'user' })
      fetchUsers()
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error saving user. Please try again.')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setUserForm({
      email: user.email,
      full_name: user.full_name,
      role: user.role
    })
    setShowModal(true)
  }

  const handleDelete = async (userId) => {
    if (!confirm('WARNING: Deleting personnel access is irreversible. Proceed?')) return

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-amber-500" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-slate-500" />
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      super_admin: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      user: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded border ${styles[role]}`}>
        {getRoleIcon(role)}
        <span className="ml-2">{role.replace('_', ' ')}</span>
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mb-4"></div>
        <p className="text-xs font-black tracking-widest uppercase text-amber-500">Decrypting Access Logs...</p>
      </div>
    )
  }

  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'super_admin')) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <Shield className="w-24 h-24 text-rose-500 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-black italic tracking-tighter text-rose-500 uppercase">ACCESS DENIED</h2>
        <p className="text-xs font-black text-rose-400/70 tracking-widest uppercase mt-2 max-w-md">
          Insufficient clearance. You require Administrative authorization to view personnel logs.
        </p>
        <div className="mt-8 px-6 py-3 bg-red-500/5 my-2 border border-rose-500/10 rounded-xl inline-block">
           <p className="text-[10px] font-black tracking-widest text-white uppercase">Detected Clearance Level: <span className="text-rose-500">{userProfile?.role || 'UNKNOWN'}</span></p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            PERSONNEL <span className="text-amber-500">ACCESS LOGS</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Administer roles, clearance, and accounts</p>
        </div>
        {(isSuperAdmin() || hasPermission('create_users')) && (
          <button
            onClick={() => {
              setEditingUser(null)
              setUserForm({ email: '', full_name: '', role: 'user' })
              setShowModal(true)
            }}
            className="mt-4 sm:mt-0 btn-gradient shadow-amber-500/20 from-amber-600 to-amber-800 flex items-center justify-center text-[10px] sm:text-xs tracking-widest uppercase"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Provision Access
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-2">
              Identity Search
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Query by nomenclature or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-2">
              Clearance Level
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm appearance-none"
            >
              <option value="" className="bg-slate-950">Global Array</option>
              <option value="user" className="bg-slate-950">Standard Agent (User)</option>
              <option value="admin" className="bg-slate-950">Administrator</option>
              <option value="super_admin" className="bg-slate-950">Prime Directive (Super Admin)</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('')
                setRoleFilter('')
              }}
              className="w-full btn-glass flex items-center justify-center text-xs tracking-widest uppercase"
            >
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              Flush Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/30">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Personnel Identity
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Clearance Level
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Initialization Date
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Directives
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white-[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center">
                        <Fingerprint className="w-6 h-6 text-slate-600 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-white tracking-wide">
                          {user.full_name || 'UNVERIFIED ENTITY'}
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                       {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {(isSuperAdmin() || hasPermission('update_users')) && (
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 border border-transparent hover:border-blue-500/20 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {isSuperAdmin() && user.id !== userProfile?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                   <td colSpan="4" className="py-12 text-center text-slate-500 text-sm font-black tracking-widest uppercase">
                     No personnel active under current parameters
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Users size={120} className="text-amber-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                   <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                     {editingUser ? 'MODIFY ' : 'PROVISION '} <span className="text-amber-500">ACCESS</span>
                   </h3>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {!editingUser && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                    Network Address (Email) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                    placeholder="agent@exquisite.boutique"
                  />
                </div>
              )}

               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                  Nomenclature (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userForm.full_name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                  placeholder="Subject Full Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                  Authorization Clearance <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm appearance-none"
                >
                  <option value="user" className="bg-slate-950">Standard Agent (User)</option>
                  <option value="admin" className="bg-slate-950">Administrator</option>
                  {isSuperAdmin() && <option value="super_admin" className="bg-slate-950">Prime Directive (Super Admin)</option>}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="btn-gradient shadow-amber-500/20 from-amber-600 to-amber-800 text-[10px] sm:text-xs tracking-widest uppercase"
                >
                  {editingUser ? 'CONFIRM MODIFICATION' : 'DISPATCH INVITATION'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default UserManagement
