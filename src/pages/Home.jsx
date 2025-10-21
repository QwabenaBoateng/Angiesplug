import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Heart, Play } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [promoContent, setPromoContent] = useState({
    promo_image: '/api/placeholder/400/300',
    promo_video: '',
    promo_video_poster: '',
    promo_title: 'FIND YOUR PERFECT LOOK AT ANGIE\'S PLUG',
    promo_description: 'Discover exclusive streetwear that sets you apart from the crowd. From fresh drops to limited editions, we curate the hottest pieces that define your unique style. No basic fits, just pure drip.',
    promo_discount_text: 'SALES AND DISCOUNT!',
    promo_discount_percentage: '87%',
    promo_button_text: 'FIND THE STORE',
    promo_button_link: '/shop',
    promo_video_button_text: 'SHOP NOW →',
    promo_video_button_link: '/shop'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock data
        const mockBrands = [
          {
            id: 1,
            name: 'Brand 1',
            image_url: '/api/placeholder/400/500',
            description: 'Premium fashion brand'
          },
          {
            id: 2,
            name: 'Brand 2', 
            image_url: '/api/placeholder/400/500',
            description: 'Luxury accessories'
          },
          {
            id: 3,
            name: 'Brand 3',
            image_url: '/api/placeholder/400/500',
            description: 'Casual wear specialist'
          },
          {
            id: 4,
            name: 'Brand 4',
            image_url: '/api/placeholder/400/500',
            description: 'Footwear excellence'
          }
        ]
        setBrands(mockBrands)
        setIsLoading(false)
        return
      }

      // Fetch promotional content
      const { data: promoData } = await supabase
        .from('promotional_section')
        .select('*')
        .single()

      if (promoData) {
        setPromoContent(promoData)
      }
      
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

      // Fetch brands
      const { data: brandsData } = await supabase
        .from('brands')
        .select('*')
        .limit(4)

      setFeaturedProducts(featured || [])
      setCategories(categoriesData || [])
      setBrands(brandsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      // Fallback to mock brands on error
      const mockBrands = [
        {
          id: 1,
          name: 'Brand 1',
          image_url: '/api/placeholder/400/500',
          description: 'Premium fashion brand'
        },
        {
          id: 2,
          name: 'Brand 2', 
          image_url: '/api/placeholder/400/500',
          description: 'Luxury accessories'
        },
        {
          id: 3,
          name: 'Brand 3',
          image_url: '/api/placeholder/400/500',
          description: 'Casual wear specialist'
        },
        {
          id: 4,
          name: 'Brand 4',
          image_url: '/api/placeholder/400/500',
          description: 'Footwear excellence'
        }
      ]
      setBrands(mockBrands)
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

  const BrandCard = ({ brand }) => (
    <div className="relative rounded-lg overflow-hidden group">
      <img
        src={brand.image_url}
        alt={brand.name}
        className="w-full h-96 object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
        <div className="p-6 text-white">
          <h3 className="text-3xl font-bold mb-4">{brand.name.toUpperCase()}</h3>
          <Link to="/shop" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            SHOP NOW
          </Link>
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


      {/* Featured Looks */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FEATURED LOOKS</h2>
            <p className="text-lg text-gray-600">Discover our curated collection of stylish outfits</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="h-80 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image_urls?.[0] || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-full h-80 object-cover"
                      />
                    </Link>
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description || 'Complete look for any occasion'}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-gray-900">₵{product.price}</span>
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
              ))}
            </div>
          )}
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
                    src={promoContent.promo_image}
                    alt="Angie's Plug"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {promoContent.promo_title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {promoContent.promo_description}
                  </p>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">{promoContent.promo_discount_text}</p>
                    <p className="text-4xl font-bold text-gray-900">{promoContent.promo_discount_percentage}</p>
                  </div>
                  <Link to={promoContent.promo_button_link}>
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      {promoContent.promo_button_text}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Winter Collection Video */}
            <div className="relative rounded-lg overflow-hidden">
              {promoContent.promo_video ? (
                <video
                  src={promoContent.promo_video}
                  poster={promoContent.promo_video_poster}
                  className="w-full h-64 object-cover"
                  controls
                />
              ) : (
                <img
                  src="/api/placeholder/600/400"
                  alt=""
                  className="w-full h-64 object-cover"
                />
              )}
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
                <Link to={promoContent.promo_video_button_link}>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center">
                    {promoContent.promo_video_button_text}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">BRANDS</h2>
            <p className="text-lg text-gray-600">Discover our featured brand partners</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="h-96 bg-gray-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default Home
