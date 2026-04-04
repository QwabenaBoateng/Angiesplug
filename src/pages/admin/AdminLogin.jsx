import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldAlert, ShieldCheck, Eye, EyeOff, Terminal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // HARDCODED ADMIN CREDENTIALS OVERRIDE
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin123') {
      setUser({
        id: 'admin-override',
        email: 'admin@gmail.com',
        user_metadata: { role: 'admin', first_name: 'Admin', last_name: 'User' }
      })
      setTimeout(() => {
        setIsLoading(false)
        navigate('/admin')
      }, 500)
      return
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (loginError) {
        setError(loginError.message)
      } else if (data.user) {
        // Verify admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut()
          setError('Access Denied: Administrative Clearance Required.')
          setIsLoading(false)
          return
        }

        setUser(data.user)
        navigate('/admin')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError('System integrity error. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden font-mono">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-xl glass-card rounded-[3rem] overflow-hidden border-white/5 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-blue-600 to-indigo-600"></div>
        
        <div className="p-8 sm:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl border border-white/10 mb-6 shadow-2xl relative group">
              <Terminal className="text-blue-500 group-hover:scale-110 transition-transform" size={40} />
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-red-600 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">ADMIN <span className="text-blue-500">NEXUS</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Restricted Administrative Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Admin Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-glass pl-12 border-white/5 bg-white/2 hover:bg-white/5"
                  placeholder="admin@exquisite.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-glass pl-12 pr-12 border-white/5 bg-white/2 hover:bg-white/5"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-in fade-in zoom-in duration-300 flex items-center space-x-3">
                <ShieldAlert className="text-red-500 shrink-0" size={16} />
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black tracking-[0.2em] text-xs hover:bg-blue-500 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>INITIALIZE OVERRIDE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-white/5 pt-8">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] leading-loose">
              SYSTEM AUTO-LOGS ALL ACCESS ATTEMPTS.<br />
              UNAUTHORIZED ENTRY IS STRICLY PROHIBITED.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
