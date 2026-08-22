import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Package, Edit, LogOut, ShieldCheck, ChevronRight, ShoppingBag, Clock } from 'lucide-react'
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
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-32">
       {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Personal Dossier</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            MEMBER <span className="text-gradient">TERMINAL</span>
          </h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Dashboard Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="glass-card rounded-[3rem] p-8 border-slate-200 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              
              {/* User Avatar Placeholder */}
              <div className="mb-8 text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] mx-auto mb-4 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-[1.9rem] bg-[#f8f8f6] flex items-center justify-center font-black text-3xl text-slate-900 italic">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-slate-900 font-black tracking-tight text-xl truncate px-2">{profile?.username || user?.email?.split('@')[0]}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Verified Member</p>
              </div>
              
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all group/item ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-black/5 border border-slate-200 text-slate-600 hover:bg-black/5 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-4" />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Profile Intel</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${activeTab === 'profile' ? 'rotate-0' : '-rotate-90 opacity-0 group-hover/item:opacity-100 group-hover/item:rotate-0'}`} />
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all group/item ${
                    activeTab === 'orders'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-black/5 border border-slate-200 text-slate-600 hover:bg-black/5 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-4" />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Order History</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${activeTab === 'orders' ? 'rotate-0' : '-rotate-90 opacity-0 group-hover/item:opacity-100 group-hover/item:rotate-0'}`} />
                </button>
                
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="w-full flex items-center px-6 py-4 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-indigo-500/5 group/item"
                  >
                    <ShieldCheck className="w-5 h-5 mr-4" />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Admin Nexus</span>
                  </Link>
                )}
                
                <div className="pt-8 mt-4 border-t border-slate-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-6 py-4 rounded-[1.5rem] bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group/logout"
                  >
                    <LogOut className="w-5 h-5 mr-4 transition-transform group-hover/logout:-translate-x-1" />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Abort Session</span>
                  </button>
                </div>
              </nav>
            </div>
            
            {/* Mission Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="glass-card rounded-[2rem] p-6 text-center border-slate-200">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Loyalty Tier</p>
                <p className="text-lg font-black text-blue-500 italic">ELITE</p>
              </div>
              <div className="glass-card rounded-[2rem] p-6 text-center border-slate-200">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Drops</p>
                <p className="text-lg font-black text-slate-900 italic">{orders.length}</p>
              </div>
            </div>
          </div>
          
          {/* Content Viewer */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card rounded-[3rem] p-8 sm:p-14 border-slate-200 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">PROFILE <span className="text-blue-500">ANALYSIS</span></h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Core account credentials</p>
                  </div>
                  <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-black/5 border border-slate-200 text-xs font-black uppercase tracking-widest hover:bg-black/5 transition-all text-slate-700">
                    <Edit size={14} className="text-blue-500" />
                    <span>Modify Data</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Codename: First</label>
                    <div className="flex items-center p-5 bg-black/5 border border-slate-200 rounded-[1.5rem] group hover:border-blue-500/20 transition-all">
                      <User className="w-5 h-5 text-blue-500 mr-4 opacity-50" />
                      <span className="text-lg font-black text-slate-900 tracking-tight">
                        {user.user_metadata?.first_name || 'UNDEFINED'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Codename: Last</label>
                    <div className="flex items-center p-5 bg-black/5 border border-slate-200 rounded-[1.5rem] group hover:border-blue-500/20 transition-all">
                      <User className="w-5 h-5 text-blue-500 mr-4 opacity-50" />
                      <span className="text-lg font-black text-slate-900 tracking-tight">
                        {user.user_metadata?.last_name || 'UNDEFINED'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Secure Link (Email)</label>
                    <div className="flex items-center p-5 bg-black/5 border border-slate-200 rounded-[1.5rem] group hover:border-blue-500/20 transition-all">
                      <Mail className="w-5 h-5 text-indigo-500 mr-4 opacity-50" />
                      <span className="text-lg font-black text-slate-900 tracking-tight truncate">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Network Handle</label>
                    <div className="flex items-center p-5 bg-black/5 border border-slate-200 rounded-[1.5rem] group hover:border-blue-500/20 transition-all">
                      <span className="w-5 h-5 flex items-center justify-center text-blue-500 mr-4 font-black">@</span>
                      <span className="text-lg font-black text-slate-900 tracking-tight">
                        {profile?.username || 'GUEST_USER'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 pt-12 border-t border-slate-200">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-4">Clearance Level</label>
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600/10 border border-blue-500/20">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-3"></span>
                     <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] italic">
                       {profile?.role === 'admin' ? 'Strategic Administrator' : 'Verified Community Member'}
                     </span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center space-x-6 mb-12 ml-4">
                  <div className="w-px h-12 bg-blue-500"></div>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">ORDER <span className="text-gradient leading-tight">HISTORY</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Archive of all past secure acquisitions</p>
                  </div>
                </div>
                  
                {orders.length === 0 ? (
                  <div className="glass-card rounded-[3rem] p-16 text-center border-slate-200">
                    <Package className="w-24 h-24 text-slate-800 mx-auto mb-8 stroke-[1px]" />
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">ARCHIVE <span className="text-blue-500">NULL</span></h3>
                    <p className="text-slate-600 font-bold text-lg mb-12 tracking-tight">You haven't initiated any procurements yet. The catalog is waiting.</p>
                    <Link to="/shop" className="btn-gradient px-10 py-5 text-xs font-black tracking-[0.2em] inline-block uppercase">
                      Start Collection
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => (
                      <div key={order.id} className="glass-card rounded-[3rem] overflow-hidden border-slate-200 hover:border-blue-500/20 transition-all duration-500 group">
                        <div className="p-8 sm:p-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                            <div className="flex items-center space-x-6">
                              <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-blue-500 border border-slate-200">
                                <ShoppingBag size={24} />
                              </div>
                              <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">
                                  ORDER #{order.id.slice(-8).toUpperCase()}
                                </h3>
                                <div className="flex items-center space-x-3 mt-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    ESTABLISHED {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-baseline md:items-end flex-col">
                              <p className="text-3xl font-black text-slate-900 tracking-tighter italic mb-2">
                                ₵{order.total_amount.toFixed(2)}
                              </p>
                              <span className={`inline-flex px-4 py-1 text-[8px] font-black rounded-full uppercase tracking-widest border transition-colors ${
                                order.status === 'completed'
                                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                  : order.status === 'shipped'
                                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                  : 'bg-black/5 text-slate-600 border-slate-200'
                              }`}>
                                {order.status} Protocol
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {order.order_items?.map((item, index) => (
                              <div key={index} className="flex items-center space-x-6 py-4 border-t border-slate-200 group/item">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 group-hover/item:border-blue-500/20 transition-all">
                                  <img
                                    src={item.products?.image_urls?.[0] || item.product_image || '/placeholder-image.jpg'}
                                    alt={item.products?.name}
                                    className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-lg font-black text-slate-900 tracking-tighter uppercase truncate mb-1">
                                    {item.products?.name}
                                  </h4>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    QTY: {item.quantity}
                                    {item.size && ` • SIZE: ${item.size}`}
                                    {item.color && ` • COLOR: ${item.color}`}
                                  </p>
                                </div>
                                <p className="text-xl font-black text-slate-900 tracking-tighter italic">
                                  ₵{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          {/* Shipping Summary */}
                          <div className="mt-8 pt-8 border-t border-slate-200 bg-white/2 rounded-[2rem] p-6 border-slate-200">
                            <div className="flex flex-col sm:flex-row justify-between text-xs font-bold gap-4">
                              <div className="flex space-x-3 text-slate-500">
                                <MapPin size={14} className="text-blue-500 shrink-0" />
                                <span className="uppercase tracking-widest text-[10px]">Transmission Point:</span>
                              </div>
                              <span className="text-right text-slate-600 uppercase tracking-widest text-[10px] leading-relaxed">
                                {order.shipping_address?.firstName} {order.shipping_address?.lastName}<br />
                                {order.shipping_address?.address}, {order.shipping_address?.city}<br />
                                {order.shipping_address?.state}, {order.shipping_address?.zipCode}
                              </span>
                            </div>
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
  )
}

export default Profile
