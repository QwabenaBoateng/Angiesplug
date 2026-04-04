import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon, LayoutGrid } from 'lucide-react'
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

      if (categoryForm.image_url) {
        await deleteImageFromStorage(categoryForm.image_url)
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { contentType: file.type, upsert: true })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL')
      }

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
      console.error('Error deleting image:', error)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            TAXONOMY <span className="text-indigo-500">REGISTRY</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Establish logical asset groups</p>
        </div>
        <button
          onClick={openModal}
          className="mt-4 sm:mt-0 btn-gradient shadow-indigo-500/20 from-indigo-600 to-indigo-800 flex items-center text-[10px] tracking-widest"
        >
          <Plus className="w-4 h-4 mr-2" />
          ESTABLISH GROUP
        </button>
      </div>

      {/* Categories List */}
      <div className="glass-card rounded-[2rem] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
            <p className="text-xs font-black tracking-widest uppercase text-indigo-500">Reading Catalog...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
             <LayoutGrid className="w-16 h-16 text-slate-700 mb-4 opacity-50" />
            <p className="text-sm font-black text-slate-500 tracking-widest uppercase">No groups established</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Marker
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Identity
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Directive Slug
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Definition
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-white-[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden border border-white/10 bg-black/50">
                        <img
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                          src={category.image_url || '/placeholder-image.jpg'}
                          alt={category.name}
                          onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white tracking-wide">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-slate-400">
                        /{category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest max-w-xs truncate">
                        {category.description || 'UNASSIGNED'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 tracking-widest">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 border border-transparent hover:border-indigo-500/20 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all"
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
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-xl glass-card rounded-[3rem] p-8 sm:p-12 border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <LayoutGrid size={120} className="text-indigo-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 flex-shrink-0">
                  <LayoutGrid className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                   <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                     {editingCategory ? 'EDIT ' : 'ESTABLISH '} <span className="text-indigo-500">GROUP</span>
                   </h3>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Taxonomy Identity
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-glass w-full text-sm"
                  placeholder="Designate Nomenclature"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 flex items-center">
                  Pathing Slug <span className="ml-2 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">AUTO-ENCODED</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-glass w-full text-sm text-slate-400"
                  placeholder="group-slug"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Descriptor
                </label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-glass w-full text-sm resize-none"
                  placeholder="Outline purpose and boundaries..."
                />
              </div>

              {/* Category Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Identity Marker
                </label>
                <div className={`border-2 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                    ${categoryForm.image_url ? 'p-2 border-white/10 bg-black/30' : 'p-8'} 
                    ${uploadingImage ? 'border-indigo-500/50 bg-indigo-500/5 cursor-wait' : 'hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer border-white/10 bg-black/20'}`}
                >
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
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    {categoryForm.image_url ? (
                      <div className="relative group w-full">
                        <img
                          src={categoryForm.image_url}
                          alt="Category Marker"
                          className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem]"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                          <span className="text-xs font-black tracking-widest text-white uppercase bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">Replace Asset</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); removeImage(); }}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : uploadingImage ? (
                      <>
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
                        <span className="text-xs font-black tracking-widest uppercase text-indigo-500 text-center">Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-300 text-center">Load Asset</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="btn-gradient shadow-indigo-500/20 from-indigo-600 to-indigo-800 text-[10px] sm:text-xs tracking-widest"
                >
                  {editingCategory ? 'APPLY CONFIGURATION' : 'INITIALIZE GROUP'}
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

export default AdminCategories
