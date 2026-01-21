import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      alert('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">📦 Manage Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No orders found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Customer: {order.user?.name} ({order.user?.email})</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1 rounded font-semibold text-white ${
                      order.orderStatus === 'pending' ? 'bg-yellow-600' :
                      order.orderStatus === 'confirmed' ? 'bg-blue-600' :
                      order.orderStatus === 'shipped' ? 'bg-purple-600' :
                      order.orderStatus === 'delivered' ? 'bg-green-600' :
                      'bg-red-600'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Items:</h3>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item._id} className="text-sm text-gray-700 flex justify-between">
                      <span>{item.book?.title} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Delivery Address:</span> {order.deliveryAddress}
                </p>
                <p className="text-lg font-bold">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
