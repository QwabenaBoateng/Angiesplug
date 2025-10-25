import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const Brands = () => {
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBrands(data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      setError('Failed to fetch brands')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file) => {
    setUploadingImage(true)
    setError('')

    try {
      // Guard: require configuration
      if (!isSupabaseConfigured) {
        setError('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        return
      }

      if (!(file instanceof File)) {
        setError('Please select a valid file.')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `brand-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `brands/${fileName}`
      const bucket = getStorageBucket()

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
          setError('Storage bucket not found. Please check your Supabase storage configuration.')
        } else if (uploadError.message.includes('permission')) {
          setError('Permission denied. Please check your storage policies.')
        } else {
          setError(`Upload failed: ${uploadError.message}`)
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

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }))

    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Error uploading image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = async () => {
    if (!formData.image_url) return

    try {
      // Extract file path from URL
      const url = new URL(formData.image_url)
      const pathParts = url.pathname.split('/')
      const filePath = pathParts.slice(-2).join('/') // Get 'brands/filename.ext'
      
      const bucket = getStorageBucket()
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Error deleting image:', error)
        // Don't show error to user, just remove from form
      }
    } catch (error) {
      console.error('Error removing image:', error)
      // Don't show error to user, just remove from form
    } finally {
      setFormData(prev => ({
        ...prev,
        image_url: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (editingBrand) {
        // Update existing brand
        const { error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', editingBrand.id)

        if (error) throw error
      } else {
        // Create new brand
        const { error } = await supabase
          .from('brands')
          .insert([formData])

        if (error) throw error
      }

      setIsModalOpen(false)
      setEditingBrand(null)
      setFormData({ name: '', description: '', image_url: '' })
      fetchBrands()
    } catch (error) {
      console.error('Error saving brand:', error)
      setError('Failed to save brand')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description,
      image_url: brand.image_url
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (brand) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return

    try {
      // Delete image from storage if it exists
      if (brand.image_url) {
        try {
          const url = new URL(brand.image_url)
          const pathParts = url.pathname.split('/')
          const filePath = pathParts.slice(-2).join('/') // Get 'brands/filename.ext'
          
          const bucket = getStorageBucket()
          
          const { error: storageError } = await supabase.storage
            .from(bucket)
            .remove([filePath])

          if (storageError) {
            console.error('Error deleting image from storage:', storageError)
            // Continue with brand deletion even if image deletion fails
          }
        } catch (error) {
          console.error('Error removing image from storage:', error)
          // Continue with brand deletion even if image deletion fails
        }
      }

      // Delete brand from database
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brand.id)

      if (error) throw error
      fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
      setError('Failed to delete brand')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBrand(null)
    setFormData({ name: '', description: '', image_url: '' })
    setError('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands Management</h1>
          <p className="text-gray-600">Manage your brand partners and their images</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={brand.image_url || '/placeholder-image.jpg'}
                alt={brand.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEdit(brand)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  title="Edit brand"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(brand)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="Delete brand"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{brand.description}</p>
              <div className="flex items-center text-xs text-gray-500">
                <ImageIcon className="w-4 h-4 mr-1" />
                {brand.image_url ? 'Image uploaded' : 'No image'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brands yet</h3>
          <p className="text-gray-600 mb-6">Add your first brand to get started</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Brand
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="brand-image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="brand-image-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {uploadingImage ? 'Uploading...' : 'Click to upload brand image'}
                    </span>
                  </label>
                </div>

                {/* Display uploaded image */}
                {formData.image_url && (
                  <div className="mt-4 relative">
                    <img
                      src={formData.image_url}
                      alt="Brand preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Alternative URL input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingBrand ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Brands
