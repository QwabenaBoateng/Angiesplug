import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Package, Edit, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Profile = () => {
  const { user, setUser } = useStore()
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchOrders()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_urls)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-64 bg-gray-50 p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5 mr-3" />
                  Order History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <button className="flex items-center text-primary-600 hover:text-primary-700">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">
                            {user.user_metadata?.first_name || 'Not provided'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">
                            {user.user_metadata?.last_name || 'Not provided'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">{user.email}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-900">
                            {profile?.username || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          profile?.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {profile?.role === 'admin' ? 'Administrator' : 'Customer'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                      <Link to="/shop" className="btn-primary">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order.id.slice(-8)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${order.total_amount}
                              </p>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.order_items?.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4 py-3 border-t border-gray-100">
                                <img
                                  src={item.products?.image_urls?.[0] || '/placeholder-image.jpg'}
                                  alt={item.products?.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item.products?.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                    {item.size && ` • Size: ${item.size}`}
                                    {item.color && ` • Color: ${item.color}`}
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  ₵{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Shipping Address:</span>
                              <span className="text-right">
                                {order.shipping_address?.firstName} {order.shipping_address?.lastName}<br />
                                {order.shipping_address?.address}<br />
                                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

