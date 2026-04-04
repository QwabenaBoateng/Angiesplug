import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Building2 } from 'lucide-react'
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

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          contentType: file.type, 
          upsert: true 
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

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
      const url = new URL(formData.image_url)
      const pathParts = url.pathname.split('/')
      const filePath = pathParts.slice(-2).join('/')
      
      const bucket = getStorageBucket()
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Error deleting image:', error)
      }
    } catch (error) {
      console.error('Error removing image:', error)
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
        const { error } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', editingBrand.id)

        if (error) throw error
      } else {
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
      description: brand.description || '',
      image_url: brand.image_url || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (brand) => {
    if (!window.confirm('WARNING: Deleting this alliance will destroy its records. Proceed?')) return

    try {
      if (brand.image_url) {
        try {
          const url = new URL(brand.image_url)
          const pathParts = url.pathname.split('/')
          const filePath = pathParts.slice(-2).join('/')
          
          const bucket = getStorageBucket()
          
          await supabase.storage
            .from(bucket)
            .remove([filePath])
        } catch (error) {
          console.error('Error removing image from storage:', error)
        }
      }

      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brand.id)

      if (error) throw error
      fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
      setError('Failed to sever alliance')
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
       <div className="flex flex-col items-center justify-center p-24">
         <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4"></div>
         <p className="text-[10px] font-black tracking-widest uppercase text-emerald-500">Retrieving Allied Assets...</p>
       </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            CORPORATE <span className="text-emerald-500">PARTNERSHIPS</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Manage external brand alliances</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 btn-gradient shadow-emerald-500/20 from-emerald-600 to-emerald-800 flex items-center justify-center text-[10px] sm:text-xs tracking-widest uppercase"
        >
          <Plus className="w-4 h-4 mr-2" />
          ESTABLISH ALLIANCE
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center">
           <X className="w-4 h-4 mr-2" />
           <span className="text-xs font-black tracking-widest uppercase">{error}</span>
        </div>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand.id} className="glass-card rounded-[2rem] overflow-hidden group border border-white/5 relative">
            <div className="relative h-48 w-full bg-black/50 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
               <img
                  src={brand.image_url || '/placeholder-image.jpg'}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                />
               <div className="absolute top-2 right-2 flex space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button
                   onClick={() => handleEdit(brand)}
                   className="p-2 bg-black/60 backdrop-blur-md rounded-xl hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 transition-all text-slate-300 hover:text-blue-400"
                 >
                   <Edit className="w-4 h-4" />
                 </button>
                 <button
                   onClick={() => handleDelete(brand)}
                   className="p-2 bg-black/60 backdrop-blur-md rounded-xl hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all text-slate-300 hover:text-red-400"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
            <div className="p-6 relative z-20 -mt-6">
              <h3 className="font-black italic tracking-tighter text-xl text-white uppercase truncate drop-shadow-md">{brand.name}</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest truncate max-w-full">
                {brand.description || 'UNDEFINED PARTNERSHIP'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-24 flex flex-col items-center justify-center glass-card rounded-[2rem] border-white/5">
          <Building2 className="w-16 h-16 text-slate-700 mb-4 opacity-50" />
          <h3 className="text-lg font-black text-slate-400 mb-2 uppercase tracking-widest">No Alliances Found</h3>
          <p className="text-xs font-bold text-slate-600 mb-6 uppercase tracking-widest">Execute prompt to register a firm</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient shadow-emerald-500/20 from-emerald-600 to-emerald-800 text-[10px] tracking-widest uppercase"
          >
            ESTABLISH ALLIANCE
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-xl glass-card rounded-[3rem] p-8 sm:p-12 border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Building2 size={120} className="text-emerald-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                  <Building2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                   <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                     {editingBrand ? 'MODIFY ' : 'ESTABLISH '} <span className="text-emerald-500">ALLIANCE</span>
                   </h3>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                  Firm Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-glass w-full text-sm font-bold text-white"
                  placeholder="EX: NIKELAB"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                  Designation / Descriptor
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-glass w-full text-sm resize-none"
                  rows="3"
                  placeholder="Strategic description..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                  Brand Identity Mark
                </label>
                <div className={`border-2 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                    ${formData.image_url ? 'p-2 border-white/10 bg-black/30' : 'p-8'} 
                    ${uploadingImage ? 'border-emerald-500/50 bg-emerald-500/5 cursor-wait' : 'hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer border-white/10 bg-black/20'}`}
                >
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
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    {formData.image_url ? (
                      <div className="relative group w-full">
                        <img
                          src={formData.image_url}
                          alt="Brand Logo"
                          className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem]"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                          <span className="text-xs font-black tracking-widest text-white uppercase bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">Replace Asset</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); removeImage(); }}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0 z-20"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : uploadingImage ? (
                       <>
                          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4"></div>
                          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-500 text-center">Transmitting...</span>
                        </>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-300 text-center">Attach Partner Logo</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                    Remote Overload (URL Vector)
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="input-glass w-full text-xs font-mono text-cyan-400"
                    placeholder="https://server.com/payload.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gradient shadow-emerald-500/20 from-emerald-600 to-emerald-800 text-[10px] sm:text-xs tracking-widest uppercase"
                >
                  {isSubmitting ? 'PROCESSING...' : editingBrand ? 'COMMIT UPDATE' : 'INITIALIZE'}
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

export default Brands
