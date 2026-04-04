import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .order('created_at', { ascending: false })

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        totalUsers: usersCount || 0
      })

      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            products (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentOrders(recentOrdersData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, colorClass, borderClass, change }) => (
    <div className={`bg-slate-900/60 backdrop-blur-3xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 rounded-3xl p-6 relative overflow-hidden group shadow-[0_0_30px_-10px_rgba(0,0,0,0.4)]`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity ${colorClass}`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-slate-900/50 flex items-center justify-center border ${borderClass}`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
          {change && (
            <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">
              <TrendingUp className="h-3 w-3" />
              <span className="text-[10px] font-black tracking-widest">{change}</span>
            </div>
          )}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 h-36 flex items-center justify-center">
               <div className="w-8 h-8 rounded-full border-t-2 border-blue-500 animate-spin"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      
      {/* Page Header Header */}
      <div>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
          SYSTEM <span className="text-blue-500">OVERVIEW</span>
        </h1>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Live metrics and operational intelligence
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Inventory"
          value={stats.totalProducts}
          icon={Package}
          colorClass="text-blue-500 bg-blue-500"
          borderClass="border-blue-500/30 text-blue-500"
          change="+12%"
        />
        <StatCard
          title="Dispatched Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          colorClass="text-indigo-400 bg-indigo-400"
          borderClass="border-indigo-400/30 text-indigo-400"
          change="+8%"
        />
        <StatCard
          title="Gross Revenue"
          value={`₵${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          colorClass="text-emerald-400 bg-emerald-400"
          borderClass="border-emerald-400/30 text-emerald-400"
          change="+24%"
        />
        <StatCard
          title="Registered Clients"
          value={stats.totalUsers}
          icon={Users}
          colorClass="text-purple-400 bg-purple-400"
          borderClass="border-purple-400/30 text-purple-400"
          change="+3%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Panel: Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">
              Recent <span className="text-blue-500">Operations</span>
            </h2>
            <Link
              to="/admin/orders"
              className="group flex items-center text-[10px] font-black text-slate-400 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              View Full Log
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/30">
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white-[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-xs font-black text-white tracking-widest bg-white/5 px-2 py-1 rounded">
                          {order.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-white">{order.email.split('@')[0]}</div>
                        <div className="text-[10px] text-slate-500">{order.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-blue-400 tracking-wider">
                          ₵{order.total_amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {order.status === 'completed' && <span className="inline-flex px-3 py-1 text-[10px] font-black rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">Completed</span>}
                        {order.status === 'shipped' && <span className="inline-flex px-3 py-1 text-[10px] font-black rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">In Transit</span>}
                        {order.status === 'processing' && <span className="inline-flex px-3 py-1 text-[10px] font-black rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">Processing</span>}
                        {order.status === 'pending' && <span className="inline-flex px-3 py-1 text-[10px] font-black rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-widest">Pending</span>}
                        {!['completed','shipped','processing','pending'].includes(order.status) && (
                          <span className="inline-flex px-3 py-1 text-[10px] font-black rounded-lg bg-white/5 text-slate-400 border border-white/10 uppercase tracking-widest">{order.status}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                     <tr>
                       <td colSpan="5" className="py-12 text-center text-slate-500 text-sm font-black tracking-widest uppercase">
                         No operations recorded
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel: Quick Directives */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">
            Quick <span className="text-indigo-400">Directives</span>
          </h2>
          
          <div className="space-y-4">
            <Link to="/admin/products" className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 hover:border-blue-500/30 transition-all rounded-2xl p-5 flex items-center group block">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-widest uppercase">Inventory Config</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Deploy or modify products</p>
              </div>
            </Link>
            
            <Link to="/admin/categories" className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 hover:border-indigo-500/30 transition-all rounded-2xl p-5 flex items-center group block">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-widest uppercase">Taxonomy</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Manage categories & logic</p>
              </div>
            </Link>

            <div className="bg-indigo-500/5 backdrop-blur-3xl border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden mt-8">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-[30px]"></div>
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 relative z-10">System Status</h3>
              <p className="text-sm font-bold text-slate-300 relative z-10 leading-relaxed">
                All infrastructure components are functioning optimally. No anomalies detected in payload processing.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
