import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Lock, FileText, Download, ShoppingCart,
  CheckCircle2, BookOpen, Clock, Award, Users,
  ChevronDown, ChevronUp, Star, StarHalf, User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import { NoteDetailResponse, Review } from '../types';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const SubjectPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  
  // Reviews state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Syllabus expansion
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}/`);
        setNote(response.data);
      } catch (error) {
        console.error('Failed to fetch note', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNote();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!note) return <Navigate to="/notes" replace />;

  const syllabus = Array.isArray(note.syllabus) ? note.syllabus : [];
  const discount = note.discounted_price
    ? Math.round((1 - Number(note.discounted_price) / Number(note.price)) * 100)
    : 0;
  const finalPrice = note.discounted_price ?? note.price;

  const features = [
    'Comprehensive coverage',
    'All previous year questions',
    'Instant digital access',
    'Secure watermarked download',
  ];

  const handleBuy = async () => {
    setPaying(true);
    try {
      // 1. Create order on backend
      const { data } = await api.post('/orders/create/', { note_id: note.id });
      
      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: data.currency,
        name: 'E2E Learning',
        description: note.title,
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          try {
            // 2. Verify payment on backend
            await api.post('/orders/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            // Reload page to unlock
            window.location.reload();
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Student',
          email: 'student@example.com'
        },
        theme: {
          color: '#2563eb'
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function () {
        alert('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to initiate payment. Are you logged in?');
      }
    } finally {
      setPaying(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');
    try {
      await api.post(`/notes/${note.id}/review/`, {
        rating: reviewRating,
        comment: reviewComment
      });
      // Refresh page to show new review
      window.location.reload();
    } catch (err: any) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/orders/download/${note.id}/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note.title}_E2E_Protected.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Download failed. Ensure you are logged in and purchased the note.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f2]" style={{ fontFamily: "'Georgia','Times New Roman',serif" }}>
      {/* ── STICKY TOPBAR ── */}
      <motion.div
        className="bg-white border-b border-gray-200 px-4 py-2.5 sticky top-0 z-30 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-800 leading-none truncate font-sans">{note.title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {!note.is_unlocked ? (
              <button
                onClick={handleBuy}
                disabled={paying}
                className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold font-sans px-3 py-1.5 rounded-lg transition"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {paying ? 'In Progress...' : 'Buy Now'}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="hidden sm:flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold font-sans px-3 py-1.5 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-5">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-5">
            {/* 1. SYLLABUS CARDS (if any) */}
            {syllabus.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {syllabus.slice(0, 4).map((unit: any, i: number) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold font-sans text-white bg-blue-500">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 font-sans leading-snug">{unit.title || `Unit ${i+1}`}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 2. PREVIEW PDF SECTION */}
            <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" {...fadeUp(0)}>
               <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-sm font-bold text-gray-800 font-sans">
                  {note.is_unlocked ? "Full PDF Access" : "Secure Preview (3 Pages)"}
                </h2>
              </div>
              <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center relative">
                {note.is_unlocked && note.main_pdf ? (
                  <iframe src={note.main_pdf.startsWith('http') ? note.main_pdf : `http://localhost:8000${note.main_pdf}`} className="w-full h-full border-0" title="Full Notes" />
                ) : note.preview_pdf ? (
                  <iframe src={note.preview_pdf.startsWith('http') ? note.preview_pdf : `http://localhost:8000${note.preview_pdf}`} className="w-full h-full border-0" title="Preview Notes" />
                ) : (
                  <p className="font-sans text-gray-500">Preview not available yet.</p>
                )}
                
                {!note.is_unlocked && (
                   <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-6">
                      <button onClick={handleBuy} className="bg-blue-600 text-white font-sans font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700">
                        Unlock Full Document
                      </button>
                   </div>
                )}
              </div>
            </motion.div>

            {/* 3. REVIEWS SECTION */}
            <motion.div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" {...fadeUp(0)}>
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 font-sans">Student Reviews</h2>
              </div>
              
              <div className="p-5">
                {note.reviews.length === 0 ? (
                  <p className="text-gray-500 font-sans">No reviews yet. Be the first!</p>
                ) : (
                  <div className="space-y-4">
                    {note.reviews.map((r) => (
                      <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-sans font-semibold text-gray-800">{r.user_name}</span>
                          <div className="flex text-amber-400">
                            {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                        </div>
                        <p className="font-sans text-sm text-gray-600">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Form (Only if unlocked) */}
                {note.is_unlocked && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-sans font-semibold text-gray-800 mb-3">Leave a Review</h3>
                    {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
                    <form onSubmit={submitReview} className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <label className="font-sans text-sm">Rating:</label>
                        <select 
                          value={reviewRating} 
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="border rounded px-2 py-1 font-sans text-sm"
                        >
                          {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                        </select>
                      </div>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full border rounded-lg p-3 font-sans text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                      <button 
                        type="submit" 
                        disabled={submittingReview}
                        className="bg-blue-600 text-white font-sans font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* ══ RIGHT: STICKY BUYING CARD ══ */}
          <motion.div
            className="w-full lg:w-[320px] shrink-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="lg:sticky lg:top-[56px]">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    {discount > 0 && (
                      <span className="text-sm text-gray-400 line-through font-sans">₹{note.price}</span>
                    )}
                    <span className="text-3xl font-bold text-gray-900 font-sans">₹{finalPrice}</span>
                    {discount > 0 && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-sans">{discount}% OFF</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-sans mb-4">
                    {note.is_unlocked ? "You own this item" : "One-time payment · Lifetime access"}
                  </p>

                  {!note.is_unlocked ? (
                    <motion.button
                      onClick={handleBuy}
                      disabled={paying}
                      className="w-full py-3 rounded-xl text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 mb-3 bg-blue-600"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {paying ? 'In Progress...' : 'Buy Now'}
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleDownload}
                      className="w-full py-3 rounded-xl text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 transition hover:opacity-90 bg-green-600 mb-3"
                    >
                      <Download className="w-4 h-4" /> Download Protected PDF
                    </motion.button>
                  )}

                  <ul className="space-y-2.5 mt-4">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-gray-600 font-sans leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                  <div className="flex flex-col items-center py-3 gap-0.5">
                    <span className="text-blue-500"><User className="w-3.5 h-3.5" /></span>
                    <span className="text-sm font-bold text-gray-800 font-sans">{note.author?.full_name || 'Admin'}</span>
                    <span className="text-[10px] text-gray-400 font-sans">Author</span>
                  </div>
                  <div className="flex flex-col items-center py-3 gap-0.5">
                    <span className="text-blue-500"><Star className="w-3.5 h-3.5" /></span>
                    <span className="text-sm font-bold text-gray-800 font-sans">{note.average_rating > 0 ? note.average_rating.toFixed(1) : 'New'}</span>
                    <span className="text-[10px] text-gray-400 font-sans">{note.total_reviews} Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default SubjectPreviewPage;