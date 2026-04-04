import { useState, useEffect } from 'react'
import { 
  Upload, 
  X,
  Save,
  Eye,
  Image as ImageIcon,
  PenTool,
  ScrollText,
  UserCircle
} from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const AdminAboutPage = () => {
  const [aboutContent, setAboutContent] = useState({
    hero_image: '',
    angie_image: '',
    hero_title: 'About Us',
    hero_subtitle: 'Your source for the Freshest Threads. No Cap.',
    whats_the_plug: `Hey, we're Exquisite Boutique – your ultimate source for exclusive, high-quality streetwear that you won't find anywhere else. Just like a trusted advisor hooks you up with what's real, we're here to connect you with fire fits that speak volumes.

We started because we were tired of the same basic styles everywhere. We wanted a spot to cop unique pieces that blend premium comfort with head-turning design. That's the Exquisite promise: no boring basics, just curated drip.`,
    our_vibe: `We're more than just a clothing brand. We're your insider connection to a lifestyle. We're for the hustlers, the creators, the trend-setters, and anyone who uses their style as a form of self-expression. We believe what you wear should be as unique as you are.`,
    angie_quote: `"Wassup, y'all! I'm the lead curator here at Exquisite Boutique.

This all started from a passion for unique style. I was always the one people hit up to find the coolest pieces or put together the best fit. I turned that passion into a mission: to build a one-stop shop for unique, high-quality streetwear that actually represents our generation.

Exquisite Boutique is my way of hooking you all up with the gear you really want. This isn't just my business; it's my passion. Every piece is chosen with love, and I'm stoked to have you on this journey with us.

Stay fresh,
- Exquisite Boutique"`
  })
  const [uploadingImages, setUploadingImages] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      setIsLoading(true)
      
      if (!isSupabaseConfigured) {
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching about content:', error)
      } else if (data) {
        setAboutContent(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (field, file) => {
    if (!file) return

    setUploadingImages(prev => ({ ...prev, [field]: true }))

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
      const fileName = `${field}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `about/${fileName}`
      const bucket = getStorageBucket()

      if (aboutContent[field]) {
        await deleteImageFromStorage(aboutContent[field])
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
        throw new Error('Failed to get public URL for uploaded image')
      }

      setAboutContent(prev => ({
        ...prev,
        [field]: publicUrl
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploadingImages(prev => ({ ...prev, [field]: false }))
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

  const removeImage = async (field) => {
    if (aboutContent[field]) {
      await deleteImageFromStorage(aboutContent[field])
    }
    
    setAboutContent(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (!isSupabaseConfigured) {
        alert('Cannot save without Supabase configuration.')
        return
      }

      const { data: existingData } = await supabase
        .from('about_page')
        .select('id')
        .limit(1)

      let result
      if (existingData && existingData.length > 0) {
        result = await supabase
          .from('about_page')
          .update(aboutContent)
          .eq('id', existingData[0].id)
      } else {
        result = await supabase
          .from('about_page')
          .insert(aboutContent)
      }

      if (result.error) throw result.error

      alert('Brand identity content pushed successfully!')
    } catch (error) {
      console.error('Error saving about content:', error)
      alert(`Error saving content: ${error.message}. Please try again.`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-fuchsia-500/30 border-t-fuchsia-500 animate-spin mb-4"></div>
        <p className="text-xs font-black tracking-widest uppercase text-fuchsia-500">Decrypting Narrative...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            BRAND <span className="text-fuchsia-500">NARRATIVE</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Control company identity and story</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-0">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass flex items-center justify-center text-[10px] sm:text-xs tracking-widest uppercase"
          >
            <Eye className="w-4 h-4 mr-2 text-fuchsia-400" />
            INSPECT FRONTEND
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-gradient shadow-fuchsia-500/20 from-fuchsia-600 to-fuchsia-800 flex items-center justify-center text-[10px] sm:text-xs tracking-widest uppercase"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'TRANSMITTING...' : 'PUSH NARRATIVE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ImageIcon className="text-fuchsia-500" size={120} />
          </div>
          <div className="flex items-center space-x-4 mb-8">
             <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
               <PenTool className="w-5 h-5 text-fuchsia-500" />
             </div>
             <h2 className="text-lg font-black italic tracking-tighter text-white uppercase">PRIMARY OVERRIDE</h2>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-2">
                Hero Visual Asset
              </label>
              <div className={`border-2 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                  ${aboutContent.hero_image ? 'p-2 border-white/10 bg-black/30' : 'p-8'} 
                  ${uploadingImages.hero_image ? 'border-fuchsia-500/50 bg-fuchsia-500/5 cursor-wait' : 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 cursor-pointer border-white/10 bg-black/20'}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('hero_image', e.target.files[0])}
                  className="hidden"
                  id="hero-image-upload"
                  disabled={uploadingImages.hero_image}
                />
                <label
                  htmlFor="hero-image-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                >
                  {aboutContent.hero_image ? (
                    <div className="relative group w-full">
                      <img
                        src={aboutContent.hero_image}
                        alt="Hero Payload"
                        className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem]"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                        <span className="text-xs font-black tracking-widest text-white uppercase bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">Replace Asset</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); removeImage('hero_image'); }}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : uploadingImages.hero_image ? (
                     <>
                        <div className="w-12 h-12 rounded-full border-4 border-fuchsia-500/30 border-t-fuchsia-500 animate-spin mb-4"></div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-fuchsia-500 text-center">Transmitting...</span>
                      </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                        <ImageIcon className="w-6 h-6 text-fuchsia-500" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-300 text-center">Inject Hero Graphic</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                Primary Header
              </label>
              <input
                type="text"
                value={aboutContent.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                className="input-glass w-full text-sm"
                placeholder="Exquisite Boutique"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                Secondary Descriptor
              </label>
              <input
                type="text"
                value={aboutContent.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                className="input-glass w-full text-sm"
                placeholder="The freshest threads..."
              />
            </div>
          </div>
        </div>

        {/* Curator Section */}
        <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <UserCircle size={120} className="text-orange-500" />
          </div>
          <div className="flex items-center space-x-4 mb-8">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
               <UserCircle className="w-5 h-5 text-orange-500" />
             </div>
             <h2 className="text-lg font-black italic tracking-tighter text-white uppercase">SUBJECT IDENTITY</h2>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-2">
                Subject Portrait
              </label>
              <div className={`border-2 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                  ${aboutContent.angie_image ? 'p-2 border-white/10 bg-black/30' : 'p-8'} 
                  ${uploadingImages.angie_image ? 'border-orange-500/50 bg-orange-500/5 cursor-wait' : 'hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer border-white/10 bg-black/20'}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('angie_image', e.target.files[0])}
                  className="hidden"
                  id="angie-image-upload"
                  disabled={uploadingImages.angie_image}
                />
                <label
                  htmlFor="angie-image-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                >
                  {aboutContent.angie_image ? (
                    <div className="relative group w-full">
                      <img
                        src={aboutContent.angie_image}
                        alt="Subject"
                        className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem]"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                        <span className="text-xs font-black tracking-widest text-white uppercase bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">Replace Portrait</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); removeImage('angie_image'); }}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : uploadingImages.angie_image ? (
                     <>
                        <div className="w-12 h-12 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin mb-4"></div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-orange-500 text-center">Transmitting...</span>
                      </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                        <UserCircle className="w-6 h-6 text-orange-500" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-300 text-center">Load Subject Profile</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                Personal Transcript (Quote)
              </label>
              <textarea
                rows={8}
                value={aboutContent.angie_quote}
                onChange={(e) => handleInputChange('angie_quote', e.target.value)}
                className="input-glass w-full text-sm resize-none"
                placeholder="Log transcription here..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ScrollText size={180} className="text-emerald-500" />
        </div>
        <div className="flex items-center space-x-4 mb-8">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
             <ScrollText className="w-5 h-5 text-emerald-500" />
           </div>
           <h2 className="text-lg font-black italic tracking-tighter text-white uppercase">ADDITIONAL MANIFESTOS</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
              Log Block 1: "What's the Plug?"
            </label>
            <textarea
              rows={8}
              value={aboutContent.whats_the_plug}
              onChange={(e) => handleInputChange('whats_the_plug', e.target.value)}
              className="input-glass w-full text-sm resize-none"
              placeholder="Inject first body block..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
              Log Block 2: "Our Vibe"
            </label>
            <textarea
              rows={8}
              value={aboutContent.our_vibe}
              onChange={(e) => handleInputChange('our_vibe', e.target.value)}
              className="input-glass w-full text-sm resize-none"
              placeholder="Inject second body block..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAboutPage
