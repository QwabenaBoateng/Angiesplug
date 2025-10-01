import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { user } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      if (adminOnly) {
        // Check if user has admin role (handle both mock and real users)
        if (user.user_metadata?.role === 'admin') {
          // Mock admin user or real admin user
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }

        // Check Supabase for real admin users
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
          navigate('/')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          navigate('/')
          return
        }
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [user, adminOnly, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
}

export default ProtectedRoute

