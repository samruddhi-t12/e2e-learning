import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Upload, Book, FileText, PlusCircle } from 'lucide-react';
import api from '../api';

const CreatorDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.is_staff) {
      fetchMyNotes();
    }
  }, [user]);

  const fetchMyNotes = async () => {
    try {
      const response = await api.get('/notes/my-notes/');
      setNotes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file.");
    
    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (discountedPrice) formData.append('discounted_price', discountedPrice);
    formData.append('main_pdf', file);
    formData.append('syllabus', JSON.stringify([]));

    try {
      await api.post('/notes/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowForm(false);
      setTitle('');
      setDescription('');
      setPrice('');
      setDiscountedPrice('');
      setFile(null);
      fetchMyNotes();
    } catch (err) {
      console.error(err);
      alert("Failed to upload note.");
    } finally {
      setUploading(false);
    }
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated || !user?.is_staff) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Creator Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.full_name}</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Upload New Note'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-4">Upload New Note</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea required className="w-full border rounded-lg p-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" className="w-full border rounded-lg p-2" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discounted Price (Optional)</label>
                  <input type="number" className="w-full border rounded-lg p-2" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload PDF Document</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <input required type="file" accept=".pdf" className="hidden" id="file-upload" onChange={e => setFile(e.target.files?.[0] || null)} />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-sm text-gray-600 font-semibold">{file ? file.name : "Click to select a PDF"}</span>
                    <span className="text-xs text-gray-400 mt-1">We will automatically generate a 3-page preview from this file.</span>
                  </label>
                </div>
              </div>
              <button disabled={uploading} type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {uploading ? 'Uploading and generating preview...' : 'Publish Note'}
              </button>
            </form>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">My Uploaded Notes</h2>
        {notes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You haven't uploaded any notes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{note.title}</h3>
                    <p className="text-xs text-gray-500">₹{note.discounted_price || note.price}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm border-t pt-3 mt-2">
                  <span className="text-gray-500">{note.total_reviews} Reviews</span>
                  <span className="font-semibold text-green-600">{note.average_rating > 0 ? `${note.average_rating} ⭐` : 'New'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
