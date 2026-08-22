import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw, ShoppingBag, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const { addToCart } = useStore()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      
      const { data: productData } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .eq('id', id)
        .single()

      if (productData) {
        setProduct(productData)
        
        // Fetch related products
        const { data: related } = await supabase
          .from('products')
          .select(`
            *,
            categories (name)
          `)
          .eq('category_id', productData.category_id)
          .neq('id', id)
          .limit(4)
        
        setRelatedProducts(related || [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    
    setIsAddingToCart(true)
    
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    }
    
    addToCart(cartItem, quantity)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAddingToCart(false)
    
    alert('Product added to cart!')
  }

  const RelatedProductCard = ({ product }) => (
    <div className="glass-card rounded-[2rem] overflow-hidden group border-slate-200 hover:border-blue-500/20 transition-all duration-500">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            src={product.image_urls?.[0] || product.image || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-md">
              NEW DROP
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-black text-lg text-slate-900 tracking-tighter uppercase truncate mb-1">{product.name}</h3>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-4">
            {product.categories?.name || 'EXQUISITE SELECTION'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              ₵{product.price}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-blue-500 fill-current" />
              <span className="text-[10px] font-black text-slate-600">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 italic uppercase">PRODUCT <span className="text-red-500">OFFLINE</span></h1>
          <p className="text-slate-600 font-bold text-lg mb-12 tracking-tight">The requested item has been delisted or does not exist in our current database.</p>
          <Link to="/shop" className="btn-gradient px-12 py-5 text-sm font-black tracking-[0.2em] inline-block">
            RETURN TO STORE
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-32">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
          <Link to="/shop" className="group inline-flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-colors">
            <div className="w-10 h-10 rounded-full bg-black/5 border border-slate-200 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to catalog</span>
          </Link>
          
          <nav className="glass py-2 px-6 rounded-full border border-slate-200">
            <ol className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest overflow-x-auto no-scrollbar whitespace-nowrap">
              <li><Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">HOME</Link></li>
              <li className="text-slate-700">/</li>
              <li><Link to="/shop" className="text-slate-500 hover:text-slate-900 transition-colors">SHOP</Link></li>
              <li className="text-slate-700">/</li>
              <li className="text-blue-500">{product.categories?.name || 'COLLECTION'}</li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Visual Presentation Section */}
          <div className="space-y-8">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl group">
              <img
                src={product.image_urls?.[selectedImage] || product.image || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              {/* Product Badge */}
              <div className="absolute top-8 left-8">
                <div className="glass px-6 py-3 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">EXQUISITE SELECTION</p>
                </div>
              </div>
            </div>
            
            {/* Gallery Strip */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-blue-500 scale-95' : 'border-slate-200 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage !== index && <div className="absolute inset-0 bg-[#f8f8f6]/40"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Intel Section */}
          <div className="flex flex-col justify-center">
            <div className="mb-10 space-y-4">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] block">In Stock & Verified</span>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{product.name}</h1>
              
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-blue-500 fill-current' : 'text-slate-800'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic underline decoration-blue-500/30">124 Elite Reviews</span>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-baseline space-x-4">
                <span className="text-5xl font-black text-slate-900 tracking-tight italic">₵{product.price}</span>
                <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px] line-through">₵{Math.round(product.price * 1.3)}</span>
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-slate-200 mb-10">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Product Intel</h3>
              <p className="text-slate-700 font-bold text-lg leading-relaxed tracking-tight">
                {product.description || "A masterfully crafted piece designed for those who demand excellence. Every detail is meticulously curated to define modern streetwear luxury."}
              </p>
            </div>

            {/* Configurator */}
            <div className="space-y-10 mb-12">
              {/* Size Select */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Fit</h3>
                  <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-slate-900 transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[4rem] h-14 rounded-2xl border-2 font-black text-xs transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20'
                          : 'border-slate-200 text-slate-500 hover:border-white/20 hover:text-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Select */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Colorway</h3>
                <div className="flex flex-wrap gap-3">
                  {['STELTH BLACK', 'ARCTIC WHITE', 'NEON CRIMSON', 'CYBER BLUE'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 h-12 rounded-2xl border-2 font-black text-[10px] transition-all uppercase tracking-widest ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-slate-200 text-slate-500 hover:border-white/20'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="space-y-4 w-full sm:w-auto">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Batch Size</h3>
                  <div className="flex items-center bg-white rounded-[1.5rem] border border-slate-200 p-1 h-14 w-full sm:w-40">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all active:scale-75"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-10 text-center font-black text-slate-900 text-xl tabular-nums italic">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all active:scale-75"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 w-full space-y-4">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 invisible sm:visible">Action</h3>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedSize}
                    className="btn-gradient w-full py-5 text-sm font-black tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed group h-14"
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
                      <span>{isAddingToCart ? 'TRANSMITTING...' : 'ADD TO SECURE CART'}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mission Critical Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 border-t border-slate-200">
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Truck size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Express <br /> <span className="text-slate-900">Shipping</span></span>
              </div>
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Shield size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Secure Nexus <br /> <span className="text-slate-900">Payments</span></span>
              </div>
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <RotateCcw size={18} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">30-Day Return <br /> <span className="text-slate-900">Guarantee</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Feed (Related) */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-24 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Recommended Drops</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic italic">RELATED <span className="text-gradient">GEAR</span></h2>
              </div>
              <Link to="/shop" className="btn-glass px-8 py-3 text-[10px] font-black tracking-widest uppercase">View All Intelligence</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <RelatedProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
