import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { supabase } from '../../lib/supabase'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, cart, setLoading } = useStore()
  const navigate = useNavigate()

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
    navigate('/')
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
            <Link to="/contact" className="text-black hover:text-gray-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <button className="text-black hover:text-gray-600 transition-colors">
              <Search size={20} />
            </button>

            {/* User */}
            <Link to={user ? "/profile" : "/login"} className="text-black hover:text-gray-600 transition-colors">
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
