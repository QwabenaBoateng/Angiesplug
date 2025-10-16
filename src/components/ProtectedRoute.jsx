import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  superAdminOnly = false,
  requiredPermission = null 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const { user } = useStore()
  const { userProfile, hasPermission, isAdmin, isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        navigate('/login')
        return
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/login')
        return
      }

      // Wait for user profile to load
      if (!userProfile) {
        return // Still loading
      }

      // Check role-based access
      if (superAdminOnly && !isSuperAdmin()) {
        navigate('/')
        return
      }

      if (adminOnly && !isAdmin()) {
        navigate('/')
        return
      }

      // Check permission-based access
      if (requiredPermission && !hasPermission(requiredPermission)) {
        navigate('/')
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [adminOnly, superAdminOnly, requiredPermission, userProfile, isAdmin, isSuperAdmin, hasPermission, navigate])

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

