import { useState, useEffect } from 'react'
import { 
  Upload, 
  X,
  Save,
  Eye,
  Image as ImageIcon,
  Trash2,
  Video,
  Play,
  Megaphone,
  MonitorPlay,
  LayoutTemplate
} from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const AdminPromotionalSection = () => {
  const [promoContent, setPromoContent] = useState({
    promo_image: '',
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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPromoContent()
  }, [])

  const fetchPromoContent = async () => {
    try {
      setIsLoading(true)
      
      if (!isSupabaseConfigured) {
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('promotional_section')
        .select('*')
        .single()

      if (data) {
        setPromoContent(data)
      }
    } catch (error) {
      console.error('Error fetching promotional content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploadingImage(true)

      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        setUploadingImage(false)
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `promo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `promotional/${fileName}`
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

      setPromoContent(prev => ({
        ...prev,
        promo_image: publicUrl
      }))

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setPromoContent(prev => ({
      ...prev,
      promo_image: ''
    }))
  }

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    try {
      setUploadingVideo(true)

      if (!isSupabaseConfigured) {
        alert('Video uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        setUploadingVideo(false)
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `promo-video-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `promotional/${fileName}`
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
        throw new Error('Failed to get public URL for uploaded video')
      }

      setPromoContent(prev => ({
        ...prev,
        promo_video: publicUrl
      }))

    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Error uploading video. Please try again.')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handlePosterUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploadingPoster(true)

      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured.')
        setUploadingPoster(false)
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `promo-poster-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `promotional/${fileName}`
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
        throw new Error('Failed to get public URL for uploaded poster')
      }

      setPromoContent(prev => ({
        ...prev,
        promo_video_poster: publicUrl
      }))

    } catch (error) {
      console.error('Error uploading poster:', error)
      alert('Error uploading poster. Please try again.')
    } finally {
      setUploadingPoster(false)
    }
  }

  const handleRemoveVideo = () => {
    setPromoContent(prev => ({
      ...prev,
      promo_video: '',
      promo_video_poster: ''
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      if (!isSupabaseConfigured) {
        alert('Supabase not configured. Changes saved locally.')
        setSaving(false)
        return
      }

      const { data: existingData } = await supabase
        .from('promotional_section')
        .select('id')
        .single()

      let result
      if (existingData) {
        result = await supabase
          .from('promotional_section')
          .update(promoContent)
          .eq('id', existingData.id)
      } else {
        result = await supabase
          .from('promotional_section')
          .insert([promoContent])
      }

      if (result.error) {
        throw result.error
      }

      alert('Promotions updated successfully!')
    } catch (error) {
      console.error('Error saving promotional content:', error)
      alert('Error saving content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setPromoContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4"></div>
        <p className="text-xs font-black tracking-widest uppercase text-cyan-500">Loading Promotions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-1">
            PROMOTIONS <span className="text-cyan-500">& BANNERS</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Customize your homepage display, banners, and video features</p>
        </div>
        <div className="flex mt-6 sm:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gradient shadow-cyan-500/20 from-cyan-600 to-cyan-800 flex items-center justify-center text-[10px] sm:text-xs tracking-widest uppercase"
          >
            <MonitorPlay className="w-4 h-4 mr-2" />
            {saving ? 'SAVING...' : 'SAVE ALL CHANGES'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Media Upload Section */}
        <div className="space-y-8">
          
          {/* Static Banner */}
          <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <ImageIcon size={120} className="text-cyan-500" />
             </div>
             <div className="flex items-center space-x-4 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                   <Megaphone className="w-5 h-5 text-cyan-500" />
                 </div>
                 <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase">MAIN STORE BANNER</h2>
             </div>

             <div className="relative z-10">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-2">
                 Banner Image
               </label>
               <div className={`border-2 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                   ${promoContent.promo_image ? 'p-2 border-slate-200 bg-white/30' : 'p-8'} 
                   ${uploadingImage ? 'border-cyan-500/50 bg-cyan-500/5 cursor-wait' : 'hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer border-slate-200 bg-black/10'}`}
               >
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                   id="promo-image-upload"
                   disabled={uploadingImage}
                 />
                 <label
                   htmlFor="promo-image-upload"
                   className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                 >
                   {promoContent.promo_image ? (
                     <div className="relative group w-full">
                       <img
                         src={promoContent.promo_image}
                         alt="Store Banner"
                         className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem]"
                       />
                       <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center">
                         <span className="text-xs font-black tracking-widest text-slate-900 uppercase bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">Change Image</span>
                       </div>
                       <button
                         type="button"
                         onClick={(e) => { e.preventDefault(); handleRemoveImage(); }}
                         className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                   ) : uploadingImage ? (
                      <>
                         <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4"></div>
                         <span className="text-[10px] font-black tracking-widest uppercase text-cyan-500 text-center">Uploading...</span>
                       </>
                   ) : (
                     <>
                       <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mb-4 border border-slate-200 shadow-2xl">
                         <ImageIcon className="w-6 h-6 text-cyan-500" />
                       </div>
                       <span className="text-[10px] font-black tracking-widest uppercase text-slate-700 text-center">Upload Banner Image<br/><span className="text-[8px] text-slate-500 mt-1 block">5MB Limit</span></span>
                     </>
                   )}
                 </label>
               </div>
             </div>
          </div>

          {/* Dynamic Media */}
          <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Video size={120} className="text-rose-500" />
             </div>
             <div className="flex items-center space-x-4 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                   <Play className="w-5 h-5 text-rose-500" />
                 </div>
                 <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase">HOMEPAGE VIDEO SECTION</h2>
             </div>

             <div className="space-y-6 relative z-10">
               <div>
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-2">
                    Featured Video
                 </label>
                 <div className={`border-2 border-dashed rounded-[2rem] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                     ${promoContent.promo_video ? 'p-2 border-slate-200 bg-white/30' : 'p-8'} 
                     ${uploadingVideo ? 'border-rose-500/50 bg-rose-500/5 cursor-wait' : 'hover:border-rose-500/50 hover:bg-rose-500/5 cursor-pointer border-slate-200 bg-black/10'}`}
                 >
                   <input
                     type="file"
                     accept="video/*"
                     onChange={handleVideoUpload}
                     className="hidden"
                     id="promo-video-upload"
                     disabled={uploadingVideo}
                   />
                   <label
                     htmlFor="promo-video-upload"
                     className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                   >
                     {promoContent.promo_video ? (
                       <div className="relative group w-full">
                         <video
                           src={promoContent.promo_video}
                           poster={promoContent.promo_video_poster}
                           className="w-full h-32 sm:h-48 object-cover rounded-[1.5rem]"
                           controls
                         />
                         <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex items-center justify-center pointer-events-none">
                           <span className="text-xs font-black tracking-widest text-slate-900 uppercase bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">Change Video</span>
                         </div>
                         <button
                           type="button"
                           onClick={(e) => { e.preventDefault(); handleRemoveVideo(); }}
                           className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0 z-20"
                         >
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                     ) : uploadingVideo ? (
                        <>
                           <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin mb-4"></div>
                           <span className="text-[10px] font-black tracking-widest uppercase text-rose-500 text-center">Uploading...</span>
                         </>
                     ) : (
                       <>
                         <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mb-4 border border-slate-200 shadow-2xl">
                           <Video className="w-6 h-6 text-rose-500" />
                         </div>
                         <span className="text-[10px] font-black tracking-widest uppercase text-slate-700 text-center">Upload Featured Video<br/><span className="text-[8px] text-slate-500 mt-1 block">50MB Limit</span></span>
                       </>
                     )}
                   </label>
                 </div>
               </div>

               {/* Video Poster */}
               <div className="p-4 bg-black/10 rounded-[1.5rem] border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         Video Thumbnail (Poster)
                       </label>
                       <p className="text-[8px] text-slate-600">Static image shown before video plays</p>
                     </div>
                     {!promoContent.promo_video_poster && !uploadingPoster && (
                        <div>
                         <label
                           htmlFor="promo-poster-upload"
                           className="cursor-pointer inline-flex items-center px-4 py-2 text-[9px] font-black tracking-widest rounded-xl text-slate-700 bg-black/5 hover:bg-black/5 border border-slate-200 uppercase transition-colors"
                         >
                           <Upload className="w-3 h-3 mr-2" />
                           Add Thumbnail
                         </label>
                         <input
                           id="promo-poster-upload"
                           type="file"
                           accept="image/*"
                           onChange={handlePosterUpload}
                           className="hidden"
                           disabled={uploadingPoster}
                         />
                       </div>
                     )}
                  </div>
                  
                  {promoContent.promo_video_poster ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={promoContent.promo_video_poster}
                        alt="Video thumbnail"
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => setPromoContent(prev => ({ ...prev, promo_video_poster: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-xl p-1.5 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                   ) : uploadingPoster && (
                     <div className="h-24 flex items-center justify-center border border-slate-200 rounded-xl border-dashed">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Processing...</span>
                     </div>
                   )}
               </div>

            </div>
          </div>
        </div>

        {/* Text Variables */}
        <div className="glass-card rounded-[2rem] p-6 lg:p-10 h-min">
           <div className="flex items-center space-x-4 mb-8">
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                 <LayoutTemplate className="w-5 h-5 text-orange-500" />
               </div>
               <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase">BANNER TEXT CONTENT</h2>
           </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                Banner Title
              </label>
              <input
                type="text"
                value={promoContent.promo_title}
                onChange={(e) => handleInputChange('promo_title', e.target.value)}
                className="input-glass w-full text-sm font-bold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                Banner Description
              </label>
              <textarea
                value={promoContent.promo_description}
                onChange={(e) => handleInputChange('promo_description', e.target.value)}
                rows={4}
                className="input-glass w-full text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                   Offer Text (e.g., Summer Sale)
                </label>
                <input
                  type="text"
                  value={promoContent.promo_discount_text}
                  onChange={(e) => handleInputChange('promo_discount_text', e.target.value)}
                  className="input-glass w-full text-sm text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block text-emerald-500">
                  Discount Percentage
                </label>
                <input
                  type="text"
                  value={promoContent.promo_discount_percentage}
                  onChange={(e) => handleInputChange('promo_discount_percentage', e.target.value)}
                  className="input-glass w-full text-xl font-black text-emerald-400 text-center tracking-tighter"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black/10 border border-slate-200">
              <div className="col-span-2 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                 Banner Button Settings
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Button Label</label>
                <input
                  type="text"
                  value={promoContent.promo_button_text}
                  onChange={(e) => handleInputChange('promo_button_text', e.target.value)}
                  className="input-glass w-full text-xs box-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Link URL</label>
                <input
                  type="text"
                  value={promoContent.promo_button_link}
                  onChange={(e) => handleInputChange('promo_button_link', e.target.value)}
                  className="input-glass w-full text-xs text-blue-400 font-mono box-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black/10 border border-slate-200">
              <div className="col-span-2 text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center justify-between">
                 <span>Video Button Settings</span>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Button Label</label>
                <input
                  type="text"
                  value={promoContent.promo_video_button_text}
                  onChange={(e) => handleInputChange('promo_video_button_text', e.target.value)}
                  className="input-glass w-full text-xs box-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Link URL</label>
                <input
                  type="text"
                  value={promoContent.promo_video_button_link}
                  onChange={(e) => handleInputChange('promo_video_button_link', e.target.value)}
                  className="input-glass w-full text-xs text-blue-400 font-mono box-border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Diagnostics Overlay (Preview) */}
       <div className="glass-card rounded-[2rem] p-6 border-cyan-500/20 bg-cyan-900/5 mt-8">
         <h3 className="text-[10px] font-black text-cyan-500 tracking-widest uppercase mb-4 flex items-center">
            <Eye className="w-3 h-3 mr-2" />
            LIVE PREVIEW
         </h3>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-80 pointer-events-none filter grayscale-[30%]">
           {/* Image Promo Preview */}
           <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative">
              <div className="absolute top-0 right-0 p-4 z-20">
                 <span className="text-[9px] font-black tracking-widest text-slate-900/50 uppercase bg-white/50 px-2 py-1 rounded backdrop-blur-sm">IMAGE BANNER</span>
              </div>
             <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="relative">
                 {promoContent.promo_image ? (
                   <img
                     src={promoContent.promo_image}
                     alt="Promotional"
                     className="w-full h-full min-h-[16rem] object-cover"
                   />
                 ) : (
                   <div className="w-full h-64 bg-slate-800 flex items-center justify-center">
                     <span className="text-xs font-black tracking-widest text-slate-600 uppercase">NO IMAGE SELECTED</span>
                   </div>
                 )}
               </div>
               <div className="p-8 flex flex-col justify-center">
                 <h2 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase mb-4 leading-snippet">
                    {promoContent.promo_title || 'NO TITLE DEFINED'}
                 </h2>
                 <p className="text-xs text-slate-600 mb-6 line-clamp-3">
                   {promoContent.promo_description || 'No description provided...'}
                 </p>
                 <div className="mb-6">
                   <p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">{promoContent.promo_discount_text}</p>
                   <p className="text-4xl font-black tracking-tighter text-emerald-400">{promoContent.promo_discount_percentage}</p>
                 </div>
                 <div className="inline-flex">
                   <button className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase">
                     {promoContent.promo_button_text || 'SHOP NOW'}
                   </button>
                 </div>
               </div>
             </div>
           </div>

           {/* Video Promo Preview */}
           <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl relative group">
              <div className="absolute top-0 right-0 p-4 z-20">
                 <span className="text-[9px] font-black tracking-widest text-slate-900/50 uppercase bg-white/50 px-2 py-1 rounded backdrop-blur-sm">VIDEO SECTION</span>
              </div>
             {promoContent.promo_video ? (
               <video
                 src={promoContent.promo_video}
                 poster={promoContent.promo_video_poster}
                 className="w-full h-full min-h-[16rem] object-cover"
               />
             ) : (
               <div className="w-full h-full min-h-[16rem] bg-slate-800 flex items-center justify-center">
                 <div className="text-center">
                   <MonitorPlay className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                   <span className="text-xs font-black tracking-widest text-slate-600 uppercase">NO VIDEO SELECTED</span>
                 </div>
               </div>
             )}
             <div className="absolute top-6 left-6 max-w-[60%]">
               <h3 className="text-lg font-black italic text-slate-900 uppercase leading-none drop-shadow-md">
                 {promoContent.promo_title}
               </h3>
             </div>
             <div className="absolute bottom-6 right-6">
               <button className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg hover:bg-slate-200 transition-colors">
                 {promoContent.promo_video_button_text || 'SHOP NOW'}
               </button>
             </div>
           </div>
         </div>
       </div>


    </div>
  )
}

export default AdminPromotionalSection
