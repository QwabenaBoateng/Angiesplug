import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState({
    hero_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200',
    angie_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    hero_title: 'THE CORE STORY',
    hero_subtitle: 'Premium Streetwear. No Boring Basics.',
    whats_the_plug: `Hey, we're Exquisite Boutique – your ultimate source for exclusive, high-quality streetwear that you won't find anywhere else. Just like a trusted advisor hooks you up with what's real, we're here to connect you with fire fits that speak volumes.

We started because we were tired of the same basic styles everywhere. We wanted a spot to cop unique pieces that blend premium comfort with head-turning design. That's the Exquisite promise: no boring basics, just curated drip.`,
    our_vibe: `We're more than just a clothing brand. We're your insider connection to a lifestyle. We're for the hustlers, the creators, the trend-setters, and anyone who uses their style as a form of self-expression. We believe what you wear should be as unique as you are.`,
    angie_quote: `"Wassup, y'all! I'm the lead curator here at Exquisite Boutique. 

This all started from a passion for unique style. I was always the one people hit up to find the coolest pieces or put together the best fit. I turned that passion into a mission: to build a one-stop shop for unique, high-quality streetwear that actually represents our generation.

Exquisite Boutique is my way of hooking you all up with the gear you really want. This isn't just my business; it's my passion. Every piece is chosen with love."`
  })

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      if (!isSupabaseConfigured) return
      const { data, error } = await supabase.from('about_page').select('*').single()
      if (data) {
        setAboutContent(prev => ({
          ...prev,
          ...data,
          hero_image: data.hero_image || prev.hero_image,
          angie_image: data.angie_image || prev.angie_image
        }))
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Header */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutContent.hero_image}
            alt="Exquisite Boutique Hero"
            className="w-full h-full object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] mb-4 block animate-in fade-in slide-in-from-top-4 duration-700">Established 2024</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic animate-in fade-in slide-in-from-top-6 duration-700">
            {aboutContent.hero_title.split(' ')[0]} <span className="text-gradient leading-tight">{aboutContent.hero_title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-300 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {aboutContent.hero_subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        {/* About Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
          <div className="glass-card rounded-[3rem] p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-4xl font-black mb-8 tracking-tighter">WHAT'S THE <span className="text-blue-500">PLUG?</span></h2>
            <div className="space-y-6 text-lg text-slate-400 leading-relaxed font-medium">
              {aboutContent.whats_the_plug.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-12 bg-white/5 border-white/5">
            <h2 className="text-4xl font-black mb-8 tracking-tighter">OUR <span className="text-indigo-500">VIBE</span></h2>
            <p className="text-2xl font-bold text-slate-200 leading-snug tracking-tight mb-8">
              "{aboutContent.our_vibe}"
            </p>
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                <span className="block text-3xl font-black text-white mb-1">100%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authentic Drip</span>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                <span className="block text-3xl font-black text-white mb-1">24/7</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Culture Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black tracking-tighter mb-4 italic">CORE <span className="text-gradient">VALUES</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-[2.5rem] text-center border-white/5 hover:border-blue-500/20 transition-all">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-black mb-4">EXCLUSIVE DROPS</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                We're not a factory. Our collections are limited, curated, and designed to make you stand out.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] text-center border-white/5 hover:border-indigo-500/20 transition-all">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black mb-4">UNMATCHED QUALITY</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Obsessive about the details. From the fabric weight to the perfect print. We don't miss.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] text-center border-white/5 hover:border-blue-400/20 transition-all">
              <div className="w-16 h-16 bg-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-black mb-4">THE REAL DEAL</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Transparency is key. We give you the real on our process. Building a crew, not just a list.
              </p>
            </div>
          </div>
        </section>

        {/* Profile / Founder Section */}
        <section className="mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative glass-card rounded-[4rem] overflow-hidden p-8 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
                  <img
                    src={aboutContent.angie_image}
                    alt="Founder Angie"
                    className="relative w-full h-[600px] object-cover rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              <div className="lg:col-span-7">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Meet Your Original Curator</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 italic">EXQUISITE <span className="text-gradient">CURATION</span></h2>
                <blockquote className="text-3xl font-bold text-slate-200 leading-tight tracking-tight mb-12">
                  {aboutContent.angie_quote}
                </blockquote>
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-px bg-slate-800"></div>
                  <span className="text-xl font-black tracking-widest text-slate-500 uppercase">Founder & CEO</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mb-32">
          <div className="glass-card rounded-[3rem] p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic">GET <span className="text-gradient">PLUGGED IN</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
              Ready to upgrade your rotation with the freshest gear? Join the inner circle for exclusive drops and site-wide deals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="btn-gradient px-12 py-5 text-lg font-black tracking-widest w-full sm:w-auto">
                SHOP THE LATEST
              </Link>
              <a href="https://instagram.com/angiesplug" target="_blank" rel="noopener" className="flex items-center space-x-4 px-12 py-5 rounded-fill bg-white/5 border border-white/10 font-black tracking-widest hover:bg-white/10 transition-all w-full sm:w-auto justify-center">
                <Instagram size={24} />
                <span>@ANGIESPLUG</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
