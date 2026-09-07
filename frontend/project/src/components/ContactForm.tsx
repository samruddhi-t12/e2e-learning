import { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Letters and spaces only for name - silently block numbers/special chars
    if (name === 'name' && /[^a-zA-Z\s]/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      errs.name = 'Name must be at least 2 letters (no numbers allowed)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address';
    if (formData.message.trim().length < 10)
      errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    
    try {
      // Import api at the top if it's not already
      const api = (await import('../api')).default;
      await api.post('/contact/', formData);
      setIsSubmitted(true);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <>
        <style>{`
          .cf-section {
            background: #f8faff;
            padding: 80px 24px;
          }
          .cf-thankyou {
            max-width: 480px;
            margin: 0 auto;
            text-align: center;
            padding: 56px 40px;
            background: #ffffff;
            border-radius: 20px;
            border: 1.5px solid #e2e8f0;
            box-shadow: 0 8px 40px rgba(37,99,235,0.08);
          }
          .cf-check-circle {
            width: 72px; height: 72px;
            background: #eff6ff;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
            border: 2px solid #bfdbfe;
          }
          .cf-ty-title {
            font-size: 1.6rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
          }
          .cf-ty-sub {
            font-size: 0.95rem;
            color: #64748b;
            line-height: 1.7;
            margin-bottom: 28px;
          }
          .cf-ty-sub span { color: #2563eb; font-weight: 600; }
          .cf-back-btn {
            display: inline-block;
            padding: 10px 28px;
            border-radius: 10px;
            background: #2563eb;
            color: #fff;
            font-size: 0.875rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s;
            font-family: inherit;
          }
          .cf-back-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        `}</style>
        <div className="cf-section">
          <div className="cf-thankyou">
            <div className="cf-check-circle">
              <CheckCircle size={34} color="#2563eb" strokeWidth={2} />
            </div>
            <h2 className="cf-ty-title">Thank You!</h2>
            <p className="cf-ty-sub">
              We have received your message and will <span>respond within 24 hours</span>. Keep an eye on your inbox!
            </p>
            <button className="cf-back-btn" onClick={handleReset}>
              Send Another Message
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .cf-section {
          background: #f8faff;
          padding: 80px 24px;
          position: relative;
        }
        .cf-section::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(37,99,235,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .cf-inner { max-width: 560px; margin: 0 auto; }
        .cf-eyebrow {
          display: block;
          text-align: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          border: 1px solid #bfdbfe;
          margin: 0 auto 16px;
          width: fit-content;
        }
        .cf-title {
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .cf-title span { color: #2563eb; }
        .cf-sub {
          text-align: center;
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 40px;
        }
        .cf-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          padding: 36px 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }
        .cf-field { margin-bottom: 20px; }
        .cf-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.83rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 7px;
        }
        .cf-input, .cf-textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0f172a;
          background: #f8faff;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .cf-input:focus, .cf-textarea:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .cf-input.error, .cf-textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
        }
        .cf-input::placeholder, .cf-textarea::placeholder { color: #94a3b8; }
        .cf-textarea { resize: none; min-height: 130px; }
        .cf-error {
          font-size: 0.76rem;
          color: #ef4444;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cf-submit {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          background: #2563eb;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(37,99,235,0.3);
          margin-top: 8px;
        }
        .cf-submit:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(37,99,235,0.4);
        }
        @media (max-width: 600px) {
          .cf-card { padding: 24px 18px; }
        }
      `}</style>

      <section className="cf-section">
        <div className="cf-inner">
          <span className="cf-eyebrow">Contact Us</span>
          <h2 className="cf-title">Get in <span>Touch</span></h2>
          <p className="cf-sub">
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>

          <div className="cf-card">
            <form onSubmit={handleSubmit} noValidate>

              <div className="cf-field">
                <label className="cf-label" htmlFor="name">
                  <User size={14} /> Full Name
                </label>
                <input
                  className={'cf-input' + (errors.name ? ' error' : '')}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {errors.name && <p className="cf-error">&#x26A0; {errors.name}</p>}
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="email">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  className={'cf-input' + (errors.email ? ' error' : '')}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
                {errors.email && <p className="cf-error">&#x26A0; {errors.email}</p>}
              </div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="message">
                  <MessageSquare size={14} /> Message
                </label>
                <textarea
                  className={'cf-textarea' + (errors.message ? ' error' : '')}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                />
                {errors.message && <p className="cf-error">&#x26A0; {errors.message}</p>}
              </div>

              <button type="submit" className="cf-submit">
                <Send size={16} /> Send Message
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;