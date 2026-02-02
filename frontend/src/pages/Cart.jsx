import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Delivery address is required');
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.map((item) => ({
          book: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        paymentMethod,
      };

      const response = await createOrder(orderData);

      if (paymentMethod === 'KHALTI') {
        // Redirect to Khalti payment page
        if (response.data.payment_url) {
          toast.success('Redirecting to Khalti payment...', {
            position: 'top-right',
            autoClose: 2000,
          });
          window.location.href = response.data.payment_url;
        }
      } else {
        // COD - Order placed successfully
        clearCart();
        toast.success('✅ Order placed successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });
        navigate('/my-orders');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to place order';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-fadeInUp">
        <div className="mb-6">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Start shopping to add books to your cart</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary inline-block"
        >
          🏠 Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fadeInUp">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🛍️ Your Shopping Cart</h1>
        <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Items</h2>
            </div>

            {cart.map((item, index) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-slideInLeft"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">📖</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm">by {item.author}</p>
                      <p className="text-blue-600 font-bold mt-2">₹{item.price}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-200 transition-colors rounded font-bold text-gray-700"
                    >
                      −
                    </button>
                    <span className="px-4 font-bold text-gray-800 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-200 transition-colors rounded font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>

                  {/* Total for item */}
                  <div className="text-right min-w-[6rem]">
                    <p className="font-bold text-lg text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        removeFromCart(item._id);
                        toast.info(`Removed "${item.title}" from cart`, {
                          position: 'bottom-right',
                          autoClose: 2000,
                        });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium mt-1 transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 Order Summary</h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideInLeft flex items-start">
              <span className="mr-3 flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="input-field min-h-24 resize-none"
                placeholder="Enter your complete delivery address..."
                required
              />
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-medium">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (0%):</span>
                <span className="font-medium">₹0.00</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between">
                <span className="font-bold text-lg text-gray-800">Total:</span>
                <span className="font-bold text-2xl text-blue-600">
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          
            {/* Payment Method Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="font-semibold text-gray-800 mb-3">💳 Select Payment Method</p>
              
              {/* Cash on Delivery Option */}
              <label className="flex items-center p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200" style={{ borderLeft: paymentMethod === 'COD' ? '4px solid #3b82f6' : '' }}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-blue-600"
                />
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-800">💵 Cash on Delivery</p>
                  <p className="text-xs text-gray-600">Pay when your order arrives</p>
                </div>
              </label>

              {/* Khalti Payment Option */}
              <label className="flex items-center p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:shadow-md transition-all duration-200" style={{ borderLeft: paymentMethod === 'KHALTI' ? '4px solid #9333ea' : '' }}>
                <input
                  type="radio"
                  name="payment"
                  value="KHALTI"
                  checked={paymentMethod === 'KHALTI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-purple-600"
                />
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-800">🎯 Pay with Khalti</p>
                  <p className="text-xs text-gray-600">Fast and secure online payment</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full btn-success text-center justify-center flex items-center gap-2 font-bold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : paymentMethod === 'KHALTI' ? (
                <>🎯 Pay with Khalti</>
              ) : (
                <>✓ Place Order</>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Continue Shopping
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
