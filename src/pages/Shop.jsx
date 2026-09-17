import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart, User, Shirt, Watch, Footprints, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams] = useSearchParams()
  
  const { searchQuery, filters, setSearchQuery, setFilters, addToCart } = useStore()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams, setSearchQuery])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, filters])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
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
        if (searchQuery) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        if (filters.category) {
          const catName = categories.find(c => c.id === filters.category)?.name
          if (catName) {
            filtered = filtered.filter(p => p.category === catName)
          }
        }
        
        setProducts(filtered)
        setIsLoading(false)
        return
      }

      let query = supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1])
      }

      const sortBy = filters.sortBy || 'created_at'
      const ascending = filters.sortOrder === 'asc'
      query = query.order(sortBy, { ascending })

      const { data } = await query
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 5000],
      size: '',
      color: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    setSearchQuery('')
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
              e.preventDefault()
              addToCart(product)
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
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {product.categories?.name || product.category || 'Exquisite Exclusive'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tight">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold text-slate-900 tracking-tight">₵{product.price}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-normal mt-1">Available Now</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < 4 ? 'fill-current' : 'text-slate-700'} />)}
            </div>
            <span className="text-[10px] font-bold text-slate-600">4.8 (120+ reviews)</span>
          </div>
        </div>
      </div>
    </div>
  )

  const categoryIcons = {
    'Ladies Wear': User,
    'Mens Wear': Shirt,
    'Accessories': Watch,
    'Footwear': Footprints
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] overflow-hidden">
      {/* Marketplace Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Verified Marketplace</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
            MARKET<span className="text-gradient">PLACE</span>
          </h1>
          
          <div className="max-w-3xl mx-auto relative group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-3xl group-focus-within:bg-blue-500/30 transition-all"></div>
            <div className="relative flex items-center bg-white/80 border border-slate-200 backdrop-blur-2xl rounded-[2.5rem] p-2 pr-4 shadow-2xl focus-within:border-blue-500/50 transition-all">
              <div className="pl-6 text-slate-500">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-900 px-6 py-4 focus:ring-0 text-lg placeholder:text-slate-600"
              />
              <button className="btn-gradient px-8 py-3.5 text-sm">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Horizontal Category Slider */}
        <div className="mb-16 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-4 min-w-max pb-4">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all border ${filters.category === '' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-transparent text-slate-900 shadow-xl shadow-blue-500/20 scale-105' : 'bg-black/5 border-slate-200 text-slate-600 hover:bg-black/5 active:scale-95'}`}
            >
              <Grid size={18} />
              <span>All Styles</span>
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || Grid
              return (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange('category', category.id)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all border ${filters.category === category.id ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border-transparent text-slate-900 shadow-xl shadow-blue-500/20 scale-105' : 'bg-black/5 border-slate-200 text-slate-600 hover:bg-black/5 active:scale-95'}`}
                >
                  <Icon size={18} />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all border ${showFilters ? 'bg-blue-600 text-white border-transparent' : 'bg-black/5 border-slate-200 text-slate-700 hover:bg-black/5'}`}
            >
              <Filter size={18} />
              <span>Advanced Filters</span>
            </button>
            
            <div className="flex items-center bg-black/5 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="relative group min-w-[200px]">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                handleFilterChange('sortBy', sortBy)
                handleFilterChange('sortOrder', sortOrder)
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-6 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none pr-12"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <ArrowRight size={16} className="rotate-90" />
            </div>
          </div>
        </div>

        {/* Filters Sidebar */}
        {showFilters && (
          <div className="mb-12 glass-card rounded-3xl p-8 animate-in fade-in slide-in-from-top-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-slate-900">Refine <span className="text-blue-500">Search</span></h3>
              <button onClick={clearFilters} className="text-xs font-bold text-blue-500 uppercase tracking-normal hover:text-slate-900 transition-colors">Reset All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Price Range (₵)</h4>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full accent-blue-500 h-2 bg-black/5 rounded-full appearance-none mb-4"
                />
                <div className="flex justify-between text-slate-600 font-bold text-sm">
                  <span>₵0</span>
                  <span className="text-blue-400 text-lg">₵{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Product Grid */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-[2rem] aspect-[3/4] animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-slate-700" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">No items found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any items matching your search. Try adjusting your filters or searching for something else.</p>
              <button onClick={clearFilters} className="mt-8 btn-glass">Clear Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop

