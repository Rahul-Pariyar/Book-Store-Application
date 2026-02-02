import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyKhaltiPayment } from '../services/api';
import { useCart } from '../context/CartContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pidx = searchParams.get('pidx');

        if (!pidx) {
          setError('Invalid payment reference. Please contact support.');
          setLoading(false);
          return;
        }

        // Verify payment with backend
        const response = await verifyKhaltiPayment(pidx);
        
        if (response.data.order) {
          setOrder(response.data.order);
          setIsSuccess(true);
          clearCart(); // Clear cart on successful payment
          toast.success('✅ Payment verified successfully!', {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Payment verification failed';
        setError(errorMsg);
        setIsSuccess(false);
        toast.error(errorMsg);
        console.error('Payment verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="inline-block">
            <span className="spinner text-4xl"></span>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-semibold">Verifying your payment...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  // Payment Failed
  if (!isSuccess && error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 animate-fadeInUp">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-red-500">
          {/* Failure Header */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 text-center border-b border-red-200">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-4xl font-bold text-red-700 mb-2">Payment Failed</h1>
            <p className="text-gray-700 text-lg">Your payment could not be processed.</p>
          </div>

          {/* Failure Details */}
          <div className="p-8 space-y-6">
            {/* Failure Reason */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 font-semibold mb-2 uppercase tracking-wide">Reason</p>
              <p className="text-gray-800 font-semibold text-lg">{error}</p>
            </div>

            {/* What You Can Do */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="font-bold text-blue-900 mb-3">💡 What You Can Do:</p>
              <ul className="text-sm text-blue-900 space-y-2">
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span><strong>Retry Payment:</strong> Try the payment again with your Khalti account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span><strong>Use Cash on Delivery:</strong> Place your order using COD instead</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span><strong>Check Your Account:</strong> Ensure your Khalti account has sufficient balance</span>
                </li>
              </ul>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">ℹ️ Note:</span> Your items are still in your cart. You can retry the payment or switch to another payment method.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  toast.info('Items are in your cart. Try a different payment method.', {
                    position: 'top-right',
                    autoClose: 2000,
                  });
                  navigate('/cart');
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🛒 Back to Cart
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🏠 Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Success
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 animate-fadeInUp">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-500">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 text-center border-b border-green-200">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-green-700 mb-2">Payment Successful!</h1>
          <p className="text-gray-700 text-lg">Your order has been confirmed and verified.</p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="p-8 space-y-6">
            {/* Order Number */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold mb-1">Order Number</p>
              <p className="text-2xl font-bold text-blue-600 font-mono break-all">{order._id}</p>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold mb-1">Total Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{order.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold mb-1">Payment Status</p>
                <p className="text-2xl font-bold text-green-600">✅ Paid</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">📚 Order Items</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items?.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.book?.title || 'Book Title'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Qty: <span className="font-bold">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{(item.price * item.quantity)?.toFixed(2)}</p>
                        <p className="text-xs text-gray-600 mt-1">₹{item.price?.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-semibold mb-2">📍 Delivery Address</p>
              <p className="text-gray-800">{order.deliveryAddress}</p>
            </div>

            {/* Order Status */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-semibold mb-2">Order Status</p>
              <p className="text-lg font-bold text-green-700">✅ Confirmed</p>
              <p className="text-sm text-gray-600 mt-2">Your order is confirmed. You will receive updates via email.</p>
            </div>

            {/* What's Next */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="font-semibold text-amber-900 mb-2">📧 What's Next?</p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>✓ Order confirmation email has been sent</li>
                <li>✓ Track your order in "My Orders"</li>
                <li>✓ Expected delivery in 3-5 business days</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate('/my-orders')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                📋 View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
