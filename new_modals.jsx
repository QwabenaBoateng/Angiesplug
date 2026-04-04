      {/* Product Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl glass-card rounded-[3rem] p-8 sm:p-12 border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package size={120} className="text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase">
                  {editingProduct ? 'EDIT ' : 'DEPLOY '}<span className="text-blue-500">PRODUCT</span>
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Product Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-glass w-full text-sm"
                    placeholder="E.g., Carbon Fiber Jacket"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Commercial Value (₵)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="input-glass w-full text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Detailed Specifications
                </label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-glass w-full text-sm resize-none"
                  placeholder="Outline product parameters and features..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Taxonomy Binding
                  </label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    className="input-glass w-full text-sm appearance-none bg-slate-900"
                  >
                    <option value="">Select logical group</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4 bg-white/5 border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setProductForm(prev => ({ ...prev, featured: !prev.featured }))}>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${productForm.featured ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'}`}>
                     {productForm.featured && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Mark as Featured</p>
                    <p className="text-[10px] font-bold text-slate-500">Prioritize in catalog</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Visual Asset Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Visual Assets
                </label>
                <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center ${uploadingImages ? 'border-blue-500/50 bg-blue-500/5 cursor-wait' : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer bg-black/20'}`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    {uploadingImages ? (
                      <>
                        <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
                        <span className="text-xs font-black tracking-widest uppercase text-blue-500 text-center">Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-300 text-center">Click to Interface</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 text-center">JPG, PNG, WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Display uploaded images */}
                {productForm.image_urls.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {productForm.image_urls.map((url, index) => (
                      <div key={index} className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-square bg-slate-900">
                        <img
                          src={url}
                          alt={`Asset ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="btn-gradient shadow-blue-500/20 text-[10px] sm:text-xs tracking-widest"
                >
                  {editingProduct ? 'APPLY CONFIGURATION' : 'INITIALIZE ASSET'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Brand Modal */}
      {showBrandModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-2xl glass-card rounded-[3rem] p-8 sm:p-12 border-white/5 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Building2 size={120} className="text-indigo-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Plus className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase">
                  REGISTER <span className="text-indigo-500">BRAND</span>
                </h3>
              </div>
              <button
                onClick={() => setShowBrandModal(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBrandSubmit} className="space-y-8 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Brand Distinction
                </label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-glass w-full text-sm"
                  placeholder="Official Brand Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Brand Intelligence
                </label>
                <textarea
                  required
                  rows={3}
                  value={brandForm.description}
                  onChange={(e) => setBrandForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-glass w-full text-sm resize-none"
                  placeholder="Design ideology or mission statement..."
                />
              </div>

              {/* Brand Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                  Identity Marker (Logo/Banner)
                </label>
                <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center ${uploadingBrandImage ? 'border-indigo-500/50 bg-indigo-500/5 cursor-wait' : 'border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer bg-black/20'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBrandImageUpload(e.target.files[0])}
                    className="hidden"
                    id="brand-image-upload"
                    disabled={uploadingBrandImage}
                  />
                  <label
                    htmlFor="brand-image-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    {uploadingBrandImage ? (
                      <>
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
                        <span className="text-xs font-black tracking-widest uppercase text-indigo-500 text-center">Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-2xl">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-300 text-center">Load Asset</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2 text-center">Raster graphics</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Display uploaded brand image */}
                {brandForm.image_url && (
                  <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/30">
                    <img
                      src={brandForm.image_url}
                      alt="Identity preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-[10px] sm:text-xs tracking-widest uppercase"
                >
                  Register Identity
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
