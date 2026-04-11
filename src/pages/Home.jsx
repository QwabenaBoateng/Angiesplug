import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Heart, Play } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [promoContent, setPromoContent] = useState({
    promo_image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
    promo_video: '',
    promo_video_poster: '',
    promo_title: 'FIND YOUR PERFECT LOOK AT EXQUISITE BOUTIQUE',
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
    <div className="glass-card rounded-2xl overflow-hidden group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_urls?.[0] || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">
            {product.categories?.name || 'Featured'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black text-white">
            ₵{product.price}
          </span>
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold ml-1 text-slate-400">4.8</span>
          </div>
        </div>
        <button className="w-full btn-gradient py-2 text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  )

  const CategoryCard = ({ category, image, isLarge = false }) => (
    <div className={`relative overflow-hidden rounded-2xl group cursor-pointer ${isLarge ? 'row-span-2' : ''}`}>
      <img
        src={image}
        alt={category.name}
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLarge ? 'h-96' : 'h-48'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end">
        <div className="p-6 w-full">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-2 block">Collection</span>
          <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors leading-none">{category.name.toUpperCase()}</h3>
          {isLarge && (
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-xs text-slate-300 mb-4 font-medium">EXPLORE OUR LATEST CURATED PIECES</p>
              <button className="btn-glass text-xs py-2 px-4">
                DISCOVER MORE
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
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full animate-pulse-slow"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">New Season Drops</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter text-white">
                BUY. <span className="text-gradient">CONNECT.</span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-lg font-medium leading-relaxed">
                Experience the next generation of streetwear marketplace. Curated by creators, for the community. Find your perfect fit at Exquisite Boutique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="btn-gradient text-center py-4 px-12 text-sm font-black tracking-widest uppercase shadow-xl shadow-blue-500/20 active:scale-[0.98]">
                  Start Shopping Now
                </Link>
              </div>
            </div>
            
            {/* Visual Element */}
            <div className="hidden lg:block relative animate-in fade-in zoom-in duration-1000">
              <div className="relative z-10 animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
                  alt="Hero Look" 
                  className="rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white/5"
                />
                {/* Floating Cards */}
                <div className="absolute -right-12 top-1/4 glass p-4 rounded-2xl shadow-2xl border border-white/10 animate-float" style={{ animationDelay: '-2s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white small">E</div>
                    <div>
                      <p className="text-xs font-bold text-white">New Drop</p>
                      <p className="text-[10px] text-slate-400">2 mins ago</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-12 bottom-1/4 glass p-5 rounded-2xl shadow-2xl border border-white/10 animate-float" style={{ animationDelay: '-1s' }}>
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[10px] font-bold text-white">"Best quality ever!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Looks */}
      <section className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-3 block">Top Picks</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">FEATURED <span className="text-gradient">LOOKS</span></h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-blue-400 hover:text-white transition-colors flex items-center space-x-2">
              <span>View Marketplace</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl aspect-[3/4] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Sections */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Exquisite Boutique Promotional */}
            <div className="glass-card rounded-[2rem] overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="relative h-64 md:h-full">
                  <img
                    src={promoContent.promo_image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800'}
                    alt="Exquisite Boutique Promotional"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-600/20"></div>
                </div>
                <div className="p-10 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 block">Exclusive Offer</span>
                  <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                    {promoContent.promo_title}
                  </h2>
                  <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">
                    {promoContent.promo_description}
                  </p>
                  <div className="mb-8 flex items-baseline space-x-2">
                    <span className="text-5xl font-black text-white">{promoContent.promo_discount_percentage}</span>
                    <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Off Now</span>
                  </div>
                  <Link to={promoContent.promo_button_link}>
                    <button className="btn-gradient w-full">
                      {promoContent.promo_button_text}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Winter Collection Video */}
            <div className="relative rounded-[2rem] overflow-hidden group">
              {promoContent.promo_video ? (
                <video
                  src={promoContent.promo_video}
                  poster={promoContent.promo_video_poster}
                  className="w-full h-full object-cover min-h-[400px]"
                  controls
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
                  alt=""
                  className="w-full h-full object-cover min-h-[400px] transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-300 group">
                  <Play className="w-8 h-8 text-white fill-white group-hover:text-blue-400 group-hover:fill-blue-400" />
                </button>
              </div>
              <div className="absolute bottom-10 left-10 right-10 flex flex-col sm:flex-row justify-between items-end gap-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-2 block">Campaign</span>
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Exquisite <br /> Lifestyle</h3>
                </div>
                <Link to={promoContent.promo_video_button_link}>
                  <button className="btn-glass px-8">
                    {promoContent.promo_video_button_text}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-3 block">Global Partners</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">OUR <span className="text-gradient">BRANDS</span></h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl aspect-[3/4] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {brands.map((brand) => (
                <div key={brand.id} className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:bg-blue-600/5 transition-colors">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={brand.image_url} 
                      alt={brand.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-white mb-2">{brand.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{brand.description || 'Verified Partner'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default Home
