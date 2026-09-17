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
          <button className="p-2.5 bg-black/5 backdrop-blur-md rounded-xl text-slate-900 hover:bg-black/10 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-normal bg-blue-500/10 px-2 py-0.5 rounded-md">
            {product.categories?.name || 'Featured'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-semibold text-slate-900">
            ₵{product.price}
          </span>
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold ml-1 text-slate-600">4.8</span>
          </div>
        </div>
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
          <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-blue-400 transition-colors leading-none">{category.name.toUpperCase()}</h3>
          {isLarge && (
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-xs text-slate-700 mb-4 font-medium">EXPLORE OUR LATEST CURATED PIECES</p>
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
      <div className="absolute inset-0 bg-white bg-opacity-40 flex items-end">
        <div className="p-6 text-slate-900">
          <h3 className="text-3xl font-bold mb-4">{brand.name.toUpperCase()}</h3>
          <Link to="/shop" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f8f6] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f8f6] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 bg-[#d38b6d] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-normal">New Season Drops</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold mb-8 leading-none tracking-tight text-white drop-shadow-2xl">
              EXQUISITE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eed1c3] to-[#c56b46]">
                BOUTIQUE
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 mb-12 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Experience the next generation of streetwear. Curated by creators, for the community. Find your perfect fit today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/shop" className="bg-[#652d23] hover:bg-[#7e3627] text-white text-center py-4 px-12 text-sm font-semibold tracking-normal uppercase shadow-xl shadow-[#652d23]/20 active:scale-[0.98] rounded-xl transition-all duration-300">
                Start Shopping Now
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Looks */}
      <section className="py-24 bg-[#f8f8f6] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">FEATURED <span className="text-gradient">LOOKS</span></h2>
            </div>
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
      <section className="py-24 bg-white/30">
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
                  <h2 className="text-3xl font-semibold text-slate-900 mb-4 leading-tight">
                    {promoContent.promo_title}
                  </h2>
                  <p className="text-slate-600 mb-8 text-sm font-medium leading-relaxed">
                    {promoContent.promo_description}
                  </p>
                  <div className="mb-8 flex items-baseline space-x-2">
                    <span className="text-5xl font-semibold text-slate-900">{promoContent.promo_discount_percentage}</span>
                    <span className="text-sm font-bold text-blue-500 uppercase tracking-normal">Off Now</span>
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
              <div className="absolute inset-0 bg-[#f8f8f6]/40 group-hover:bg-[#f8f8f6]/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-black/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform duration-300 group">
                  <Play className="w-8 h-8 text-slate-900 fill-white group-hover:text-blue-400 group-hover:fill-blue-400" />
                </button>
              </div>
              <div className="absolute bottom-10 left-10 right-10 flex flex-col sm:flex-row justify-between items-end gap-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-2 block">Campaign</span>
                  <h3 className="text-4xl font-semibold text-slate-900 tracking-tight uppercase">Exquisite <br /> Lifestyle</h3>
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
      <section className="py-24 bg-[#f8f8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-3 block">Global Partners</span>
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">OUR <span className="text-gradient">BRANDS</span></h2>
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
                    <h3 className="font-bold text-slate-900 mb-2">{brand.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">{brand.description || 'Verified Partner'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Testimonial Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-[#d38b6d] mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#d38b6d]"></span> Testimonial
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">What <span className="text-[#652d23]">Our Clients Say</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border-l-[12px] border-l-[#652d23] relative">
              <div className="absolute top-8 right-8 text-6xl text-slate-100 font-serif leading-none">"</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-full border-4 border-[#e2b19b] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Leslie Alexander" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Leslie Alexander</h4>
                  <p className="text-sm text-slate-500 mb-1">Architecture</p>
                  <div className="flex items-center gap-1 text-[#e2b19b]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                    <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed relative z-10">
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border-l-[12px] border-l-[#652d23] relative">
              <div className="absolute top-8 right-8 text-6xl text-slate-100 font-serif leading-none">"</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-full border-4 border-[#e2b19b] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" alt="Jenny Wilson" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Jenny Wilson</h4>
                  <p className="text-sm text-slate-500 mb-1">Interior Designer</p>
                  <div className="flex items-center gap-1 text-[#e2b19b]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                    <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed relative z-10">
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi."
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-8">
             <div className="w-8 h-2 rounded-full bg-[#652d23]"></div>
             <div className="w-2 h-2 rounded-full bg-slate-200"></div>
             <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </section>

      {/* News & Blogs Section */}
      <section className="py-24 bg-[#f8f8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <span className="text-sm font-bold text-[#d38b6d] mb-3 flex items-center gap-2 block">
                <span className="w-8 h-[2px] bg-[#d38b6d]"></span> News & Blogs
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">Our Latest <br/><span className="text-[#652d23]">News & Blogs</span></h2>
            </div>
            <button className="bg-[#652d23] hover:bg-[#7e3627] text-white px-8 py-3 rounded-xl font-bold transition-colors">
              View All Blogs
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog 1 */}
            <div className="group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" alt="Furniture Trends" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#d38b6d] text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg">
                  15 April 2024
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#652d23] transition-colors leading-tight">Furniture Trends 2024: What's Hot and What's Not</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <span className="text-sm font-bold text-slate-900 border-b-2 border-[#d38b6d] pb-1 uppercase tracking-wider">Read More</span>
            </div>

            {/* Blog 2 */}
            <div className="group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
                <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80" alt="Choosing Perfect Sofa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#d38b6d] text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg">
                  14 April 2024
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#652d23] transition-colors leading-tight">The Ultimate Guide to Choosing the Perfect Sofa</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <span className="text-sm font-bold text-slate-900 border-b-2 border-[#d38b6d] pb-1 uppercase tracking-wider">Read More</span>
            </div>

            {/* Blog 3 */}
            <div className="group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
                <img src="https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80" alt="Dining Table" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#d38b6d] text-white text-xs font-bold py-2 px-4 rounded-lg shadow-lg">
                  12 April 2024
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#652d23] transition-colors leading-tight">Choosing the Right Dining Table for Your Lifestyle</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <span className="text-sm font-bold text-slate-900 border-b-2 border-[#d38b6d] pb-1 uppercase tracking-wider">Read More</span>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-bold text-[#d38b6d] mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-[#d38b6d]"></span> Follow Us
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-12">
            Follow Us On <span className="text-[#652d23]">Instagram</span>
          </h2>
          
          <div className="relative overflow-hidden w-full group/slider mt-8">
            <div className="flex animate-infinite-scroll group-hover/slider:[animation-play-state:paused]">
              {[0, 1].map((set) => (
                <div key={set} className="flex gap-4 pr-4">
                  {[
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1434389678369-182cb144d6a5?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1550614000-4b95d4ed79ea?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1516762204212-094e6377726a?auto=format&fit=crop&w=400&q=80'
                  ].map((src, index) => (
                    <div key={`${set}-${index}`} className="relative w-64 md:w-72 lg:w-80 aspect-square rounded-3xl overflow-hidden group cursor-pointer flex-shrink-0">
                      <img src={src} alt={`Instagram Post ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

