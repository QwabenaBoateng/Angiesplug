import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: categoryForm.name,
            slug: categoryForm.slug,
            description: categoryForm.description,
            image_url: categoryForm.image_url
          })
          .eq('id', editingCategory.id)

        if (error) throw error
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert({
            name: categoryForm.name,
            slug: categoryForm.slug,
            description: categoryForm.description,
            image_url: categoryForm.image_url
          })

        if (error) throw error
      }

      setShowModal(false)
      setEditingCategory(null)
      setCategoryForm({ name: '', slug: '', description: '', image_url: '' })
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
    }
  }

  const openModal = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', slug: '', description: '', image_url: '' })
    setShowModal(true)
  }

  const handleNameChange = (name) => {
    setCategoryForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    setUploadingImage(true)

    try {
      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        return
      }

      if (!(file instanceof File) || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `category-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `categories/${fileName}`
      const bucket = getStorageBucket()

      // Delete old image if it exists
      if (categoryForm.image_url) {
        await deleteImageFromStorage(categoryForm.image_url)
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { contentType: file.type, upsert: true })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      console.log(`Category image uploaded:`, publicUrl)
      setCategoryForm(prev => ({
        ...prev,
        image_url: publicUrl
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('supabase.co/storage/v1/object/public/angies-db/')) {
      return
    }

    try {
      const urlParts = imageUrl.split('/storage/v1/object/public/angies-db/')
      if (urlParts.length === 2) {
        const filePath = urlParts[1]
        const bucket = getStorageBucket()
        
        await supabase.storage
          .from(bucket)
          .remove([filePath])
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error)
    }
  }

  const removeImage = async () => {
    if (categoryForm.image_url) {
      await deleteImageFromStorage(categoryForm.image_url)
    }
    
    setCategoryForm(prev => ({
      ...prev,
      image_url: ''
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={openModal}
          className="mt-4 sm:mt-0 btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No categories found. Create your first category!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={category.image_url || '/api/placeholder/100/100'}
                          alt={category.name}
                          onError={(e) => {
                            e.target.src = '/api/placeholder/100/100'
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-field"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-field"
                  placeholder="category-slug"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version of the name (auto-generated)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  placeholder="Enter category description (optional)"
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="category-image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="category-image-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {categoryForm.image_url ? (
                      <div className="relative">
                        <img
                          src={categoryForm.image_url}
                          alt="Category"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {uploadingImage ? 'Uploading...' : 'Click to upload category image'}
                        </span>
                      </>
                    )}
                  </label>
                </div>
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
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories

