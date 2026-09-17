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
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900  tracking-tight uppercase mb-1">
            ORDER <span className="text-blue-500">MANAGEMENT</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-normal">Track and manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-3xl border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-normal pl-2 block mb-2">
              Filter by Status
            </label>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#f8f8f6] border border-slate-200 rounded-xl px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
              >
                <option value="" className="bg-[#f8f8f6]">All Orders</option>
                <option value="pending" className="bg-[#f8f8f6]">Pending</option>
                <option value="processing" className="bg-[#f8f8f6]">Packing</option>
                <option value="shipped" className="bg-[#f8f8f6]">On the Way (Shipped)</option>
                <option value="completed" className="bg-[#f8f8f6]">Delivered</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white/60 backdrop-blur-3xl border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
            <p className="text-xs font-semibold tracking-normal uppercase text-blue-500">Loading Orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#f8f8f6]/30">
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Order #
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Items
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Total
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white-[0.02] transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-blue-500 tracking-wider">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-800 tracking-wide">
                        {order.email}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mt-1">
                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-semibold text-slate-600 uppercase tracking-normal">
                      <span className="bg-black/5 px-2 py-1 rounded-md border border-slate-200">
                        {order.order_items?.reduce((total, item) => total + item.quantity, 0) || 0} Items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-emerald-400 tracking-wider">
                        ₵{order.total_amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-[10px] font-semibold rounded-lg border uppercase tracking-normal ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">
                          {order.status === 'completed' ? 'Delivered' : 
                           order.status === 'shipped' ? 'Shipped' : 
                           order.status === 'processing' ? 'Packing' : 
                           order.status === 'pending' ? 'Pending' : order.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-500 tracking-normal">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-xl bg-black/5 hover:bg-blue-500/10 text-slate-600 hover:text-blue-500 border border-transparent hover:border-blue-500/20 transition-all inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 text-sm font-semibold tracking-normal uppercase">
                      No orders found
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
        <div className="fixed inset-0 bg-[#f8f8f6]/80 backdrop-blur-sm overflow-x-hidden h-full w-full z-50 flex items-center pt-[10vh] pb-[10vh] justify-center p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl bg-white border border-slate-200 rounded-[3rem] p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package size={120} className="text-blue-500" />
            </div>

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold  tracking-tight text-slate-900 uppercase leading-none">
                    ORDER <span className="text-blue-500">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mt-2">
                    View and manage this customer's order
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-xl bg-black/5 hover:bg-red-500/10 text-slate-600 hover:text-red-500 border border-slate-200 hover:border-red-500/20 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Order Status */}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-normal pl-2 block mb-2">
                  Update Order Status
                </label>
                <div className="relative">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full bg-[#f8f8f6] border border-blue-500/30 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
                  >
                    <option value="pending" className="bg-[#f8f8f6]">Pending Review</option>
                    <option value="processing" className="bg-[#f8f8f6]">Packing & Processing</option>
                    <option value="shipped" className="bg-[#f8f8f6]">On the Way (Shipped)</option>
                    <option value="completed" className="bg-[#f8f8f6]">Delivered (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                 <div>
                  <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-normal mb-3 pl-2">Customer Details</h4>
                  <div className="bg-[#f8f8f6]/40 p-6 rounded-3xl border border-slate-200 space-y-3 shadow-inner">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Email Address</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Customer Name</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Phone Number</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.shipping_address?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                 <div>
                  <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-normal mb-3 pl-2">Shipping Address</h4>
                  <div className="bg-[#f8f8f6]/40 p-6 rounded-3xl border border-slate-200 space-y-3 shadow-inner">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Address</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.shipping_address?.address}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">City & State</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zipCode}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Country</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">{selectedOrder.shipping_address?.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-3 pl-2">Included Items</h4>
                <div className="space-y-4">
                   {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-6 p-4 bg-[#f8f8f6]/40 rounded-3xl border border-slate-200 group shadow-inner">
                      <div className="h-16 w-16 flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-slate-200">
                         <img
                          src={item.products?.image_urls?.[0] || '/placeholder-image.jpg'}
                          alt={item.products?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-800 tracking-wide">{item.products?.name}</h5>
                        <div className="flex items-center space-x-4 mt-2">
                           <p className="text-[10px] font-semibold text-slate-600 tracking-normal uppercase bg-black/5 px-2 py-1 rounded-md">Qty: {item.quantity}</p>
                           {item.size && <p className="text-[10px] font-semibold text-slate-600 tracking-normal uppercase bg-black/5 px-2 py-1 rounded-md">Size: {item.size}</p>}
                           {item.color && <p className="text-[10px] font-semibold text-slate-600 tracking-normal uppercase border border-[var(--color)] px-2 py-1 rounded-md" style={{'--color': item.color.toLowerCase()}}>{item.color}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-500 tracking-normal uppercase">Price: ₵{item.price.toFixed(2)}</p>
                        <p className="text-lg font-semibold text-emerald-400 tracking-normal mt-1">₵{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="glass-card bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                   <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-normal mb-1">Ordered At</p>
                   <p className="text-xs font-bold text-slate-700">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-normal mb-1">Total Amount</p>
                    <p className="text-3xl font-semibold text-emerald-400 tracking-tight">₵{selectedOrder.total_amount.toFixed(2)}</p>
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

