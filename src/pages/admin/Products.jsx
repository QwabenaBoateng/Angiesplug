import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  X,
  Search,
  Filter,
  Package,
  Building2
} from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingBrandImage, setUploadingBrandImage] = useState(false)

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    featured: false,
    image_urls: []
  })

  const [brandForm, setBrandForm] = useState({
    name: '',
    description: '',
    image_url: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchBrands()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .order('created_at', { ascending: false })

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data } = await query
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
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
          { id: 3, name: 'Accessories', slug: 'accessories' },
          { id: 4, name: 'Footwear', slug: 'footwear' }
        ]
        setCategories(mockCategories)
        return
      }

      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to mock categories if there's an error
      const mockCategories = [
        { id: 1, name: 'Ladies Wear', slug: 'ladies-wear' },
        { id: 2, name: 'Mens Wear', slug: 'mens-wear' },
        { id: 3, name: 'Accessories', slug: 'accessories' },
        { id: 4, name: 'Footwear', slug: 'footwear' }
      ]
      setCategories(mockCategories)
    }
  }

  const fetchBrands = async () => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Use mock brands
        const mockBrands = [
          { id: 1, name: 'Brand 1', description: 'Premium fashion brand', image_url: '/api/placeholder/400/500' },
          { id: 2, name: 'Brand 2', description: 'Luxury accessories', image_url: '/api/placeholder/400/500' },
          { id: 3, name: 'Brand 3', description: 'Casual wear specialist', image_url: '/api/placeholder/400/500' },
          { id: 4, name: 'Brand 4', description: 'Footwear excellence', image_url: '/api/placeholder/400/500' }
        ]
        setBrands(mockBrands)
        return
      }

      const { data } = await supabase
        .from('brands')
        .select('*')
        .order('name')
      
      setBrands(data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      // Fallback to mock brands if there's an error
      const mockBrands = [
        { id: 1, name: 'Brand 1', description: 'Premium fashion brand', image_url: '/api/placeholder/400/500' },
        { id: 2, name: 'Brand 2', description: 'Luxury accessories', image_url: '/api/placeholder/400/500' },
        { id: 3, name: 'Brand 3', description: 'Casual wear specialist', image_url: '/api/placeholder/400/500' },
        { id: 4, name: 'Brand 4', description: 'Footwear excellence', image_url: '/api/placeholder/400/500' }
      ]
      setBrands(mockBrands)
    }
  }

  const handleImageUpload = async (files) => {
    setUploadingImages(true)
    const uploadedUrls = []

    try {
      // Guard: require configuration
      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        return
      }

      // Guard: require category selection to determine storage folder
      if (!productForm.category_id) {
        alert('Please select a category before uploading images.')
        return
      }

      // Get the selected category name for folder organization
      const normalizedCategoryId = Number(productForm.category_id) || productForm.category_id
      const selectedCategory = categories.find(cat => cat.id === normalizedCategoryId)
      // Derive slug if missing in DB
      const derivedSlug = selectedCategory?.slug || (selectedCategory?.name
        ? selectedCategory.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : '')
      const categoryFolder = derivedSlug || 'general'
      // Normalize folder naming for special cases
      const normalizedFolder =
        categoryFolder === 'ladies-wear'
          ? 'womens-wear'
          : (categoryFolder === 'accessories' || categoryFolder === 'accessory' || categoryFolder === 'acc')
          ? 'accessories'
          : (categoryFolder === 'foot-wear' || categoryFolder === 'footwear')
          ? 'footwear'
          : categoryFolder
      const bucket = getStorageBucket()

      // Validate and normalize file list
      const validFiles = files.filter(Boolean).slice(0, 10) // soft cap to avoid accidental huge uploads

      for (const file of validFiles) {
        if (!(file instanceof File)) continue
        if (!file.type.startsWith('image/')) continue
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        // Organize images by category folder
        const filePath = `products/${normalizedFolder}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { contentType: file.type, upsert: true })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      setProductForm(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedUrls]
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = async (index) => {
    const imageUrl = productForm.image_urls[index]
    
    // If it's a Supabase storage URL, delete from storage
    if (imageUrl && imageUrl.includes('supabase.co/storage/v1/object/public/angies-db/')) {
      try {
        // Extract the file path from the URL
        const urlParts = imageUrl.split('/storage/v1/object/public/angies-db/')
        if (urlParts.length === 2) {
          const filePath = urlParts[1]
          const bucket = getStorageBucket()
          
          const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath])
          
          if (error) {
            console.error('Error deleting image from storage:', error)
            // Still remove from form even if storage deletion fails
          }
        }
      } catch (error) {
        console.error('Error deleting image from storage:', error)
        // Still remove from form even if storage deletion fails
      }
    }
    
    // Remove from form
    setProductForm(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }))
  }

  const handleBrandImageUpload = async (file) => {
    setUploadingBrandImage(true)

    try {
      // Guard: require configuration
      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        return
      }

      if (!(file instanceof File)) {
        alert('Please select a valid file.')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `brand-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `brands/${fileName}` // Store in brands/ folder within angies-db bucket
      const bucket = 'angies-db' // Use the main angies-db bucket

      console.log('Uploading brand image:', { fileName, filePath, bucket, fileSize: file.size })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          contentType: file.type, 
          upsert: true 
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        if (uploadError.message.includes('Bucket not found')) {
          alert('Angies-db storage bucket not found. Please check your Supabase storage configuration.')
        } else if (uploadError.message.includes('permission')) {
          alert('Permission denied. Please check your storage policies for the angies-db bucket.')
        } else {
          alert(`Upload failed: ${uploadError.message}`)
        }
        return
      }

      console.log('Upload successful:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      console.log('Public URL generated:', publicUrl)

      setBrandForm(prev => ({
        ...prev,
        image_url: publicUrl
      }))

      alert('Brand image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading brand image:', error)
      alert(`Error uploading brand image: ${error.message}`)
    } finally {
      setUploadingBrandImage(false)
    }
  }

  const handleBrandSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        alert('Brand management requires database configuration. Please set up your Supabase environment variables.')
        return
      }

      // Validate required fields
      if (!brandForm.name.trim()) {
        alert('Brand name is required.')
        return
      }
      if (!brandForm.description.trim()) {
        alert('Brand description is required.')
        return
      }
      if (!brandForm.image_url) {
        alert('Brand image is required.')
        return
      }

      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: brandForm.name.trim(),
          description: brandForm.description.trim(),
          image_url: brandForm.image_url
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        if (error.code === 'PGRST116') {
          alert('The brands table does not exist. Please run the database schema setup in your Supabase SQL editor.')
        } else if (error.code === '42501') {
          alert('Permission denied. Please check your RLS policies for the brands table.')
        } else {
          alert(`Database error: ${error.message}`)
        }
        return
      }

      alert('Brand saved successfully!')
      setShowBrandModal(false)
      setBrandForm({ name: '', description: '', image_url: '' })
      fetchBrands()
    } catch (error) {
      console.error('Error saving brand:', error)
      alert(`Error saving brand: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: productForm.name,
            description: productForm.description,
            price: parseFloat(productForm.price),
            category_id: productForm.category_id,
            featured: productForm.featured,
            image_urls: productForm.image_urls
          })
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            name: productForm.name,
            description: productForm.description,
            price: parseFloat(productForm.price),
            category_id: productForm.category_id,
            featured: productForm.featured,
            image_urls: productForm.image_urls
          })

        if (error) throw error
      }

      setShowModal(false)
      setEditingProduct(null)
      setProductForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        featured: false,
        image_urls: []
      })
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      featured: product.featured || false,
      image_urls: product.image_urls || []
    })
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      // First, get the product to access its images
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('image_urls')
        .eq('id', productId)
        .single()

      if (fetchError) {
        // Not fatal for deletion; continue with DB delete
        console.warn('Could not fetch product images before delete:', fetchError)
      }

      // Delete images from storage if they exist
      if (product?.image_urls && Array.isArray(product.image_urls)) {
        // Group files by bucket derived from the public URL
        const bucketToPaths = new Map()
        for (const imageUrl of product.image_urls) {
          if (!imageUrl || !imageUrl.includes('/storage/v1/object/public/')) continue
          // expected: .../storage/v1/object/public/<bucket>/<path>
          const marker = '/storage/v1/object/public/'
          const idx = imageUrl.indexOf(marker)
          if (idx === -1) continue
          const remainder = imageUrl.substring(idx + marker.length)
          const firstSlash = remainder.indexOf('/')
          if (firstSlash === -1) continue
          const bucket = remainder.substring(0, firstSlash)
          const path = remainder.substring(firstSlash + 1)
          if (!bucket || !path) continue

          if (!bucketToPaths.has(bucket)) bucketToPaths.set(bucket, [])
          bucketToPaths.get(bucket).push(path)
        }

        for (const [bucket, paths] of bucketToPaths.entries()) {
          try {
            if (paths.length === 0) continue
            const { error: storageError } = await supabase.storage
              .from(bucket)
              .remove(paths)
            if (storageError) {
              console.error(`Error deleting images from storage bucket ${bucket}:`, storageError)
            }
          } catch (e) {
            console.error('Unexpected storage deletion error:', e)
          }
        }
      }

      // Delete the product from database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('Supabase delete error:', error)
        // Improve actionable feedback
        if (error.code === '42501') {
          alert('Permission denied deleting product. Ensure your user is an admin and RLS policy "Only admins can manage products" is applied.')
        } else {
          alert(`Error deleting product: ${error.message}`)
        }
        return
      }
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert(`Error deleting product. ${error.message || ''}`)
    }
  }

  const openModal = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      description: '',
      price: '',
      category_id: '',
      featured: false,
      image_urls: []
    })
    setShowModal(true)
  }

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory])

  // --- Analytics helpers ---
  const categoryCounts = () => {
    const counts = { 'Ladies Wear': 0, 'Mens Wear': 0, 'Accessories': 0, 'Footwear': 0, Other: 0 }
    for (const p of products) {
      const name = p.categories?.name || 'Other'
      if (Object.prototype.hasOwnProperty.call(counts, name)) counts[name] += 1
      else counts.Other += 1
    }
    return counts
  }

  const productsPerDayLast7 = () => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      return d
    })
    const counts = days.map(() => 0)
    for (const p of products) {
      const created = new Date(p.created_at || Date.now())
      created.setHours(0, 0, 0, 0)
      const idx = days.findIndex(d => d.getTime() === created.getTime())
      if (idx !== -1) counts[idx] += 1
    }
    return { days, counts }
  }

  const totalProducts = products.length
  const countsByCat = categoryCounts()
  const { days: sparkDays, counts: sparkCounts } = productsPerDayLast7()

  const PieChart = ({ counts }) => {
    const entries = Object.entries(counts)
    const total = entries.reduce((a, [, v]) => a + v, 0) || 1
    let start = 0
    const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#64748b']
    const paths = entries.map(([label, value], idx) => {
      const angle = (value / total) * Math.PI * 2
      const end = start + angle
      const large = angle > Math.PI ? 1 : 0
      const x1 = 50 + 40 * Math.cos(start)
      const y1 = 50 + 40 * Math.sin(start)
      const x2 = 50 + 40 * Math.cos(end)
      const y2 = 50 + 40 * Math.sin(end)
      const d = `M50,50 L${x1},${y1} A40,40 0 ${large} 1 ${x2},${y2} Z`
      start = end
      return { d, color: colors[idx % colors.length], label, value }
    })
    return (
      <div className="flex items-center">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill={p.color}></path>
          ))}
        </svg>
        <div className="ml-4 space-y-1 text-sm text-gray-600">
          {paths.map((p, i) => (
            <div key={i} className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-sm mr-2" style={{ background: p.color }}></span>
              {p.label}: {p.value}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const BarChart = ({ counts }) => {
    const entries = Object.entries(counts)
    const max = Math.max(1, ...entries.map(([, v]) => v))
    return (
      <div className="flex items-end space-x-2 h-24">
        {entries.map(([label, v], i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-6 bg-blue-500 rounded" style={{ height: `${(v / max) * 100}%` }}></div>
            <span className="mt-1 text-[10px] text-gray-500">{label.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    )
  }

  const Sparkline = ({ values }) => {
    const max = Math.max(1, ...values)
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * 100
      const y = 100 - (v / max) * 100
      return `${x},${y}`
    }).join(' ')
    return (
      <svg viewBox="0 0 100 100" className="w-full h-16">
        <polyline fill="none" stroke="#10b981" strokeWidth="3" points={points} />
      </svg>
    )
  }

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity bg-blue-500"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory by Collection</h3>
            <span className="text-[10px] font-black text-blue-500 tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Total: {totalProducts}</span>
          </div>
          <div className="relative z-10">
            <PieChart counts={countsByCat} />
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity bg-indigo-500"></div>
          <h3 className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Collection Distribution</h3>
          <div className="relative z-10">
            <BarChart counts={countsByCat} />
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity bg-emerald-500"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Arrivals (7 Days)</h3>
            <span className="text-[10px] font-black text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{sparkCounts.reduce((a,b)=>a+b,0)}</span>
          </div>
          <div className="relative z-10">
            <Sparkline values={sparkCounts} />
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-2">
              {sparkDays.map((d, i) => (
                <span key={i}>{d.toLocaleDateString(undefined, { day: '2-digit' })}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            PRODUCT <span className="text-blue-500">INVENTORY</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Manage your store's products and collections</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowBrandModal(true)}
            className="btn-glass flex items-center justify-center text-xs tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2 text-indigo-400" />
            ADD NEW BRAND
          </button>
          <button
            onClick={openModal}
            className="btn-gradient flex items-center justify-center text-xs tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" />
            ADD NEW PRODUCT
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-2">
              Search Products
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
            >
              <option value="" className="bg-slate-950">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-slate-950">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
              }}
              className="w-full btn-glass flex items-center justify-center text-xs tracking-widest"
            >
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              CLEAR FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
            <p className="text-xs font-black tracking-widest uppercase text-blue-500">Loading Products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/30">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Product
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Date Added
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white-[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-black/50">
                          <img
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                            src={product.image_urls?.[0] || '/placeholder-image.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white tracking-wide">
                            {product.name}
                          </div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-xs mt-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-300">
                         {product.categories?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-blue-400 tracking-wider">
                         ₵{product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${
                        product.featured
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {product.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-500 tracking-widest">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 border border-transparent hover:border-blue-500/20 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 text-sm font-black tracking-widest uppercase">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl bg-slate-900 border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package size={120} className="text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase">
                  {editingProduct ? 'EDIT ' : 'ADD '}<span className="text-blue-500">PRODUCT</span>
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-glass w-full text-sm"
                    placeholder="E.g., Carbon Fiber Jacket"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Price (₵)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="input-glass w-full text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-glass w-full text-sm resize-none"
                  placeholder="Describe your product's unique features..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                    Category
                  </label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="" className="bg-slate-950">Choose a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="bg-slate-950">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4 bg-white/5 border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setProductForm(prev => ({ ...prev, featured: !prev.featured }))}>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${productForm.featured ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'}`}>
                     {productForm.featured && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Mark as Featured</p>
                    <p className="text-[10px] font-bold text-slate-500">Show on the home page</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Visual Asset Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Product Images
                </label>
                <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center ${uploadingImages ? 'border-blue-500/50 bg-blue-500/5 cursor-wait' : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer bg-black/20'}`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    {uploadingImages ? (
                      <>
                        <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
                        <span className="text-xs font-black tracking-widest uppercase text-blue-500 text-center">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-300 text-center">Click to Upload</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 text-center">JPG, PNG, WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Display uploaded images */}
                {productForm.image_urls.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {productForm.image_urls.map((url, index) => (
                      <div key={index} className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-square bg-slate-900">
                        <img
                          src={url}
                          alt={`Asset ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient shadow-blue-500/20 text-[10px] sm:text-xs tracking-widest"
                >
                  {editingProduct ? 'SAVE CHANGES' : 'ADD PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Brand Modal */}
      {showBrandModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-2xl glass-card rounded-[3rem] p-8 sm:p-12 border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Building2 size={120} className="text-indigo-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Plus className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase">
                  ADD NEW <span className="text-indigo-500">BRAND</span>
                </h3>
              </div>
              <button
                onClick={() => setShowBrandModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBrandSubmit} className="space-y-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-glass w-full text-sm"
                  placeholder="Official Brand Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Brand Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={brandForm.description}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-glass w-full text-sm resize-none"
                  placeholder="Tell us about the brand's history or mission..."
                />
              </div>

              {/* Brand Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Brand Logo / Banner
                </label>
                <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center ${uploadingBrandImage ? 'border-indigo-500/50 bg-indigo-500/5 cursor-wait' : 'border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer bg-black/20'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBrandImageUpload(e.target.files[0])}
                    className="hidden"
                    id="brand-image-upload"
                    disabled={uploadingBrandImage}
                  />
                  <label
                    htmlFor="brand-image-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    {uploadingBrandImage ? (
                      <>
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
                        <span className="text-xs font-black tracking-widest uppercase text-indigo-500 text-center">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-300 text-center">Upload Logo</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 text-center">JPG, PNG or WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Display uploaded brand image */}
                {brandForm.image_url && (
                  <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/30">
                    <img
                      src={brandForm.image_url}
                      alt="Brand preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-[10px] sm:text-xs tracking-widest uppercase"
                >
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}

export default AdminProducts

