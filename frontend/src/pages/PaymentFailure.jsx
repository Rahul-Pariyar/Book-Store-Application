import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const [failureReason, setFailureReason] = useState('Payment was cancelled or declined');
  const navigate = useNavigate();

  useEffect(() => {
    const reason = searchParams.get('reason') || 'Payment was cancelled or declined';
    setFailureReason(reason);
    
    toast.error('❌ Payment Failed', {
      position: 'top-right',
      autoClose: 3000,
    });
  }, [searchParams]);

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
            <p className="text-gray-800 font-semibold text-lg">{failureReason}</p>
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
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span><strong>Contact Support:</strong> Reach out to us if the issue persists</span>
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
              onClick={() => navigate('/my-orders')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📋 View My Orders
            </button>
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
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            🏠 Continue Shopping
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Why did my payment fail?</h3>
            <p className="text-gray-700 text-sm">
              Payment failures can occur due to insufficient balance in your Khalti account, network issues, or security checks. Please verify your Khalti account and try again.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Is my data safe?</h3>
            <p className="text-gray-700 text-sm">
              Yes, Khalti uses industry-standard encryption and security protocols. Your payment information is completely secure.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">Will I be charged?</h3>
            <p className="text-gray-700 text-sm">
              No. If your payment failed, no amount has been deducted from your account. You can try again or use a different payment method.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2">How do I contact support?</h3>
            <p className="text-gray-700 text-sm">
              If you need further assistance, please contact our customer support team at support@bookstore.com or check the help section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
