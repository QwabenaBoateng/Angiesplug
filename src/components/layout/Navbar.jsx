import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { supabase } from '../../lib/supabase'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, cart, setLoading } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Debug user state for troubleshooting
  console.log('Navbar - User state:', user ? 'authenticated' : 'not authenticated')

  // Hide search icon on specific pages
  const hideSearchIcon = ['/shop', '/catalog', '/contact', '/about'].includes(location.pathname)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery('')
    }
  }

  return (
    <nav className="nav-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Exquisite <span className="text-blue-500">Boutique</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Shop', 'Catalog', 'About', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm tracking-wide relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-5">
            {/* Search */}
            {!hideSearchIcon && (
              <button 
                onClick={handleSearchToggle}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Search size={20} />
              </button>
            )}

            {/* User */}
            <Link 
              to={user ? "/profile" : "/login"} 
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title={user ? "Go to Profile" : "Login"}
            >
              <User size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-slate-950">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="py-6 border-t border-slate-800/50 glass">
            <div className="max-w-2xl mx-auto px-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Search size={20} />
                </div>
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-gradient px-4 py-2 text-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-slate-800/50 glass animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-2 px-2">
              {['Home', 'Shop', 'Catalog', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-slate-300 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
