import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Megaphone,
  Building2,
  ShieldCheck
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useStore()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setUser(null)
      navigate('/')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'About Page', href: '/admin/about', icon: FileText },
    { name: 'Promotions', href: '/admin/promotional', icon: Megaphone },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Brands', href: '/admin/brands', icon: Building2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin' // exact match for dashboard
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-blue-500/30 font-sans">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-white/5 h-full">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto no-scrollbar">
            <div className="flex-shrink-0 flex items-center px-6">
               <ShieldCheck className="w-6 h-6 text-blue-500 mr-3" />
               <h1 className="text-lg font-black italic tracking-tighter text-white uppercase">
                 EXQUISITE <span className="text-blue-500">ADMIN</span>
               </h1>
            </div>
            <nav className="mt-8 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                      active
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-4 h-5 w-5 ${active ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 fixed inset-y-0 z-20">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-xl border-r border-white/5">
            <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto no-scrollbar">
              <div className="flex items-center flex-shrink-0 px-8 mb-8">
                <ShieldCheck className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                    EXQUISITE
                  </h1>
                  <span className="text-[10px] text-blue-500 font-black tracking-[0.3em] uppercase block mt-1">Admin Panel</span>
                </div>
              </div>
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-4 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        active
                          ? 'bg-blue-500/10 text-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20'
                          : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <Icon className={`mr-4 h-5 w-5 transition-colors ${active ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-white/5 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full group px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <LogOut className="h-5 w-5 text-red-500/70 group-hover:text-red-500 transition-colors" />
                <span className="ml-4 text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 transition-all">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-2 mr-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-black text-white italic tracking-tighter uppercase hidden sm:block">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
              >
                <Home className="w-4 h-4 mr-2 text-blue-500" />
                View Store
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
           {/* Decorative Background Elements */}
           <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
           <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
           
           <div className="relative z-10 w-full">
             {children}
           </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
