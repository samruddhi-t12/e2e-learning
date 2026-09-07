import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, BookOpen, Package, LogOut, Mail, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isToggleDropdownOpen, setIsToggleDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserDropdownOpen(false);
      if (toggleRef.current && !toggleRef.current.contains(e.target)) setIsToggleDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); setIsUserDropdownOpen(false); navigate('/'); };

  const handleHomeClick = () => {
    setIsToggleDropdownOpen(false); setIsUserDropdownOpen(false);
    if (location.pathname === '/') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else { navigate('/'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); }
  };

  return (
    <>
      <style>{`
        .nav-root { background:#ffffff; border-bottom:1px solid #e2e8f0; position:sticky; top:0; z-index:100; box-shadow:0 1px 12px rgba(0,0,0,0.06); width:100%; }
        .nav-inner { width:100%; padding:0 16px; height:64px; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:12px; box-sizing:border-box; }
        .nav-left { display:flex; align-items:center; }
        .nav-brand { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .nav-brand-icon { width:34px; height:34px; background:#2563eb; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .nav-brand-text { font-size:1.05rem; font-weight:700; color:#1e3a8a; letter-spacing:-0.01em; white-space:nowrap; }
        .nav-mobile-title { display:none; font-size:0.92rem; font-weight:700; color:#1e3a8a; letter-spacing:-0.01em; white-space:nowrap; line-height:1.2; }
        .nav-mobile-title span { color:#2563eb; }
        .nav-center { display:flex; align-items:center; justify-content:center; font-size:1.05rem; font-weight:700; color:#1e3a8a; white-space:nowrap; letter-spacing:-0.01em; pointer-events:none; user-select:none; }
        .nav-center span { color:#2563eb; }
        .nav-right { display:flex; align-items:center; justify-content:flex-end; gap:8px; position:relative; }
        .icon-btn { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:9px; background:#f1f5f9; border:1px solid #e2e8f0; color:#475569; cursor:pointer; font-family:inherit; transition:all 0.2s; flex-shrink:0; }
        .icon-btn:hover { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
        .icon-btn.active { background:#eff6ff; border-color:#2563eb; color:#2563eb; }
        .dropdown { position:absolute; top:calc(100% + 10px); right:0; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 12px 40px rgba(0,0,0,0.12); overflow:hidden; animation:dropIn 0.18s ease; z-index:200; min-width:190px; }
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .dropdown-header { padding:12px 16px; background:#f8faff; border-bottom:1px solid #e2e8f0; }
        .dropdown-name { font-size:0.875rem; font-weight:600; color:#0f172a; }
        .dropdown-email { font-size:0.75rem; color:#94a3b8; margin-top:1px; }
        .dropdown-item { display:flex; align-items:center; gap:9px; padding:11px 16px; font-size:0.875rem; color:#374151; text-decoration:none; transition:all 0.15s; cursor:pointer; background:none; border:none; width:100%; text-align:left; font-family:inherit; font-weight:500; }
        .dropdown-item:hover { background:#f8faff; color:#2563eb; }
        .dropdown-item.danger { color:#ef4444; }
        .dropdown-item.danger:hover { background:#fff5f5; color:#dc2626; }
        .dropdown-divider { height:1px; background:#f1f5f9; }
        .relative { position:relative; }
        @media (max-width:768px) {
          .nav-inner { padding:0 8px; grid-template-columns:auto auto; gap:8px; }
          .nav-center { display:none; }
          .nav-brand-text { display:none; }
          .nav-mobile-title { display:block; }
          .nav-right { gap:6px; }
          .icon-btn { width:34px; height:34px; }
        }
      `}</style>

      <motion.nav
        className="nav-root"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="nav-brand" onClick={handleHomeClick}>
              <motion.div
                className="nav-brand-icon"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <BookOpen size={17} color="#ffffff" strokeWidth={2.5} />
              </motion.div>
              <span className="nav-brand-text">E2E</span>
              <span className="nav-mobile-title">Engineer 2 Engineer</span>
            </Link>
          </div>

          <span className="nav-center">Engineer&nbsp;2&nbsp;Engineer&nbsp;<span>Learning</span></span>

          <div className="nav-right">
            <button className={`icon-btn ${location.pathname === '/' ? 'active' : ''}`} onClick={handleHomeClick} title="Home">
              <Home size={18} />
            </button>

            <div className="relative" ref={userRef}>
              <button className={`icon-btn ${isUserDropdownOpen ? 'active' : ''}`}
                onClick={() => { setIsUserDropdownOpen(p => !p); setIsToggleDropdownOpen(false); }} title="Account">
                <User size={18} />
              </button>
              {isUserDropdownOpen && (
                <div className="dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="dropdown-header">
                        <div className="dropdown-name">{user?.full_name}</div>
                        <div className="dropdown-email">{user?.email}</div>
                      </div>
                      <Link to="/orders" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}><Package size={14} /> My Orders</Link>
                      {user?.is_staff && (
                        <Link to="/creator-dashboard" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}><BookOpen size={14} /> Creator Dashboard</Link>
                      )}
                      {user?.is_superuser && (
                        <Link to="/admin-dashboard" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}><BookOpen size={14} /> Admin Dashboard</Link>
                      )}
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item danger"><LogOut size={14} /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}><User size={14} /> Sign In</Link>
                      <div className="dropdown-divider" />
                      <Link to="/signup" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}><Package size={14} /> Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={toggleRef}>
              <button className={`icon-btn ${isToggleDropdownOpen ? 'active' : ''}`}
                onClick={() => { setIsToggleDropdownOpen(p => !p); setIsUserDropdownOpen(false); }} title="Menu">
                {isToggleDropdownOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              {isToggleDropdownOpen && (
                <div className="dropdown">
                  <Link to="/notes" className="dropdown-item" onClick={() => setIsToggleDropdownOpen(false)}><BookOpen size={15} /> Explore Notes</Link>
                  <div className="dropdown-divider" />
                  <Link to="/contact" className="dropdown-item" onClick={() => setIsToggleDropdownOpen(false)}><Mail size={15} /> Contact Us</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;