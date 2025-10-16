import { useState, useEffect } from 'react'
import { 
  Upload, 
  X,
  Save,
  Eye,
  Image as ImageIcon
} from 'lucide-react'
import { supabase, isSupabaseConfigured, getStorageBucket } from '../../lib/supabase'

const AdminAboutPage = () => {
  const [aboutContent, setAboutContent] = useState({
    hero_image: '',
    angie_image: '',
    hero_title: 'About Us',
    hero_subtitle: 'Your Plug for the Freshest Threads. No Cap.',
    whats_the_plug: `Hey, we're Angie's Plug – your ultimate source for exclusive, high-quality streetwear that you won't find anywhere else. Just like a trusted "plug" hooks you up with what's real, we're here to connect you with fire fits that speak volumes.

We started because we were tired of the same basic styles everywhere. We wanted a spot to cop unique pieces that blend premium comfort with head-turning design. That's the plug promise: no boring basics, just curated drip.`,
    our_vibe: `We're more than just a clothing brand. We're your insider connection to a lifestyle. We're for the hustlers, the creators, the trend-setters, and anyone who uses their style as a form of self-expression. We believe what you wear should be as unique as you are.`,
    angie_quote: `"Wassup, y'all! I'm Angie, the founder and your original plug.

This all started in my house. I was always the friend people hit up to find the coolest pieces or put together the best fit. I turned that passion into a mission: to build a one-stop shop for unique, high-quality streetwear that actually represents our generation.

Angie's Plug is my way of hooking you all up with the gear you really want. This isn't just my business; it's my passion. Every piece is chosen with love, and I'm stoked to have you on this journey with us.

Stay fresh,
- Angie"`
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
        // Use default content if Supabase not configured
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
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

      // Delete old image if it exists
      if (aboutContent[field]) {
        await deleteImageFromStorage(aboutContent[field])
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

      console.log(`Image uploaded for ${field}:`, publicUrl)
      console.log(`Full storage URL:`, publicUrl)
      console.log(`Bucket:`, bucket)
      console.log(`File path:`, filePath)
      
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

      // First, check if a record exists
      const { data: existingData } = await supabase
        .from('about_page')
        .select('id')
        .limit(1)

      let result
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('about_page')
          .update(aboutContent)
          .eq('id', existingData[0].id)
      } else {
        // Insert new record
        result = await supabase
          .from('about_page')
          .insert(aboutContent)
      }

      if (result.error) throw result.error

      alert('About page content saved successfully!')
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="ml-2 text-gray-600">Loading about page content...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
          <p className="text-gray-600">Manage content and images for the About page</p>
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Page
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                  className={`cursor-pointer flex flex-col items-center justify-center ${
                    uploadingImages.hero_image ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {aboutContent.hero_image ? (
                    <div className="relative">
                      <img
                        src={aboutContent.hero_image}
                        alt="Hero"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('hero_image')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploadingImages.hero_image ? 'Uploading...' : 'Click to upload hero image'}
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={aboutContent.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                className="input-field"
                placeholder="About Us"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={aboutContent.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                className="input-field"
                placeholder="Your Plug for the Freshest Threads. No Cap."
              />
            </div>
          </div>
        </div>

        {/* Angie Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meet Angie Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Angie's Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                  className={`cursor-pointer flex flex-col items-center justify-center ${
                    uploadingImages.angie_image ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {aboutContent.angie_image ? (
                    <div className="relative">
                      <img
                        src={aboutContent.angie_image}
                        alt="Angie"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('angie_image')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploadingImages.angie_image ? 'Uploading...' : 'Click to upload Angie\'s photo'}
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Angie's Quote
              </label>
              <textarea
                rows={8}
                value={aboutContent.angie_quote}
                onChange={(e) => handleInputChange('angie_quote', e.target.value)}
                className="input-field"
                placeholder="Angie's quote..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Sections</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              "What's the Plug?" Section
            </label>
            <textarea
              rows={6}
              value={aboutContent.whats_the_plug}
              onChange={(e) => handleInputChange('whats_the_plug', e.target.value)}
              className="input-field"
              placeholder="What's the Plug content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              "Our Vibe" Section
            </label>
            <textarea
              rows={4}
              value={aboutContent.our_vibe}
              onChange={(e) => handleInputChange('our_vibe', e.target.value)}
              className="input-field"
              placeholder="Our Vibe content..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAboutPage
