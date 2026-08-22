import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, MapPin, Phone, Mail, User, ShieldCheck, ArrowRight, Truck, ChevronLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, user, clearCart } = useStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'GH'
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart')
    }
    
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || ''
      }))
    }
  }, [cart, user, navigate])

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 30
  const tax = subtotal * 0.05
  const total = subtotal + shipping + tax

  const validateForm = () => {
    const newErrors = {}
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'Required'
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Required'
    if (!shippingInfo.email.trim()) newErrors.email = 'Required'
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Required'
    if (!shippingInfo.address.trim()) newErrors.address = 'Required'
    if (!shippingInfo.city.trim()) newErrors.city = 'Required'
    if (!shippingInfo.state.trim()) newErrors.state = 'Required'
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'Required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsProcessing(true)
    
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          email: shippingInfo.email,
          shipping_address: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country,
            phone: shippingInfo.phone
          },
          total_amount: total,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.selectedSize,
        color: item.selectedColor
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and redirect
      clearCart()
      navigate(`/order-confirmation/${order.id}`)
      
    } catch (error) {
      console.error('Error creating order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors mb-12 uppercase text-[10px] font-black tracking-widest">
          <ChevronLeft size={16} />
          <span>Review Cart Selection</span>
        </Link>
        
        <div className="mb-16">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Deployment Terminal</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            SECURE <span className="text-gradient">CHECKOUT</span>
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Step 1: Destination */}
            <div className="glass-card rounded-[3rem] p-8 sm:p-12 border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin size={120} className="text-blue-500" />
              </div>
              
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <MapPin size={20} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter text-slate-900">01. <span className="text-blue-500">DESTINATION</span> INTEL</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">First Name</label>
                  <input
                    type="text"
                    value={shippingInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`input-glass ${errors.firstName ? 'border-red-500/50' : ''}`}
                    placeholder="Identify as..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Last Name</label>
                  <input
                    type="text"
                    value={shippingInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`input-glass ${errors.lastName ? 'border-red-500/50' : ''}`}
                    placeholder="Identify as..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Intel Email</label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input-glass ${errors.email ? 'border-red-500/50' : ''}`}
                    placeholder="address@nexus.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Comm Link (Phone)</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`input-glass ${errors.phone ? 'border-red-500/50' : ''}`}
                    placeholder="+233..."
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Base Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`input-glass ${errors.address ? 'border-red-500/50' : ''}`}
                    placeholder="Sector, Street, Building"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">City / District</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`input-glass ${errors.city ? 'border-red-500/50' : ''}`}
                    placeholder="Location"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Region</label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`input-glass ${errors.state ? 'border-red-500/50' : ''}`}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Digital Code</label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={`input-glass ${errors.zipCode ? 'border-red-500/50' : ''}`}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="glass-card rounded-[3rem] p-8 sm:p-12 border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                <CreditCard size={120} className="text-indigo-500" />
              </div>
              
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter text-slate-900">02. <span className="text-indigo-500">SETTLEMENT</span> PROTOCOL</h2>
              </div>
              
              <div className="space-y-6">
                <label className="flex items-center p-6 rounded-[2rem] border-2 transition-all cursor-pointer group bg-black/5 border-slate-200 hover:border-indigo-500/30">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Digital Credit Card</span>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-black/5 rounded flex items-center justify-center text-[8px] font-black">VISA</div>
                        <div className="w-8 h-5 bg-black/5 rounded flex items-center justify-center text-[8px] font-black">MASTERCARD</div>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure encrypted transmission</p>
                  </div>
                </label>
                
                <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10">
                  <p className="text-xs font-bold text-slate-600 italic">
                    Note: Payment processing is isolated and encrypted. The production gateway (Stripe/Paystack) will be activated for live transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[3rem] p-8 sm:p-10 sticky top-24 border-slate-200 shadow-2xl overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-all"></div>
               
              <div className="flex items-center space-x-4 mb-10">
                <ShieldCheck className="text-blue-500" size={24} />
                <h2 className="text-2xl font-black italic tracking-tighter">SUMMARY <span className="text-blue-500">INTEL</span></h2>
              </div>
              
              {/* Mini Cart Feed */}
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto no-scrollbar pr-2 border-b border-slate-200 pb-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 group-hover:border-blue-500/30 transition-all">
                      <img
                        src={item.image_urls?.[0] || item.image || '/placeholder-image.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-900 uppercase truncate tracking-widest leading-none mb-1">
                        {item.name}
                      </p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                        {item.selectedSize && `SZ: ${item.selectedSize}`} • QTY: {item.quantity}
                      </p>
                      <p className="text-[10px] font-black text-blue-500 mt-1">₵{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-lg font-black text-slate-900 tracking-tighter">₵{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2">
                    <Truck size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Priority Shipping</span>
                  </div>
                  <span className={`text-lg font-black tracking-tighter ${shipping === 0 ? 'text-blue-500' : 'text-slate-900'}`}>
                    {shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between items-end pb-8 border-b border-slate-200">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service Tax (5%)</span>
                  <span className="text-lg font-black text-slate-900 tracking-tighter">₵{tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Total Mission Cost</span>
                    <span className="text-4xl font-black text-blue-500 tracking-tighter">₵{total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-gradient w-full py-5 text-sm font-black tracking-[0.2em] flex items-center justify-center space-x-4 shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    <span>{isProcessing ? 'TERMINATING TRANSACTION...' : 'AUTHORIZE PROCUREMENT'}</span>
                    <ArrowRight size={20} />
                  </button>
                  
                  <div className="mt-8 flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2 grayscale opacity-50">
                      <ShieldCheck size={14} className="text-blue-500" />
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">SSL Encrypted Deployment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
