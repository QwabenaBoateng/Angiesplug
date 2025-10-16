import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  X,
  Search,
  Filter
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
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Products by Category</h3>
            <span className="text-xs text-gray-500">Total: {totalProducts}</span>
          </div>
          <PieChart counts={countsByCat} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Category Distribution</h3>
          <BarChart counts={countsByCat} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-700">New Products (7 days)</h3>
            <span className="text-xs text-gray-500">{sparkCounts.reduce((a,b)=>a+b,0)}</span>
          </div>
          <Sparkline values={sparkCounts} />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            {sparkDays.map((d, i) => (
              <span key={i}>{d.toLocaleDateString(undefined, { day: '2-digit' })}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            onClick={openModal}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
          <button
            onClick={() => setShowBrandModal(true)}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Manage Brands
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
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
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image_urls?.[0] || '/placeholder-image.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.categories?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₵{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.featured
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.featured ? 'Featured' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Product
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                    className={`cursor-pointer flex flex-col items-center justify-center ${
                      uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                    </span>
                  </label>
                </div>

                {/* Display uploaded images */}
                {productForm.image_urls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productForm.image_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Brand</h3>
              <button
                onClick={() => setShowBrandModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBrandSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={brandForm.description}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  placeholder="Enter brand description"
                />
              </div>

              {/* Brand Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                    className={`cursor-pointer flex flex-col items-center justify-center ${
                      uploadingBrandImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {uploadingBrandImage ? 'Uploading...' : 'Click to upload brand image'}
                    </span>
                  </label>
                </div>

                {/* Display uploaded brand image */}
                {brandForm.image_url && (
                  <div className="mt-4">
                    <img
                      src={brandForm.image_url}
                      alt="Brand preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

