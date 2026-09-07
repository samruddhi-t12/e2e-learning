import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, DollarSign, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders/');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleDownload = async (noteId: number, noteTitle: string) => {
    try {
      const response = await api.get(`/orders/download/${noteId}/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${noteTitle}_E2E_Protected.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Download failed. Ensure you are logged in and purchased the note.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading your orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">My Orders</h1>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-12 text-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start exploring our notes collection!</p>
            <motion.button
              onClick={() => navigate('/notes')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Browse Notes
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{order.note.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>₹{order.note.price || 'Paid'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <span>Razorpay ID: {order.razorpay_payment_id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => navigate(`/subject/${order.note.id}`)}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      <FileText className="w-4 h-4" /> View Details
                    </motion.button>
                    <motion.button
                      onClick={() => handleDownload(order.note.id, order.note.title)}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;