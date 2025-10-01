import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Heart, Play } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch featured products
      const { data: featured } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .eq('featured', true)
        .limit(8)

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .limit(6)

      setFeaturedProducts(featured || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_urls?.[0] || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </Link>
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.categories?.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₵{product.price}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">MRP INCLUSIVE OF ALL TAXES</p>
      </div>
    </div>
  )

  const CategoryCard = ({ category, image, isLarge = false }) => (
    <div className={`relative overflow-hidden rounded-lg group cursor-pointer ${isLarge ? 'row-span-2' : ''}`}>
      <img
        src={image}
        alt={category.name}
        className={`w-full object-cover transition-transform group-hover:scale-105 ${isLarge ? 'h-96' : 'h-48'}`}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
        <div className="p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{category.name.toUpperCase()}</h3>
          {isLarge && (
            <div className="mb-4">
              <p className="text-sm mb-2">OPEN WITH BUY AND APPLY CODE GET OFFERS</p>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                DISCOVER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wider">
              IN THE RIGHT OUTFIT
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-wider">
              ANYTHING IS POSSIBLE
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors border border-black text-center">
                COLLECTIONS
              </Link>
              <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-center">
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
        </div>
      </section>

      {/* Featured Looks */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FEATURED LOOKS</h2>
            <p className="text-lg text-gray-600">Discover our curated collection of stylish outfits</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Featured Look 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src="/api/placeholder/300/400"
                  alt="Featured Look 1"
                  className="w-full h-80 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Stylish Outfit</h3>
                <p className="text-gray-600 text-sm mb-3">Complete look for any occasion</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">₵89.99</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Featured Look 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src="/api/placeholder/300/400"
                  alt="Featured Look 2"
                  className="w-full h-80 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Elegant Ensemble</h3>
                <p className="text-gray-600 text-sm mb-3">Perfect for special events</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">₵129.99</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.9</span>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Featured Look 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src="/api/placeholder/300/400"
                  alt="Featured Look 3"
                  className="w-full h-80 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Casual Chic</h3>
                <p className="text-gray-600 text-sm mb-3">Comfortable yet fashionable</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">₵79.99</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.7</span>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Featured Look 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src="/api/placeholder/300/400"
                  alt="Featured Look 4"
                  className="w-full h-80 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Trendy Set</h3>
                <p className="text-gray-600 text-sm mb-3">Latest fashion trends</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">₵99.99</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.6</span>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Angie's Plug Collections */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative">
                  <img
                    src="/api/placeholder/400/300"
                    alt="Angie's Plug"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <h3 className="text-2xl font-bold text-red-600">Angie's Plug</h3>
                  </div>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    FIND YOUR PERFECT LOOK AT ANGIE'S PLUG
                    <br />
                    
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">SALES AND DISCOUNT!</p>
                    <p className="text-4xl font-bold text-gray-900">87%</p>
                  </div>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    FIND THE STORE
                  </button>
                </div>
              </div>
            </div>

            {/* Winter Collection Video */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="/api/placeholder/600/400"
                alt=""
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <button className="bg-white bg-opacity-20 rounded-full p-4 hover:bg-opacity-30 transition-colors">
                  <Play className="w-8 h-8 text-white" />
                </button>
              </div>
              <div className="absolute top-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2"> </h3>
                <p className="text-sm"> ANGIE'S PLUG </p>
              </div>
              <div className="absolute bottom-6 right-6">
                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center">
                  SHOP NOW
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gender Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Men */}
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="/api/placeholder/400/500"
                alt="Men's Collection"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-3xl font-bold mb-4">MEN</h3>
                  <Link to="/shop" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>

            {/* Women */}
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="/api/placeholder/400/500"
                alt="Women's Collection"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-3xl font-bold mb-4">WOMEN</h3>
                  <Link to="/shop" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="/api/placeholder/400/500"
                alt="Accessories Collection"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-3xl font-bold mb-4">ACCESSORIES</h3>
                  <Link to="/shop" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>

            {/* Footwear */}
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="/api/placeholder/400/500"
                alt="Footwear Collection"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-3xl font-bold mb-4">FOOTWEAR</h3>
                  <button className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed" disabled>
                    COMING SOON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
