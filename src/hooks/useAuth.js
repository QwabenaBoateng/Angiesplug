import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export const useAuth = () => {
  const { user, setUser, setLoading } = useStore()
  const [userProfile, setUserProfile] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('useAuth: fetchUserProfile called, user:', user)
      
      if (!user) {
        console.log('useAuth: No user, setting defaults')
        setUserProfile(null)
        setPermissions([])
        setIsLoading(false)
        return
      }

      try {
        console.log('useAuth: Fetching profile for user:', user.id)
        
        // Fetch user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('useAuth: Error fetching profile:', profileError)
          setUserProfile(null)
          setPermissions([])
        } else {
          console.log('useAuth: Profile loaded:', profile)
          setUserProfile(profile)

          // Fetch user permissions
          const { data: userPermissions, error: permError } = await supabase
            .from('role_permissions')
            .select(`
              permissions (
                name,
                description
              )
            `)
            .eq('role', profile.role)

          if (permError) {
            console.error('useAuth: Error fetching permissions:', permError)
            setPermissions([])
          } else {
            const permissionNames = userPermissions.map(p => p.permissions.name)
            console.log('useAuth: Permissions loaded:', permissionNames)
            setPermissions(permissionNames)
          }
        }
      } catch (error) {
        console.error('useAuth: Error in fetchUserProfile:', error)
        setUserProfile(null)
        setPermissions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  const hasPermission = (permission) => {
    return permissions.includes(permission)
  }

  const hasRole = (role) => {
    return userProfile?.role === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(userProfile?.role)
  }

  const isAdmin = () => {
    return hasAnyRole(['admin', 'super_admin'])
  }

  const isSuperAdmin = () => {
    return hasRole('super_admin')
  }

  const canManageUsers = () => {
    return hasPermission('manage_roles') || isSuperAdmin()
  }

  return {
    user,
    userProfile,
    permissions,
    isLoading,
    hasPermission,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    canManageUsers
  }
}
