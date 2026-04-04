import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Package, Truck, CheckCircle, X, Search, Filter } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_urls)
          )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data } = await query
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status. Please try again.')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />
      case 'processing':
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />
      case 'shipped':
        return <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
      case 'completed':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">
            ORDER <span className="text-blue-500">TELEMETRY</span>
          </h1>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Monitor transactions & fulfillment states</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-2">
              Status Array
            </label>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
              >
                <option value="" className="bg-slate-950">All Directives</option>
                <option value="pending" className="bg-slate-950">Pending Review</option>
                <option value="processing" className="bg-slate-950">Processing</option>
                <option value="shipped" className="bg-slate-950">In Transit (Shipped)</option>
                <option value="completed" className="bg-slate-950">Completed Route</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
            <p className="text-xs font-black tracking-widest uppercase text-blue-500">Retrieving Telemetry...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/30">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Directive ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Identity
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Volume
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Value
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Inspect
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white-[0.02] transition-colors group">
                    <td className="px-6 py-4 text-sm font-black text-blue-500 tracking-wider">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-200 tracking-wide">
                        {order.email}
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        {order.order_items?.reduce((total, item) => total + item.quantity, 0) || 0} Units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-emerald-400 tracking-wider">
                        ₵{order.total_amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 tracking-widest">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 border border-transparent hover:border-blue-500/20 transition-all inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 text-sm font-black tracking-widest uppercase">
                      No directives found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl bg-slate-900 border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package size={120} className="text-blue-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                    DIRECTIVE <span className="text-blue-500">#{selectedOrder.id.slice(-8)}</span>
                  </h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                    Review and update process state
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Order Status */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block mb-2">
                  Transaction State Force
                </label>
                <div className="relative">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full bg-slate-950 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="pending" className="bg-slate-950">PENDING (Awaiting Review)</option>
                    <option value="processing" className="bg-slate-950">PROCESSING (Packaging)</option>
                    <option value="shipped" className="bg-slate-950">SHIPPED (In Transit)</option>
                    <option value="completed" className="bg-slate-950">COMPLETED (Delivered)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                 <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-2">Client Intelligence</h4>
                  <div className="bg-slate-950/40 p-6 rounded-3xl border border-white/5 space-y-3 shadow-inner">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Address</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject Name</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comms Interface</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{selectedOrder.shipping_address?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                 <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-2">Routing Destination</h4>
                  <div className="bg-slate-950/40 p-6 rounded-3xl border border-white/5 space-y-3 shadow-inner">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop Point</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{selectedOrder.shipping_address?.address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sector</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zipCode}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Territory</p>
                      <p className="text-sm font-bold text-slate-200 mt-1">{selectedOrder.shipping_address?.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-2">Manifest Contents</h4>
                <div className="space-y-4">
                   {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-6 p-4 bg-slate-950/40 rounded-3xl border border-white/5 group shadow-inner">
                      <div className="h-16 w-16 flex-shrink-0 rounded-2xl overflow-hidden bg-black border border-white/10">
                         <img
                          src={item.products?.image_urls?.[0] || '/placeholder-image.jpg'}
                          alt={item.products?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-200 tracking-wide">{item.products?.name}</h5>
                        <div className="flex items-center space-x-4 mt-2">
                           <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-white/5 px-2 py-1 rounded-md">Volt: {item.quantity}</p>
                           {item.size && <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-white/5 px-2 py-1 rounded-md">Dim: {item.size}</p>}
                           {item.color && <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase border border-[var(--color)] px-2 py-1 rounded-md" style={{'--color': item.color.toLowerCase()}}>{item.color}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Unit: ₵{item.price.toFixed(2)}</p>
                        <p className="text-lg font-black text-emerald-400 tracking-widest mt-1">₵{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass-card bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Time of Initialization</p>
                   <p className="text-xs font-bold text-slate-300">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Transaction Value</p>
                    <p className="text-3xl font-black text-emerald-400 tracking-tighter">₵{selectedOrder.total_amount.toFixed(2)}</p>
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default AdminOrders
