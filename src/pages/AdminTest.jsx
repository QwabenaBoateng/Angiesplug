import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const AdminTest = () => {
  const { user } = useStore()
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log('AdminTest: Checking admin access...')
      console.log('AdminTest: User:', user)
      
      if (!user) {
        console.log('AdminTest: No user, redirecting to login')
        navigate('/login')
        return
      }

      try {
        // Get user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        console.log('AdminTest: Profile:', profile)
        console.log('AdminTest: Profile error:', error)

        if (error) {
          console.log('AdminTest: Error fetching profile:', error)
          navigate('/login')
          return
        }

        setUserProfile(profile)

        if (profile?.role !== 'admin') {
          console.log('AdminTest: User is not admin, role:', profile?.role)
          navigate('/')
          return
        }

        console.log('AdminTest: Admin access granted')
        setIsLoading(false)
      } catch (error) {
        console.error('AdminTest: Error:', error)
        navigate('/login')
      }
    }

    checkAdminAccess()
  }, [user, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Test Page</h1>
          
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>✅ Admin Access Granted!</strong>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">User Information:</h2>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Role:</strong> {userProfile?.role}</p>
            </div>
            
            <div className="bg-blue-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
              <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Not configured'}</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Admin Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTest
