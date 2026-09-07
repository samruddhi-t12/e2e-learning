import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, TrendingUp, Target, FileText,
  Zap, Clock, Users, MousePointer2
} from 'lucide-react';

const features = [
  { icon: <CheckCircle size={20} />, title: 'All PYQs Covered', desc: '10 years of previous year questions with step-by-step solutions.', tag: '10 Yrs Coverage' },
  { icon: <TrendingUp size={20} />, title: '9+ SGPA Focus', desc: 'Handpicked based on university scoring patterns to maximize grades.', tag: 'Score Booster' },
  { icon: <Target size={20} />, title: 'Insem High-Weightage', desc: 'Crisp sections covering exactly what examiners want to see.', tag: '25+ Marks Focus' },
  { icon: <FileText size={20} />, title: 'Exam-Oriented Notes', desc: 'No fluff. Quick revision sheets included for last-night prep.', tag: 'Smart Study' },
  { icon: <Zap size={20} />, title: 'Last-Night Revision', desc: 'Compact cheat sheets covering all key formulas and concepts.', tag: 'Quick Prep' },
  { icon: <Clock size={20} />, title: 'Instant Access', desc: 'Download & start studying within minutes of purchase.', tag: 'No Waiting' },
  { icon: <Users size={20} />, title: 'Peer-Verified', desc: 'Reviewed by 500+ students who already scored 9+ SGPA.', tag: 'Trusted' },
];

const allCards = [...features, ...features, ...features];

const Features = () => {
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const userActive = useRef(false);
  const SPEED = 0.6;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleW = el.scrollWidth / 3;
    el.scrollLeft = singleW;

    const tick = () => {
      if (!userActive.current) {
        el.scrollLeft += SPEED;
        if (el.scrollLeft >= singleW * 2) el.scrollLeft -= singleW;
        if (el.scrollLeft <= 0) el.scrollLeft += singleW;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      <style>{`
        .feat-section { 
          background: #fcfcfd; /* Very slight off-white to make cards pop */
          padding: 60px 0; 
          position: relative; 
          overflow: hidden; 
        }
        
        .feat-header { text-align: center; padding: 0 20px; margin-bottom: 40px; }
        
        .feat-eyebrow { 
          font-size: 0.65rem; font-weight: 700; color: #6366f1; 
          text-transform: uppercase; letter-spacing: 0.12em; 
          margin-bottom: 8px; display: block; 
        }
        
        .feat-title { 
          font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 800; 
          color: #0f172a; letter-spacing: -0.03em; line-height: 1.1;
        }
        
        .feat-title span { color: #6366f1; }

        .feat-scroll-wrap { position: relative; width: 100%; margin-top: 20px; }
        
        .feat-scroll { 
          overflow-x: scroll; overflow-y: hidden; 
          scrollbar-width: none; position: relative; padding: 10px 0 30px;
        }
        .feat-scroll::-webkit-scrollbar { display: none; }
        
        .feat-track { display: flex; gap: 16px; padding: 0 20px; }

        .feat-card { 
          flex-shrink: 0; 
          width: 280px; 
          background: #ffffff; 
          border-radius: 16px; 
          padding: 24px; 
          /* The Border fix */
          border: 1px solid #e2e8f0; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        
        .feat-card:hover { 
          border-color: #6366f1;
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -8px rgba(99, 102, 241, 0.15);
        }

        .feat-icon-wrap { 
          width: 40px; height: 40px; border-radius: 10px; 
          display: flex; align-items: center; justify-content: center; 
          background: #f1f5f9; color: #475569; margin-bottom: 16px;
        }
        
        .feat-card:hover .feat-icon-wrap { background: #6366f1; color: white; }

        .feat-tag { 
          font-size: 0.6rem; font-weight: 700; color: #6366f1; 
          background: #eff6ff; padding: 3px 8px; 
          border-radius: 6px; display: inline-block; margin-bottom: 10px;
        }

        .feat-card-title { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .feat-card-desc { font-size: 0.8rem; color: #64748b; line-height: 1.5; }

        .feat-hint {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: -10px; color: #94a3b8; font-size: 0.75rem;
        }

        /* Mobile Responsiveness Improvements */
        @media (max-width: 640px) {
          .feat-section { padding: 40px 0; }
          .feat-track { gap: 12px; padding: 0 16px; }
          .feat-card { 
            width: 75vw; /* Shows a peek of the next card */
            padding: 20px; 
            border-radius: 14px;
          }
          .feat-header { margin-bottom: 24px; }
          .feat-title { font-size: 1.6rem; }
        }
      `}</style>

      <section className="feat-section">
        <div className="feat-header">
          <motion.span className="feat-eyebrow">Premium Study Experience</motion.span>
          <h2 className="feat-title">
            The Topper’s <span>Secret Weapon</span>
          </h2>
        </div>

        <div className="feat-scroll-wrap">
          <div
            ref={scrollRef}
            className="feat-scroll"
            onMouseEnter={() => userActive.current = true}
            onMouseLeave={() => userActive.current = false}
            onTouchStart={() => userActive.current = true}
            onTouchEnd={() => userActive.current = false}
          >
            <div className="feat-track">
              {allCards.map((f, i) => (
                <div key={i} className="feat-card">
                  <div className="feat-icon-wrap">{f.icon}</div>
                  <div className="feat-tag">{f.tag}</div>
                  <h3 className="feat-card-title">{f.title}</h3>
                  <p className="feat-card-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="feat-hint">
          <MousePointer2 size={12} />
          <span>Swipe to explore more</span>
        </div>
      </section>
    </>
  );
};

export default Features;
