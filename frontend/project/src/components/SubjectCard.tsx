import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Star, StarHalf } from 'lucide-react';
import { NoteListResponse } from '../types';

interface SubjectCardProps {
  subject: NoteListResponse;
}

// Rotate through accent colors for variety
const accents = [
  { from: '#2563eb', to: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  { from: '#7c3aed', to: '#6d28d9', light: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  { from: '#0891b2', to: '#0e7490', light: '#ecfeff', border: '#a5f3fc', text: '#0e7490' },
  { from: '#059669', to: '#047857', light: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
  { from: '#d97706', to: '#b45309', light: '#fffbeb', border: '#fde68a', text: '#b45309' },
  { from: '#e11d48', to: '#be123c', light: '#fff1f2', border: '#fecdd3', text: '#be123c' },
];

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const navigate = useNavigate();
  const accent = accents[subject.id % accents.length];

  const rating = subject.average_rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Calculate discount
  const originalPrice = subject.price;
  const currentPrice = subject.discounted_price || subject.price;
  const discountPercentage = originalPrice > currentPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  return (
    <>
      <style>{`
        .scard {
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .scard:hover {
          border-color: var(--accent-border);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
          transform: translateY(-5px);
        }

        /* Top colored strip */
        .scard-header {
          padding: 24px 24px 20px;
          background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
          position: relative;
          overflow: hidden;
        }

        .scard-header::after {
          content: '';
          position: absolute;
          top: -30px;
          right: -30px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        .scard-header::before {
          content: '';
          position: absolute;
          bottom: -20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        .scard-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.18);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          border: 1px solid rgba(255,255,255,0.25);
        }

        .scard-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
          letter-spacing: -0.01em;
          position: relative;
          z-index: 1;
        }

        /* Stars rating row */
        .scard-stars {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 10px;
          position: relative;
          z-index: 1;
        }

        .scard-rating {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.75);
          margin-left: 4px;
          font-weight: 500;
        }

        /* Body */
        .scard-body {
          padding: 20px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .scard-desc {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.65;
          flex: 1;
          margin-bottom: 18px;
          min-height: 56px;
        }

        /* Tags */
        .scard-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .scard-tag {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          background: var(--accent-light);
          color: var(--accent-text);
          border: 1px solid var(--accent-border);
        }

        /* CTA button */
        .scard-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
        }

        .scard-btn:hover {
          opacity: 0.92;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          transform: translateY(-1px);
        }

        .scard-btn svg {
          transition: transform 0.2s ease;
        }

        .scard:hover .scard-btn svg {
          transform: translateX(4px);
        }

        /* Divider */
        .scard-divider {
          height: 1px;
          background: #f1f5f9;
          margin-bottom: 18px;
        }

        /* Price row */
        .scard-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .scard-price {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .scard-price-label {
          font-size: 0.72rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 500;
        }

        .scard-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
      `}</style>

      <div
        className="scard"
        style={{
          '--accent-from': accent.from,
          '--accent-to': accent.to,
          '--accent-light': accent.light,
          '--accent-border': accent.border,
          '--accent-text': accent.text,
        } as React.CSSProperties}
        onClick={() => navigate(`/subject/${subject.id}`)}
      >
        {/* Header */}
        <div className="scard-header">
          <div className="scard-icon">
            <BookOpen size={20} color="#ffffff" strokeWidth={2} />
          </div>
          <div className="scard-title">{subject.title}</div>
          <div className="scard-stars">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} size={11} fill="#fbbf24" strokeWidth={0} />
            ))}
            {hasHalfStar && <StarHalf size={11} fill="#fbbf24" strokeWidth={0} />}
            <span className="scard-rating">
              {rating > 0 ? rating.toFixed(1) : 'New'} · {subject.total_reviews} reviews
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="scard-body">
          <p className="scard-desc">{subject.description}</p>

          <div className="scard-tags">
            {subject.author && <span className="scard-tag">By {subject.author.full_name}</span>}
            <span className="scard-tag">Instant PDF</span>
          </div>

          <div className="scard-divider" />

          <div className="scard-price-row">
            <div>
              {discountPercentage > 0 && <div className="scard-price-label">Limited Time Offer</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                {discountPercentage > 0 && (
                  <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>
                    ₹{originalPrice}
                  </span>
                )}
                <span className="scard-price">₹{currentPrice}</span>
                {discountPercentage > 0 && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
            <span className="scard-badge">✓ Instant Access</span>
          </div>

          <button className="scard-btn">
            Preview &amp; Buy <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SubjectCard;