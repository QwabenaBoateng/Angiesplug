import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-slate-900 overflow-hidden selection:bg-[#652d23]/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#652d23]/5 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d38b6d]/5 blur-[120px] rounded-full -ml-48 -mb-48 opacity-50"></div>
      </div>

      {/* Header Section */}
      <header className="relative pt-32 pb-20 text-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[10px] font-semibold text-[#652d23] uppercase tracking-[0.4em] mb-4 block animate-in fade-in slide-in-from-top-4 duration-700">We respond in hours, not days</span>
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tight mb-8  animate-in fade-in slide-in-from-top-6 duration-700">
            CONNECT <span className="text-gradient">WITH US</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-bold max-w-2xl mx-auto leading-snug tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Have a question about a drop or an existing order? Our team is on standby to help you out.
          </p>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-12">
            <h2 className="text-4xl font-semibold tracking-tight pb-4 border-b border-slate-200 inline-block">CONTACT <span className="text-[#652d23]">INFO</span></h2>
            
            <div className="space-y-10">
              <div className="flex items-start group">
                <div className="w-14 h-14 bg-[#652d23]/10 rounded-2xl flex items-center justify-center mr-6 border border-[#652d23]/10 group-hover:bg-[#652d23] transition-all duration-500 group-hover:text-white text-[#652d23] group-hover:scale-110">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Email Support</h3>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-[#d38b6d] transition-colors">angelatyron251@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-14 h-14 bg-[#652d23]/10 rounded-2xl flex items-center justify-center mr-6 border border-[#652d23]/10 group-hover:bg-[#652d23] transition-all duration-500 group-hover:text-white text-[#652d23] group-hover:scale-110">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Phone Support</h3>
                  <p className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-[#d38b6d] transition-colors">0549759032</p>
                  <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-normal">Support: Mon-Fri 9AM-4PM</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mr-6 border border-slate-200 group-hover:bg-black/5 transition-all duration-500 group-hover:text-slate-900 text-slate-600 group-hover:scale-110">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Main Store</h3>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">Madina ARS, Accra</p>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="glass-card rounded-[2.5rem] p-10 bg-black/5 border border-slate-200 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#652d23]/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center space-x-4 mb-8">
                <Clock className="text-[#652d23]" size={24} />
                <h3 className="text-2xl font-semibold  tracking-tight">OPERATING <span className="text-[#652d23]">HOURS</span></h3>
              </div>
              <div className="space-y-4 font-bold text-slate-700">
                <div className="flex justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-500 uppercase tracking-normal text-[10px]">Monday - Friday</span>
                  <span className="text-slate-900 tracking-normal text-sm">09:00 — 16:00</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate-200">
                  <span className="text-slate-500 uppercase tracking-normal text-[10px]">Saturday</span>
                  <span className="text-slate-900 tracking-normal text-sm">10:00 — 16:00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 uppercase tracking-normal text-[10px]">Sunday</span>
                  <span className="text-slate-600/50 uppercase tracking-normal text-xs ">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-[3rem] p-8 lg:p-14 bg-black/5 border border-slate-200 animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="flex items-center space-x-6 mb-12">
                <div className="w-px h-12 bg-[#652d23]"></div>
                <div>
                  <h2 className="text-4xl font-semibold  tracking-tight">SEND A <span className="text-gradient leading-tight">MESSAGE</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Send us a direct message</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em] pl-2">Full Name</label>
                    <div className="relative group">
                       <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                        className="input-glass w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em] pl-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@domain.com"
                      className="input-glass w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em] pl-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="General Inquiry / Order Update"
                    className="input-glass w-full"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.3em] pl-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Enter your message here..."
                    className="input-glass w-full min-h-[200px]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gradient w-full py-5 text-lg font-semibold tracking-normal flex items-center justify-center space-x-4 shadow-lg shadow-[#652d23]/20 hover:shadow-xl transition-all active:scale-95 group"
                >
                  <span>SEND MESSAGE</span>
                  <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

