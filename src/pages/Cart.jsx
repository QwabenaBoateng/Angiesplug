import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useStore } from '../store/useStore'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore()

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 30 // Updated shipping for premium boutique
  const tax = subtotal * 0.05 // Simplified tax for boutique
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/5 mb-8 shadow-2xl">
            <ShoppingBag className="w-12 h-12 text-slate-700" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-4 italic">YOUR CART IS <span className="text-blue-500">VOID</span></h1>
          <p className="text-slate-400 font-bold text-lg mb-12 tracking-tight leading-relaxed">
            Looks like you haven't secured any pieces for your collection yet. Start browsing our latest drops.
          </p>
          <Link to="/shop" className="btn-gradient px-12 py-5 text-sm font-black tracking-[0.2em] inline-block">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Secure Procurement</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic leading-none">
              SECURE <span className="text-gradient">CART</span>
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Items In Bundle</p>
              <p className="text-xl font-black text-white">{cart.length} PIECES</p>
            </div>
            <button
              onClick={clearCart}
              className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase"
            >
              Flush Cart
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} 
                className="glass-card rounded-[2.5rem] overflow-hidden group border-white/5 hover:border-blue-500/20 transition-all duration-500"
              >
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
                  {/* Item Image */}
                  <div className="relative w-full sm:w-40 aspect-square rounded-[1.5rem] overflow-hidden flex-shrink-0 group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all">
                    <img
                      src={item.image_urls?.[0] || item.image || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4">
                      <h3 className="text-2xl font-black text-white tracking-tighter truncate group-hover:text-blue-500 transition-colors">
                        {item.name.toUpperCase()}
                      </h3>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {item.categories?.name || item.category || 'EXQUISITE SELECTION'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                      {item.selectedSize && (
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          SIZE: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          COLOR: {item.selectedColor}
                        </span>
                      )}
                    </div>
                    
                    <div className="pt-4 flex items-center justify-center sm:justify-start space-x-6">
                      <p className="text-2xl font-black text-white tracking-tighter">
                        ₵{item.price}
                      </p>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full">
                        AVAILABLE STOCK
                      </p>
                    </div>
                  </div>
                  
                  {/* Quantity & Actions */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-6 sm:pl-8 sm:border-l border-white/5 w-full sm:w-auto">
                    <div className="flex items-center bg-slate-900 rounded-2xl border border-white/5 p-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-10 text-center font-black text-white text-lg tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:bg-red-500 hover:text-white hover:border-transparent transition-all transition-colors active:scale-90"
                      title="Remove Piece"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[3rem] p-8 sm:p-10 sticky top-32 border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-all"></div>
              
              <div className="flex items-center space-x-4 mb-10">
                <ShieldCheck className="text-blue-500" size={24} />
                <h2 className="text-2xl font-black italic tracking-tighter">SUMMARY <span className="text-blue-500">INTEL</span></h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subtotal Payload</span>
                  <span className="text-xl font-black text-white tracking-tighter">₵{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2">
                    <Truck size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Priority Shipping</span>
                  </div>
                  <span className={`text-xl font-black tracking-tighter ${shipping === 0 ? 'text-blue-500' : 'text-white'}`}>
                    {shipping === 0 ? 'COMPLIMENTARY' : `₵${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service Tax (5%)</span>
                  <span className="text-xl font-black text-white tracking-tighter">₵{tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-8 mt-4 border-t border-white/5">
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Total Mission Cost</span>
                    <span className="text-4xl font-black text-white tracking-tighter text-blue-500">₵{total.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <Link
                      to="/checkout"
                      className="btn-gradient w-full py-5 text-sm font-black tracking-[0.2em] flex items-center justify-center space-x-4 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                    >
                      <span>PROCEED TO SECURE CHECKOUT</span>
                      <ArrowRight size={20} />
                    </Link>
                    
                    <Link
                      to="/shop"
                      className="w-full btn-glass py-5 text-sm font-black tracking-[0.2em] block text-center uppercase"
                    >
                      Continue Collection
                    </Link>
                  </div>
                </div>
              </div>
              
              {subtotal < 50 && (
                <div className="mt-8 p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-loose">
                    SECURE ₵{(50 - subtotal).toFixed(2)} MORE FOR <br /> <span className="text-white">COMPLIMENTARY SHIPPING</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
