import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Login = () => {
  const navigate = useNavigate()
  const { setLoading, setUser } = useStore()
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

    console.log('Login attempt:', formData.email, formData.password)

    // Check for hardcoded admin credentials
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
      console.log('Admin credentials matched, creating mock user')
      try {
        // Create a mock admin user
        const mockAdminUser = {
          id: 'admin-123',
          email: 'admin@gmail.com',
          user_metadata: {
            role: 'admin',
            first_name: 'Admin',
            last_name: 'User'
          }
        }
        
        // Set the user in the store
        setUser(mockAdminUser)
        setLoading(false)
        console.log('Navigating to admin panel')
        navigate('/admin')
        return
      } catch (error) {
        console.error('Error setting admin user:', error)
        setError('Error setting up admin user')
        setIsLoading(false)
        return
      }
    }

    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setError('Supabase not configured. Use admin@gmail.com / admin for admin access.')
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
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Supabase login error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left Panel - Welcome Section */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Abstract Wave Design */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <path d="M0,150 Q100,50 200,150 T400,150 L400,300 L0,300 Z" fill="url(#gradient1)" />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center mr-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-white font-bold text-lg">ANGIE'S PLUG</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                Hello, welcome!
              </h1>
              
              <p className="text-white text-lg mb-8 opacity-90">
                Access your admin dashboard to manage products, orders, and customers with ease.
              </p>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg border border-blue-300 transition-colors">
                View more
              </button>
            </div>
          </div>
          
          {/* Right Panel - Login Form */}
          <div className="flex-1 p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Admin Login</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-blue-500 text-blue-500 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>
                
                {/* Sign Up Section */}
                <div className="text-center">
                  <p className="text-blue-600 mb-4">Not a member yet?</p>
                  <Link
                    to="/signup"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 inline-block text-center"
                  >
                    Sign up
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

