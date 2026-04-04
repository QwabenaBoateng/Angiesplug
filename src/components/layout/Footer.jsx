import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section: Brand & Navigation */}
        <div className="pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group" onClick={scrollToTop}>
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-2xl italic">E</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter italic leading-none">
                  EXQUISITE <span className="text-gradient">BOUTIQUE</span>
                </h3>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">Status: Online</p>
              </div>
            </Link>
            
            <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-sm tracking-tight">
              The premier destination for high-performance streetwear. Curating global trends for the next generation of style icons. Excellence is not an option; it's the standard.
            </p>
            
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all active:scale-95 shadow-xl">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Intelligence (Links) */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10">INTELLIGENCE</h4>
            <ul className="space-y-5">
              {['Home', 'Shop', 'Catalog', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-white font-black text-xs tracking-widest uppercase hover:text-blue-500 transition-colors flex items-center group"
                    onClick={scrollToTop}
                  >
                    <span>{item}</span>
                    <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-blue-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Protocol */}
          <div className="lg:col-span-3">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10">PROTOCOL</h4>
             <div className="space-y-6">
                <div className="flex items-start space-x-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Base Location</p>
                    <p className="text-xs font-black text-white italic tracking-tighter uppercase">Madina ARS, Accra, Ghana</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Secure Comms</p>
                    <p className="text-xs font-black text-white italic tracking-tighter uppercase">+233 549 759 032</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group cursor-default overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Encrypted Mail</p>
                    <p className="text-xs font-black text-white italic tracking-tighter uppercase truncate">angelatyron251@gmail.com</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Column 4: Newsletter / Global */}
          <div className="lg:col-span-3">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10">NEWSLETTER</h4>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 leading-loose">Initialize subscription to receive elite drop notifications.</p>
             <form className="relative group" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="NAME@DOMAIN.COM" 
                 className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black text-white placeholder:text-slate-700 focus:border-blue-500/50 transition-all outline-none"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 active:scale-90 transition-all">
                  <ArrowUpRight size={18} />
               </button>
             </form>
             
             <div className="mt-8 flex items-center space-x-6">
                <div className="flex items-center space-x-2 grayscale opacity-50">
                  <Globe size={14} className="text-blue-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Ops</span>
                </div>
                <div className="flex items-center space-x-2 grayscale opacity-50">
                  <ShieldCheck size={14} className="text-blue-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Secure Nexus</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2026 EXQUISITE BOUTIQUE. ALL MISSION DATA ENCRYPTED.
          </p>
          <div className="flex items-center space-x-8">
            {['Privacy Protocol', 'Terms of Service', 'Cookie Intel'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
          <button 
            onClick={scrollToTop}
            className="group flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:border-blue-500 group-hover:bg-blue-600 focus:outline-none">
              <ArrowUpRight className="rotate-[-45deg] text-slate-500 group-hover:text-white transition-all" size={16} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
