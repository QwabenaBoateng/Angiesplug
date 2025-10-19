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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-black">Angie's Plug</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-gray-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-black hover:text-gray-600 transition-colors font-medium">
              Shop
            </Link>
            <Link to="/catalog" className="text-black hover:text-gray-600 transition-colors font-medium">
              Catalog
            </Link>
            <Link to="/about" className="text-black hover:text-gray-600 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-black hover:text-gray-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Search - Hidden on specific pages */}
            {!hideSearchIcon && (
              <button 
                onClick={handleSearchToggle}
                className="text-black hover:text-gray-600 transition-colors"
              >
                <Search size={20} />
              </button>
            )}

            {/* User */}
            <Link 
              to={user ? "/profile" : "/login"} 
              className="text-black hover:text-gray-600 transition-colors"
              title={user ? "Go to Profile" : "Login"}
            >
              <User size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-black hover:text-gray-600 transition-colors">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-black hover:text-gray-600"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Form */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200 bg-white">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-black hover:text-gray-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-black hover:text-gray-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/catalog"
                className="text-black hover:text-gray-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link
                to="/about"
                className="text-black hover:text-gray-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-black hover:text-gray-600 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
