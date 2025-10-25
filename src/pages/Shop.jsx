import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List, Star } from 'lucide-react'
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
    // Handle search from URL params
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
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock data
        const mockProducts = [
          // Ladies Wear
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
            name: 'Floral Maxi Dress',
            price: 89.99,
            image: '/api/placeholder/300/400',
            category: 'Ladies Wear',
            rating: 4.5,
            description: 'Beautiful floral maxi dress for any occasion.'
          },
          // Mens Wear
          {
            id: 5,
            name: 'Classic Men\'s Shirt',
            price: 69.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.5,
            description: 'High-quality cotton shirt for any occasion.'
          },
          {
            id: 6,
            name: 'Men\'s Formal Suit',
            price: 299.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.9,
            description: 'Premium formal suit for business and special events.'
          },
          {
            id: 7,
            name: 'Men\'s Casual Pants',
            price: 89.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.4,
            description: 'Comfortable and stylish casual pants.'
          },
          {
            id: 8,
            name: 'Men\'s Polo Shirt',
            price: 49.99,
            image: '/api/placeholder/300/400',
            category: 'Mens Wear',
            rating: 4.6,
            description: 'Classic polo shirt for casual wear.'
          },
          // Accessories
          {
            id: 9,
            name: 'Designer Handbag',
            price: 149.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.7,
            description: 'Elegant handbag perfect for any occasion.'
          },
          {
            id: 10,
            name: 'Fashionable Scarf',
            price: 39.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.6,
            description: 'Stylish scarf to complete your look.'
          },
          {
            id: 11,
            name: 'Leather Belt',
            price: 49.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.8,
            description: 'Premium leather belt for men and women.'
          },
          {
            id: 12,
            name: 'Statement Necklace',
            price: 79.99,
            image: '/api/placeholder/300/400',
            category: 'Accessories',
            rating: 4.5,
            description: 'Beautiful statement necklace to elevate your style.'
          },
          // Footwear
          {
            id: 13,
            name: 'Women\'s High Heels',
            price: 119.99,
            image: '/api/placeholder/300/400',
            category: 'Footwear',
            rating: 4.7,
            description: 'Elegant high heels for special occasions.'
          },
          {
            id: 14,
            name: 'Men\'s Dress Shoes',
            price: 159.99,
            image: '/api/placeholder/300/400',
            category: 'Footwear',
            rating: 4.8,
            description: 'Classic leather dress shoes for formal wear.'
          },
          {
            id: 15,
            name: 'Women\'s Sneakers',
            price: 89.99,
            image: '/api/placeholder/300/400',
            category: 'Footwear',
            rating: 4.6,
            description: 'Comfortable sneakers for everyday wear.'
          },
          {
            id: 16,
            name: 'Men\'s Casual Boots',
            price: 129.99,
            image: '/api/placeholder/300/400',
            category: 'Footwear',
            rating: 4.5,
            description: 'Stylish casual boots for any season.'
          }
        ]
        
        // Apply search filter to mock data
        let filteredProducts = mockProducts
        if (searchQuery) {
          filteredProducts = mockProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        setProducts(filteredProducts)
        setIsLoading(false)
        return
      }

      let query = supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      // Apply price range filter
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1])
      }

      // Apply sorting
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
      priceRange: [0, 1000],
      size: '',
      color: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    setSearchQuery('')
  }

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image_urls?.[0] || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.categories?.name}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-black">
              ₵{product.price}
            </span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.8</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              addToCart(product)
            }}
            className="w-full mt-4 btn-primary"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  )

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6 hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <img
          src={product.image_urls?.[0] || '/placeholder-image.jpg'}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
      </Link>
      <div className="flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary-600">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-2">{product.categories?.name}</p>
        <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-black">₵{product.price}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.8</span>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="btn-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const CategoryCard = ({ category }) => (
    <Link 
      to={`/catalog?category=${category.slug}`}
      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={category.image_url || '/api/placeholder/400/400'}
          alt={category.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.error('Category image failed to load:', category.image_url)
            e.target.src = '/api/placeholder/400/400'
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
          {category.name.toUpperCase()}
        </h3>
        <p className="text-white/90 text-sm">
          Shop {category.name.toLowerCase()}
        </p>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  handleFilterChange('sortBy', sortBy)
                  handleFilterChange('sortOrder', sortOrder)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Sections */}
        <div className="space-y-16">
          {/* Ladies Wear Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ladies Wear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton for Ladies Wear products
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Display first 4 Ladies Wear products
                products
                  .filter(product => 
                    product.categories?.name === 'Ladies Wear' || 
                    product.category === 'Ladies Wear'
                  )
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          </div>

          {/* Mens Wear Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mens Wear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton for Mens Wear products
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Display first 4 Mens Wear products
                products
                  .filter(product => 
                    product.categories?.name === 'Mens Wear' || 
                    product.category === 'Mens Wear'
                  )
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          </div>

          {/* Accessories Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton for Accessories products
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Display first 4 Accessories products
                products
                  .filter(product => 
                    product.categories?.name === 'Accessories' || 
                    product.category === 'Accessories'
                  )
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          </div>

          {/* Footwear Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Footwear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton for Footwear products
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Display first 4 Footwear products
                products
                  .filter(product => 
                    product.categories?.name === 'Footwear' || 
                    product.category === 'Footwear'
                  )
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Filters Sidebar - Hidden by default, can be toggled */}
        {showFilters && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="mr-2"
                  />
                  All Categories
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={filters.category === category.id}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mr-2"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₵{filters.priceRange[0]}</span>
                  <span>₵{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop

