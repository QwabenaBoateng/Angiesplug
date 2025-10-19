import { useState, useEffect } from 'react'
import { 
  Upload, 
  X,
  Save,
  Eye,
  Image as ImageIcon,
  Trash2,
  Video,
  Play
} from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const AdminPromotionalSection = () => {
  const [promoContent, setPromoContent] = useState({
    promo_image: '',
    promo_video: '',
    promo_video_poster: '',
    promo_title: 'FIND YOUR PERFECT LOOK AT ANGIE\'S PLUG',
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploadingImage(true)

      // Guard: require configuration
      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        setUploadingImage(false)
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `promo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `promotional/${fileName}`
      const bucket = getStorageBucket()

      console.log('Uploading promotional image:', { fileName, filePath, bucket, fileSize: file.size })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          contentType: file.type, 
          upsert: true 
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        if (uploadError.message.includes('Bucket not found')) {
          alert('Storage bucket not found. Please check your Supabase storage configuration.')
        } else if (uploadError.message.includes('permission')) {
          alert('Permission denied. Please check your storage policies.')
        } else {
          alert(`Upload failed: ${uploadError.message}`)
        }
        return
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      console.log('Public URL generated:', publicUrl)

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

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    try {
      setUploadingVideo(true)

      // Guard: require configuration
      if (!isSupabaseConfigured) {
        alert('Video uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        setUploadingVideo(false)
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `promo-video-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `promotional/${fileName}`
      const bucket = getStorageBucket()

      console.log('Uploading promotional video:', { fileName, filePath, bucket, fileSize: file.size })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          contentType: file.type, 
          upsert: true 
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        if (uploadError.message.includes('Bucket not found')) {
          alert('Storage bucket not found. Please check your Supabase storage configuration.')
        } else if (uploadError.message.includes('permission')) {
          alert('Permission denied. Please check your storage policies.')
        } else {
          alert(`Upload failed: ${uploadError.message}`)
        }
        return
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded video')
      }

      console.log('Public URL generated:', publicUrl)

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setUploadingPoster(true)

      // Guard: require configuration
      if (!isSupabaseConfigured) {
        alert('Image uploads are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
        setUploadingPoster(false)
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `promo-poster-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `promotional/${fileName}`
      const bucket = getStorageBucket()

      console.log('Uploading promotional poster:', { fileName, filePath, bucket, fileSize: file.size })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          contentType: file.type, 
          upsert: true 
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        if (uploadError.message.includes('Bucket not found')) {
          alert('Storage bucket not found. Please check your Supabase storage configuration.')
        } else if (uploadError.message.includes('permission')) {
          alert('Permission denied. Please check your storage policies.')
        } else {
          alert(`Upload failed: ${uploadError.message}`)
        }
        return
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded poster')
      }

      console.log('Public URL generated:', publicUrl)

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

      // Check if record exists
      const { data: existingData } = await supabase
        .from('promotional_section')
        .select('id')
        .single()

      let result
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('promotional_section')
          .update(promoContent)
          .eq('id', existingData.id)
      } else {
        // Insert new record
        result = await supabase
          .from('promotional_section')
          .insert([promoContent])
      }

      if (result.error) {
        throw result.error
      }

      alert('Promotional section updated successfully!')
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
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-48 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promotional Section</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Promotional Image</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {promoContent.promo_image ? (
              <div className="relative">
                <img
                  src={promoContent.promo_image}
                  alt="Promotional"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="promo-image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <input
                    id="promo-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
          </div>

          {/* Video Upload Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Promotional Video</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {promoContent.promo_video ? (
                <div className="relative">
                  <video
                    src={promoContent.promo_video}
                    poster={promoContent.promo_video_poster}
                    className="w-full h-64 object-cover rounded-lg"
                    controls
                  />
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="promo-video-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                    </label>
                    <input
                      id="promo-video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    MP4, MOV, AVI up to 50MB
                  </p>
                </div>
              )}
            </div>

            {/* Video Poster Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Video Poster (Thumbnail)</h3>
              {promoContent.promo_video_poster ? (
                <div className="relative">
                  <img
                    src={promoContent.promo_video_poster}
                    alt="Video poster"
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => setPromoContent(prev => ({ ...prev, promo_video_poster: '' }))}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <label
                    htmlFor="promo-poster-upload"
                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingPoster ? 'Uploading...' : 'Upload Poster'}
                  </label>
                  <input
                    id="promo-poster-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                    disabled={uploadingPoster}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={promoContent.promo_title}
              onChange={(e) => handleInputChange('promo_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={promoContent.promo_description}
              onChange={(e) => handleInputChange('promo_description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Text
              </label>
              <input
                type="text"
                value={promoContent.promo_discount_text}
                onChange={(e) => handleInputChange('promo_discount_text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="text"
                value={promoContent.promo_discount_percentage}
                onChange={(e) => handleInputChange('promo_discount_percentage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={promoContent.promo_button_text}
                onChange={(e) => handleInputChange('promo_button_text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Link
              </label>
              <input
                type="text"
                value={promoContent.promo_button_link}
                onChange={(e) => handleInputChange('promo_button_link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">Video Section Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Button Text
                </label>
                <input
                  type="text"
                  value={promoContent.promo_video_button_text}
                  onChange={(e) => handleInputChange('promo_video_button_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Button Link
                </label>
                <input
                  type="text"
                  value={promoContent.promo_video_button_link}
                  onChange={(e) => handleInputChange('promo_video_button_link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative">
                {promoContent.promo_image ? (
                  <img
                    src={promoContent.promo_image}
                    alt="Promotional"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image uploaded</span>
                  </div>
                )}
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {promoContent.promo_title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {promoContent.promo_description}
                </p>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">{promoContent.promo_discount_text}</p>
                  <p className="text-4xl font-bold text-gray-900">{promoContent.promo_discount_percentage}</p>
                </div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  {promoContent.promo_button_text}
                </button>
              </div>
            </div>
          </div>

          {/* Video Section Preview */}
          <div className="relative rounded-lg overflow-hidden">
            {promoContent.promo_video ? (
              <video
                src={promoContent.promo_video}
                poster={promoContent.promo_video_poster}
                className="w-full h-64 object-cover"
                controls
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-gray-500">No video uploaded</span>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <h3 className="text-lg font-bold text-white bg-black bg-opacity-50 px-2 py-1 rounded">ANGIE'S PLUG</h3>
            </div>
            <div className="absolute bottom-4 right-4">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                {promoContent.promo_video_button_text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPromotionalSection

