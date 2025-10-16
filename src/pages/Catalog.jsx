import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, Star, Heart, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams] = useSearchParams()
  const { addToCart } = useStore()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    
    // Handle search from URL params
    const search = searchParams.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock data
        const mockProducts = [
          {
            id: 1,
            name: 'Elegant Evening Dress',
            price: 129.99,
            image: '/api/placeholder/300/400',
            category: 'Ladies Wear',
            rating: 4.8,
            description: 'Beautiful evening dress perfect for special occasions.'
          },
          {
            id: 2,
            name: 'Casual Summer Dress',
            price: 79.99,
            image: '/api/placeholder/300/400',
            category: 'Ladies Wear',
            rating: 4.6,
            description: 'Light and comfortable summer dress for everyday wear.'
          },
          {
            id: 3,
            name: 'Professional Blouse',
            price: 59.99,
            image: '/api/placeholder/300/400',
            category: 'Ladies Wear',
            rating: 4.7,
            description: 'Stylish blouse perfect for office or casual wear.'
          },
          {
            id: 4,
            name: 'Classic Men\'s Shirt',
            price: 69.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.5,
            description: 'High-quality cotton shirt for any occasion.'
          },
          {
            id: 5,
            name: 'Men\'s Formal Suit',
            price: 299.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.9,
            description: 'Premium formal suit for business and special events.'
          },
          {
            id: 6,
            name: 'Men\'s Casual Pants',
            price: 89.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.4,
            description: 'Comfortable and stylish casual pants.'
          },
          {
            id: 7,
            name: 'Designer Handbag',
            price: 149.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.7,
            description: 'Elegant handbag perfect for any occasion.'
          },
          {
            id: 8,
            name: 'Fashionable Scarf',
            price: 39.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.6,
            description: 'Stylish scarf to complete your look.'
          },
          {
            id: 9,
            name: 'Leather Belt',
            price: 49.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.8,
            description: 'Premium leather belt for men and women.'
          },
          {
            id: 10,
            name: 'Statement Necklace',
            price: 79.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.5,
            description: 'Beautiful statement necklace to elevate your style.'
          }
        ]
        setProducts(mockProducts)
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock categories
        const mockCategories = [
          { id: 1, name: 'Ladies Wear', slug: 'ladies-wear' },
          { id: 2, name: 'Mens Wear', slug: 'mens-wear' },
          { id: 3, name: 'Accessories', slug: 'accessories' }
        ]
        setCategories(mockCategories)
        return
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const filteredProducts = products.filter(product => {
    const productCategoryName = product.category || product.categories?.name || ''
    const matchesCategory = selectedCategory === 'all' || productCategoryName === selectedCategory
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesPrice && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const ProductCard = ({ product }) => {
    const imageSrc = product.image || product.image_urls?.[0] || '/placeholder-image.jpg'
    const rating = product.rating || 4.8
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative">
          <Link to={`/product/${product.id}`}>
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform"
            />
          </Link>
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-1">{product.categories?.name || product.category}</p>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-gray-900">₵{product.price}</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{rating}</span>
            </div>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-80 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Catalog</h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of fashion items
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    All Products
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={selectedCategory === category.name}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₵{priceRange.min}</span>
                    <span>₵{priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {sortedProducts.length} products
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalog
