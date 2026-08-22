import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, Star, Heart, Search, ShoppingCart, User, Shirt, Watch, Footprints, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams] = useSearchParams()
  
  const { searchQuery, setSearchQuery, addToCart } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceMax, setPriceMax] = useState(5000)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    const search = searchParams.get('search')
    if (search) setSearchQuery(search)
    
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy, priceMax])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name')
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        const mockProducts = [
          { id: 1, name: 'Elegant Evening Dress', price: 129.99, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400', category: 'Ladies Wear', rating: 4.8 },
          { id: 2, name: 'Casual Summer Dress', price: 79.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400', category: 'Ladies Wear', rating: 4.6 },
          { id: 3, name: 'Professional Blouse', price: 59.99, image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=400', category: 'Ladies Wear', rating: 4.7 },
          { id: 4, name: 'Modern Streetwear Hoodie', price: 89.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400', category: 'Mens Wear', rating: 4.5 },
          { id: 5, name: 'Classic Denim Jacket', price: 119.99, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=400', category: 'Mens Wear', rating: 4.9 },
          { id: 6, name: 'Premium Leather Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400', category: 'Accessories', rating: 4.8 },
          { id: 7, name: 'Urban Sneakers', price: 149.99, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400', category: 'Footwear', rating: 4.7 }
        ]
        
        let filtered = mockProducts
        if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory || p.categories?.name === selectedCategory)
        filtered = filtered.filter(p => p.price <= priceMax)
        
        setProducts(filtered)
        setIsLoading(false)
        return
      }

      let query = supabase.from('products').select('*, categories(name)')
      if (searchQuery) query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      if (selectedCategory !== 'all') query = query.eq('category_id', selectedCategory)
      query = query.lte('price', priceMax)
      
      const { data } = await query
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const categoryIcons = {
    'Ladies Wear': User,
    'Mens Wear': Shirt,
    'Accessories': Watch,
    'Footwear': Footprints
  }

  const ProductCard = ({ product }) => (
    <div className="glass-card rounded-[2rem] overflow-hidden group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_urls?.[0] || product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/40 hover:bg-blue-500 transition-all active:scale-90"
          >
            <ShoppingCart size={20} />
          </button>
          <button className="p-3 bg-black/5 backdrop-blur-xl rounded-2xl text-slate-900 hover:bg-black/10 transition-all active:scale-90 border border-slate-200">
            <Heart size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {product.categories?.name || product.category || 'Exquisite Exclusive'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tight">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">₵{product.price}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Available Now</span>
          </div>
          <div className="flex items-center text-amber-400">
            <Star size={14} className="fill-current mr-1" />
            <span className="text-sm font-bold text-slate-600">4.8</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f8f6] overflow-hidden">
      {/* Catalog Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-600/10 blur-[110px] rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Our Collection</span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 italic">
            CATA<span className="text-gradient">LOG</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-white/60 border border-slate-200 backdrop-blur-2xl rounded-[2rem] p-2 pr-4 shadow-2xl">
              <div className="pl-6 text-slate-500">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search the collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-900 px-6 py-4 focus:ring-0 text-lg placeholder:text-slate-600"
              />
              <button className="btn-gradient px-6 py-3 text-xs">Search</button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Category Chips */}
        <div className="mb-16 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-4 min-w-max pb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all border ${selectedCategory === 'all' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-transparent text-slate-900 shadow-xl shadow-blue-500/20 scale-105' : 'bg-black/5 border-slate-200 text-slate-600 hover:bg-black/5'}`}
            >
              <Grid size={18} />
              <span>Full Catalog</span>
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || Grid
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all border ${selectedCategory === category.name ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-transparent text-slate-900 shadow-xl shadow-blue-500/20 scale-105' : 'bg-black/5 border-slate-200 text-slate-600 hover:bg-black/5'}`}
                >
                  <Icon size={18} />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all border ${showFilters ? 'bg-blue-600 text-white border-transparent' : 'bg-black/5 border-slate-200 text-slate-700 hover:bg-black/5'}`}
          >
            <Filter size={18} />
            <span>Refine Search</span>
          </button>
          
          <div className="flex items-center bg-black/5 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Grid size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><List size={18} /></button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-12 glass-card rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Max Price (₵)</h4>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-black/5 rounded-full appearance-none mb-4"
            />
            <div className="flex justify-between text-blue-400 font-black text-xl">
              <span>₵0</span>
              <span>₵{priceMax}</span>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-[2rem] aspect-[3/4] animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-black/5 rounded-[3rem] border border-slate-200">
              <Search size={48} className="mx-auto text-slate-700 mb-6" />
              <h3 className="text-2xl font-black text-slate-900">No items found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or category choice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Catalog
