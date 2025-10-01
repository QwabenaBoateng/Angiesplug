import React from 'react'
import { useStore } from '../store/useStore'

const TestLogin = () => {
  const { user, setUser } = useStore()

  const handleTestLogin = () => {
    const mockAdminUser = {
      id: 'admin-123',
      email: 'admin@gmail.com',
      user_metadata: {
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User'
      }
    }
    
    setUser(mockAdminUser)
    console.log('Test admin user set:', mockAdminUser)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Test Login</h1>
        <p className="mb-4">Current user: {user ? user.email : 'No user'}</p>
        <button 
          onClick={handleTestLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Set Admin User
        </button>
        <div className="mt-4">
          <a href="/admin" className="text-blue-500">Go to Admin Panel</a>
        </div>
      </div>
    </div>
  )
}

export default TestLogin
