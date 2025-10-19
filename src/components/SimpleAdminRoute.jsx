import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const SimpleAdminRoute = ({ children }) => {
  const { user } = useStore()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAccess = async () => {
      console.log('SimpleAdminRoute: Starting access check')
      
      // Check if user exists in store
      if (!user) {
        console.log('SimpleAdminRoute: No user in store, redirecting to login')
        navigate('/login')
        return
      }

      try {
        // Get current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('SimpleAdminRoute: Session error:', sessionError)
          navigate('/login')
          return
        }

        if (!session) {
          console.log('SimpleAdminRoute: No session, redirecting to login')
          navigate('/login')
          return
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('SimpleAdminRoute: Profile error:', profileError)
          navigate('/login')
          return
        }

        console.log('SimpleAdminRoute: User role:', profile?.role)

        if (profile?.role !== 'admin') {
          console.log('SimpleAdminRoute: User is not admin, redirecting to home')
          navigate('/')
          return
        }

        console.log('SimpleAdminRoute: Admin access granted')
        setIsAuthorized(true)
      } catch (error) {
        console.error('SimpleAdminRoute: Error:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [user, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
}

export default SimpleAdminRoute
