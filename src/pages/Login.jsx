import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

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

    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setError('System configuration error. Please contact support.')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/profile')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center p-4 selection:bg-[#652d23]/30 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#652d23]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d38b6d]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-5xl glass-card rounded-[3rem] overflow-hidden border-slate-200 shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[650px]">
          {/* Left Panel - Branding */}
          <div className="lg:w-5/12 bg-white border-r border-slate-200 p-12 flex flex-col items-center justify-center text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#652d23]/10 to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-3 mb-12">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#993f2d] to-[#652d23] rounded-2xl flex items-center justify-center shadow-lg shadow-[#652d23]/20">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <span className="text-xl font-semibold tracking-tight ">EXQUISITE <span className="text-[#652d23]">BOUTIQUE</span></span>
              </div>
              
              <h1 className="text-5xl font-semibold tracking-tight mb-6  leading-none">
                WELCOME <br /> <span className="text-gradient">BACK.</span>
              </h1>
              
              <p className="text-slate-600 font-bold text-lg mb-12 tracking-tight">
                Sign in to manage your drops, track orders, and stay connected.
              </p>
              
              <div className="p-6 rounded-[2rem] bg-black/5 border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">Member Perks</p>
                <p className="text-sm font-bold text-slate-700 ">Early Access & 5% Discount on every drop.</p>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Form */}
          <div className="lg:w-7/12 p-12 lg:p-20 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-semibold tracking-tight mb-2 "><span className="text-[#652d23]">LOGIN</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-normal text-[10px]">Secure login</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal pl-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#652d23] transition-colors" size={20} />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-glass pl-12"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal pl-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#652d23] transition-colors" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-glass pl-12 pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${rememberMe ? 'bg-[#652d23]' : 'bg-slate-800 border border-slate-200'}`}></div>
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${rememberMe ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="ml-3 text-xs font-semibold text-slate-600 uppercase tracking-normal group-hover:text-slate-800">Remember Me</span>
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-[#652d23] uppercase tracking-normal hover:text-slate-900 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in zoom-in duration-300">
                    <p className="text-xs font-bold text-red-500 text-center uppercase tracking-normal">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gradient w-full py-5 text-sm font-semibold tracking-[0.2em] shadow-xl shadow-[#652d23]/20 active:scale-[0.98]"
                >
                  {isLoading ? 'LOGGING IN...' : 'SIGN IN'}
                </button>
                
                <div className="mt-8 text-center">
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-normal mb-6">New to the store?</p>
                  <Link
                    to="/signup"
                    className="inline-block w-full py-4 rounded-2xl bg-black/5 border border-slate-200 text-slate-900 font-semibold tracking-[0.2em] text-xs hover:bg-black/5 transition-all uppercase"
                  >
                    Create an Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

