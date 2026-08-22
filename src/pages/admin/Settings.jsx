import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Save, 
  Store, 
  Bell, 
  ShieldCheck, 
  Globe 
} from 'lucide-react'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  
  // Dummy state for UI demonstration
  const [settings, setSettings] = useState({
    storeName: 'Exquisite Boutique',
    contactEmail: 'contact@exquisite.boutique',
    currency: 'GHS (₵)',
    taxRate: '15',
    notificationsEnabled: true,
    maintenanceMode: false
  })

  // In a real implementation this would ping Supabase.
  const handleSave = async () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert("Settings saved successfully.")
    }, 800)
  }

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-1">
            STORE <span className="text-blue-500">SETTINGS</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Manage your store configuration, notifications, and preferences</p>
        </div>
        <div className="flex mt-6 sm:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gradient shadow-blue-500/20 from-blue-600 to-blue-800 flex items-center justify-center text-[10px] sm:text-xs tracking-widest uppercase"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'SAVING...' : 'SAVE SETTINGS'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-card rounded-[2rem] p-4 flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center px-4 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${
                activeTab === 'general'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:bg-black/5 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Store className="w-4 h-4 mr-3" />
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-4 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${
                activeTab === 'notifications'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:bg-black/5 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-4 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${
                activeTab === 'security'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:bg-black/5 hover:text-slate-900 border border-transparent'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-3" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('localization')}
              className={`flex items-center px-4 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${
                activeTab === 'localization'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:bg-black/5 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Globe className="w-4 h-4 mr-3" />
              Localization
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Store size={120} className="text-blue-500" />
               </div>
               <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase mb-8 flex items-center">
                 <Store className="w-5 h-5 text-blue-500 mr-3" />
                 GENERAL SETTINGS
               </h2>
               <div className="space-y-6 relative z-10 w-full max-w-2xl">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                     Store Name
                   </label>
                   <input
                     type="text"
                     value={settings.storeName}
                     onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                     className="input-glass w-full text-sm font-bold text-slate-800"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                     Contact Email
                   </label>
                   <input
                     type="email"
                     value={settings.contactEmail}
                     onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                     className="input-glass w-full text-sm text-slate-700"
                   />
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Bell size={120} className="text-emerald-500" />
               </div>
               <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase mb-8 flex items-center">
                 <Bell className="w-5 h-5 text-emerald-500 mr-3" />
                 NOTIFICATION SETTINGS
               </h2>
               <div className="space-y-6 relative z-10">
                 <div className="flex items-center justify-between p-4 bg-black/10 rounded-2xl border border-slate-200 group hover:border-emerald-500/20 transition-all">
                   <div>
                     <p className="text-sm font-bold text-slate-900 tracking-wide">Order Notifications</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Send automated emails to customers for their orders</p>
                   </div>
                   <button
                     onClick={() => handleToggle('notificationsEnabled')}
                     className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.notificationsEnabled ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-slate-800 border border-slate-600'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-white absolute transition-all ${settings.notificationsEnabled ? 'left-7 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'left-1'}`}></div>
                   </button>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <ShieldCheck size={120} className="text-rose-500" />
               </div>
               <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase mb-8 flex items-center">
                 <ShieldCheck className="w-5 h-5 text-rose-500 mr-3" />
                 SECURITY & MAINTENANCE
               </h2>
               <div className="space-y-6 relative z-10">
                 <div className="flex items-center justify-between p-4 bg-black/10 rounded-2xl border border-slate-200 group hover:border-rose-500/20 transition-all">
                   <div>
                     <p className="text-sm font-bold text-slate-900 tracking-wide">Maintenance Mode</p>
                     <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1 drop-shadow-md">When enabled, the store will be offline for customers</p>
                   </div>
                   <button
                     onClick={() => handleToggle('maintenanceMode')}
                     className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${settings.maintenanceMode ? 'bg-rose-500/20 border border-rose-500/50' : 'bg-slate-800 border border-slate-600'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-white absolute transition-all ${settings.maintenanceMode ? 'left-7 bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'left-1'}`}></div>
                   </button>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'localization' && (
            <div className="glass-card rounded-[2rem] p-6 lg:p-10 relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Globe size={120} className="text-indigo-500" />
               </div>
               <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase mb-8 flex items-center">
                 <Globe className="w-5 h-5 text-indigo-500 mr-3" />
                 LOCALIZATION
               </h2>
               <div className="space-y-6 relative z-10 w-full max-w-2xl">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">
                     Store Currency
                   </label>
                   <select
                     value={settings.currency}
                     onChange={(e) => setSettings({...settings, currency: e.target.value})}
                     className="input-glass w-full text-sm font-bold text-indigo-300 appearance-none bg-white border-indigo-500/20 focus:border-indigo-500"
                   >
                     <option value="GHS (₵)">GHS (₵)</option>
                     <option value="USD ($)">USD ($)</option>
                     <option value="EUR (€)">EUR (€)</option>
                   </select>
                 </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AdminSettings
