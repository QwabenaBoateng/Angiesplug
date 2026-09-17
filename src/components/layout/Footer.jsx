import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#f8f8f6] border-t border-slate-200 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#652d23]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section: Brand & Navigation */}
        <div className="pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group" onClick={scrollToTop}>
              <div className="w-12 h-12 bg-gradient-to-tr from-[#993f2d] to-[#652d23] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#652d23]/20 group-hover:scale-105 transition-transform">
                <span className="text-slate-900 font-semibold text-2xl ">E</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 leading-none">
                  EXQUISITE <span className="text-gradient">BOUTIQUE</span>
                </h3>
              </div>
            </Link>
            
            <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-sm">
              The premier destination for high-performance streetwear. Curating global trends for the next generation of style icons. Excellence is not an option; it's the standard.
            </p>
            
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-black/5 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#652d23] hover:text-white hover:border-transparent transition-all active:scale-95 shadow-xl">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Intelligence (Links) */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-sm font-semibold text-slate-800 mb-6">QUICK LINKS</h4>
            <ul className="space-y-5">
              {['Home', 'Shop', 'Catalog', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-slate-600 font-medium text-sm hover:text-[#652d23] transition-colors flex items-center group"
                    onClick={scrollToTop}
                  >
                    <span>{item}</span>
                    <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-[#652d23]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Protocol */}
          <div className="lg:col-span-3">
             <h4 className="text-sm font-semibold text-slate-800 mb-6">CONTACT INFO</h4>
             <div className="space-y-6">
                <div className="flex items-start space-x-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-black/5 border border-slate-200 flex items-center justify-center text-[#652d23] shrink-0 group-hover:bg-[#652d23] group-hover:text-white transition-all">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Our Store</p>
                    <p className="text-sm text-slate-600">Madina ARS, Accra, Ghana</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-black/5 border border-slate-200 flex items-center justify-center text-[#652d23] shrink-0 group-hover:bg-[#652d23] group-hover:text-white transition-all">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Phone Number</p>
                    <p className="text-sm text-slate-600">+233 549 759 032</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group cursor-default overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-black/5 border border-slate-200 flex items-center justify-center text-[#652d23] shrink-0 group-hover:bg-[#652d23] group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Email Address</p>
                    <p className="text-sm text-slate-600 truncate">angelatyron251@gmail.com</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Column 4: Newsletter / Global */}
          <div className="lg:col-span-3">
             <h4 className="text-sm font-semibold text-slate-800 mb-6">NEWSLETTER</h4>
             <p className="text-sm text-slate-600 mb-6 leading-relaxed">Subscribe to receive our latest drops and exclusive offers.</p>
             <form className="relative group" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="name@domain.com" 
                 className="w-full bg-black/5 border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-[#652d23]/50 transition-all outline-none"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#652d23] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#652d23]/20 active:scale-90 transition-all">
                  <ArrowUpRight size={18} />
               </button>
             </form>
             
             <div className="mt-8 flex items-center space-x-6">
             </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="py-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">
            © 2026 EXQUISITE BOUTIQUE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <button 
            onClick={scrollToTop}
            className="group flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover:border-[#652d23] group-hover:bg-[#652d23] focus:outline-none">
              <ArrowUpRight className="rotate-[-45deg] text-slate-500 group-hover:text-white transition-all" size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer

