import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'

const OrderConfirmation = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
  }, [id])

  const fetchOrder = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
          products (name, image_urls)
          )
        `)
        .eq('id', id)
        .single()

      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <span className="text-sm text-gray-500">#{order.id.slice(-8)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p>{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                <p>{order.shipping_address?.address}</p>
                <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}</p>
                <p>{order.shipping_address?.country}</p>
                <p className="mt-2">Phone: {order.shipping_address?.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
              <div className="text-sm text-gray-600">
                <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>Status: <span className="font-medium text-primary-600">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  Total: ₵{order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.order_items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                <img
                  src={item.products?.image_urls?.[0] || '/placeholder-image.jpg'}
                  alt={item.products?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.products?.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                    {item.size && ` • Size: ${item.size}`}
                    {item.color && ` • Color: ${item.color}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₵{item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total: ₵{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm text-gray-700">We'll prepare your order for shipment</span>
            </div>
            <div className="flex items-center">
              <Truck className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm text-gray-700">You'll receive tracking information via email</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm text-gray-700">Your order will arrive within 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/profile"
            className="btn-primary flex items-center justify-center"
          >
            <Package className="w-4 h-4 mr-2" />
            View Order History
          </Link>
          <Link
            to="/shop"
            className="btn-secondary flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="btn-secondary flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

