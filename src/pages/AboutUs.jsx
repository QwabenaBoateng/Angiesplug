import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, ArrowRight } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState({
    hero_image: '/api/placeholder/1200/500',
    angie_image: '/api/placeholder/400/500',
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

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      if (!isSupabaseConfigured) {
        return // Use default content
      }

      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching about content:', error)
      } else if (data) {
        console.log('About page data loaded:', data)
        setAboutContent(prev => ({
          ...prev,
          ...data,
          // Use placeholder images if no uploaded images
          hero_image: data.hero_image || '/api/placeholder/1200/500',
          angie_image: data.angie_image || '/api/placeholder/400/500'
        }))
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    }
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={aboutContent.hero_image}
          alt="Angie's Plug - Urban Streetwear"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Hero image failed to load:', aboutContent.hero_image)
            e.target.src = '/api/placeholder/1200/500'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{aboutContent.hero_title}</h1>
            <p className="text-xl md:text-2xl font-semibold">{aboutContent.hero_subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* What's the Plug? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What's the Plug?</h2>
          <div className="prose prose-lg max-w-none">
            {aboutContent.whats_the_plug.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Our Vibe */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Vibe</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {aboutContent.our_vibe}
            </p>
          </div>
        </section>

        {/* Why Rock With Us? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Rock With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Exclusive Drops */}
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exclusive Drops</h3>
              <p className="text-gray-700 leading-relaxed">
                We're not a fast-fashion factory. Our collections are limited, curated, and designed to make you stand out. When you cop from Angie's Plug, you're getting something special.
              </p>
            </div>

            {/* Quality on Tap */}
            <div className="text-center">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality on Tap</h3>
              <p className="text-gray-700 leading-relaxed">
                From the weight of our hoodies to the print on our tees, we're obsessive about quality. We plug you into garments that feel as good as they look and are built to last.
              </p>
            </div>

            {/* The Real Deal */}
            <div className="text-center">
              <div className="text-4xl mb-4">🙌</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Real Deal</h3>
              <p className="text-gray-700 leading-relaxed">
                Transparency is key. We give you the real deal on our products and our process. We're building a community, not just a customer list.
              </p>
            </div>
          </div>
        </section>

        {/* Meet Angie */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Angie, Your Plug</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={aboutContent.angie_image}
                alt="Angie - Founder of Angie's Plug"
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Angie image failed to load:', aboutContent.angie_image)
                  e.target.src = '/api/placeholder/400/500'
                }}
              />
            </div>
            <div className="prose prose-lg max-w-none">
              <blockquote className="text-gray-700 leading-relaxed italic text-lg border-l-4 border-gray-300 pl-6">
                {aboutContent.angie_quote.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < aboutContent.angie_quote.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </blockquote>
            </div>
          </div>
        </section>

        {/* Get Plugged In */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Plugged In</h2>
          <p className="text-lg text-gray-700 mb-8">
            Ready to upgrade your wardrobe with the real stuff?
          </p>
          
          <div className="space-y-4">
            <Link
              to="/shop"
              className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              👉 SHOP THE LATEST DROP
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <div className="text-gray-700">
              <p className="mb-4">
                Don't miss out. Follow us on{' '}
                <a 
                  href="https://instagram.com/angiesplug" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-black font-semibold hover:underline flex items-center justify-center"
                >
                  <Instagram className="w-5 h-5 mr-1" />
                  Instagram @AngiesPlug
                </a>
                {' '}and subscribe to our newsletter to get the first look at new arrivals, exclusive deals, and restock alerts.
              </p>
              <p className="text-lg font-semibold text-gray-900">
                You'll get 5% off your first order just for signing up.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-xl font-bold text-gray-900">
              You've found your plug. Welcome to the crew.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
