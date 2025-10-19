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
      console.log('ProtectedRoute: Checking auth for adminOnly:', adminOnly)
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        console.log('ProtectedRoute: Supabase not configured, redirecting to login')
        navigate('/login')
        return
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('ProtectedRoute: Session:', session ? 'exists' : 'none')
      
      if (!session) {
        console.log('ProtectedRoute: No session, redirecting to login')
        navigate('/login')
        return
      }

      // Wait for user profile to load
      if (!userProfile) {
        console.log('ProtectedRoute: User profile still loading...')
        return // Still loading
      }

      console.log('ProtectedRoute: User profile loaded:', userProfile.role)

      // Check role-based access
      if (superAdminOnly && !isSuperAdmin()) {
        console.log('ProtectedRoute: Super admin access denied')
        navigate('/')
        return
      }

      if (adminOnly && !isAdmin()) {
        console.log('ProtectedRoute: Admin access denied, user role:', userProfile.role)
        navigate('/')
        return
      }

      // Check permission-based access
      if (requiredPermission && !hasPermission(requiredPermission)) {
        console.log('ProtectedRoute: Permission access denied')
        navigate('/')
        return
      }

      console.log('ProtectedRoute: Access granted')
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

