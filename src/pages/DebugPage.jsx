import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const DebugPage = () => {
  const { user } = useStore()
  const [session, setSession] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)

        if (session?.user) {
          // Get user profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (!error) {
            setUserProfile(profile)
          }
        }
      } catch (error) {
        console.error('Debug error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Information</h1>
          
          <div className="space-y-6">
            <div className="bg-blue-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Environment</h2>
              <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
              <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Not configured'}</p>
              <p><strong>Supabase URL Value:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
            </div>

            <div className="bg-green-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Store User</h2>
              <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
            </div>

            <div className="bg-yellow-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Supabase Session</h2>
              <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
            </div>

            <div className="bg-purple-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">User Profile</h2>
              <pre className="text-sm">{JSON.stringify(userProfile, null, 2)}</pre>
            </div>

            <div className="bg-red-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Admin Access Check</h2>
              <p><strong>Is Admin:</strong> {userProfile?.role === 'admin' ? 'Yes' : 'No'}</p>
              <p><strong>Role:</strong> {userProfile?.role || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugPage
