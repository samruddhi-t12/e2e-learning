import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Package, FileText, Activity } from 'lucide-react';
import api from '../api';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'notes' | 'users' | 'orders'>('notes');
  const [data, setData] = useState({ notes: [], users: [], orders: [] });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user?.is_superuser) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      const [notesRes, usersRes, ordersRes] = await Promise.all([
        api.get('/notes/'), // In production, an admin endpoint for notes might be better
        api.get('/admin/users/'),
        api.get('/orders/admin/orders/')
      ]);
      setData({ notes: notesRes.data, users: usersRes.data, orders: ordersRes.data });
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
  if (!isAuthenticated || !user?.is_superuser) return <Navigate to="/" replace />;

  const revenue = data.orders.filter((o: any) => o.is_paid).reduce((sum: number, o: any) => sum + (Number(o.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-gray-500">Platform overview and management</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${revenue}`, icon: <Activity className="w-6 h-6 text-green-600" />, bg: 'bg-green-100' },
            { label: 'Total Notes', value: data.notes.length, icon: <FileText className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100' },
            { label: 'Total Users', value: data.users.length, icon: <Users className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100' },
            { label: 'Successful Orders', value: data.orders.filter((o:any)=>o.is_paid).length, icon: <Package className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-100' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {(['notes', 'users', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'users' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{u.full_name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.is_staff ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Staff/Creator</span> : <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Student</span>}
                    </td>
                    <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'orders' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Note</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{o.user_email}</td>
                    <td className="px-6 py-4 font-semibold">{o.note_title}</td>
                    <td className="px-6 py-4">₹{o.amount}</td>
                    <td className="px-6 py-4">
                      {o.is_paid ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Paid</span> : <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Pending</span>}
                    </td>
                    <td className="px-6 py-4">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'notes' && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Author</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.notes.map((n: any) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{n.title}</td>
                    <td className="px-6 py-4">{n.author?.full_name || 'Admin'}</td>
                    <td className="px-6 py-4">₹{n.discounted_price || n.price}</td>
                    <td className="px-6 py-4">{n.total_reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
