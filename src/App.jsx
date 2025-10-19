import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'

// Layout components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import OrderConfirmation from './pages/OrderConfirmation'
import Contact from './pages/Contact'
import AboutUs from './pages/AboutUs'
import TestLogin from './pages/TestLogin'

// Admin pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminCategories from './pages/admin/Categories'
import AdminAboutPage from './pages/admin/AboutPage'
import AdminPromotionalSection from './pages/admin/PromotionalSection'
import UserManagement from './pages/admin/UserManagement'

// Protected route component
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { setUser, setLoading } = useStore()

  useEffect(() => {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          
          <Route path="/shop" element={
            <>
              <Navbar />
              <Shop />
              <Footer />
            </>
          } />
          
          <Route path="/catalog" element={
            <>
              <Navbar />
              <Catalog />
              <Footer />
            </>
          } />
          
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <ProductDetail />
              <Footer />
            </>
          } />
          
          <Route path="/cart" element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          } />
          
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          } />
          
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          } />
          
          <Route path="/signup" element={
            <>
              <Navbar />
              <Signup />
              <Footer />
            </>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />
          
          <Route path="/about" element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />
            </>
          } />
          
          <Route path="/order-confirmation/:id" element={
            <>
              <Navbar />
              <OrderConfirmation />
              <Footer />
            </>
          } />
          
          <Route path="/test-login" element={<TestLogin />} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="about" element={<AdminAboutPage />} />
                  <Route path="promotional" element={<AdminPromotionalSection />} />
                  <Route path="users" element={<UserManagement />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
