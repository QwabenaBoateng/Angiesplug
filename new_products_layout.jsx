    <div className="space-y-8">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity bg-blue-500"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Products by Category</h3>
            <span className="text-[10px] font-black text-blue-500 tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Total: {totalProducts}</span>
          </div>
          <div className="relative z-10">
            <PieChart counts={countsByCat} />
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity bg-indigo-500"></div>
          <h3 className="relative z-10 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Category Distribution</h3>
          <div className="relative z-10">
            <BarChart counts={countsByCat} />
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity bg-emerald-500"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Deployment (7 Days)</h3>
            <span className="text-[10px] font-black text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{sparkCounts.reduce((a,b)=>a+b,0)}</span>
          </div>
          <div className="relative z-10">
            <Sparkline values={sparkCounts} />
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-2">
              {sparkDays.map((d, i) => (
                <span key={i}>{d.toLocaleDateString(undefined, { day: '2-digit' })}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            INVENTORY <span className="text-blue-500">CONTROL</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Manage product database & assets</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowBrandModal(true)}
            className="btn-glass flex items-center justify-center text-xs tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2 text-indigo-400" />
            REGISTER BRAND
          </button>
          <button
            onClick={openModal}
            className="btn-gradient flex items-center justify-center text-xs tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" />
            DEPLOY PRODUCT
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-2">
              Search Parameters
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Query by nomenclature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass pl-12 w-full text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block mb-2">
              Taxonomy Filter
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-glass w-full text-sm appearance-none bg-slate-900"
            >
              <option value="">Global Array</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
              }}
              className="w-full btn-glass flex items-center justify-center text-xs tracking-widest"
            >
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              FLUSH FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-[2rem] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
            <p className="text-xs font-black tracking-widest uppercase text-blue-500">Querying Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Taxonomy
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Value
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Directives
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white-[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-black/50">
                          <img
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                            src={product.image_urls?.[0] || '/placeholder-image.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white tracking-wide">
                            {product.name}
                          </div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-xs mt-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-300">
                         {product.categories?.name || 'Unbound'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-blue-400 tracking-wider">
                         ₵{product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${
                        product.featured
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {product.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-500 tracking-widest">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 border border-transparent hover:border-blue-500/20 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 text-sm font-black tracking-widest uppercase">
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
