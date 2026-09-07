import Hero from '../components/Hero';
import Features from '../components/Features';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';

const faqs = [
  { question: 'How quickly will you respond?',     answer: 'We aim to respond to all inquiries within 24 hours on business days.' },
  { question: 'Do you offer free consultations?',  answer: 'Yes! We offer a complimentary 30-minute consultation to discuss your needs.' },
  { question: 'What information should I include?', answer: 'Share as much detail as possible about your project, timeline, and budget so we can help you effectively.' },
  { question: 'Can I request a callback?',          answer: 'Absolutely. Just include your phone number and preferred time in your message.' },
  { question: 'Is my information kept private?',    answer: 'We take privacy seriously. Your details are never shared with third parties.' },
];

const FAQSection = () => (
  <div className="faq-section">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="faq-eyebrow">FAQ</div>
      <h2 className="faq-heading">Common Questions</h2>
      <p className="faq-subtext">
        Everything you need to know before reaching out. Can't find an answer?{' '}
        <span className="faq-highlight">We're happy to help.</span>
      </p>
    </motion.div>

    <div className="faq-list">
      {faqs.map((faq, i) => (
        <motion.details
          key={i}
          className="faq-item"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <summary className="faq-question">
            <span>{faq.question}</span>
            <span className="faq-icon">+</span>
          </summary>
          <p className="faq-answer">{faq.answer}</p>
        </motion.details>
      ))}
    </div>
  </div>
);

const ContactSection = () => (
  <section className="contact-section">
    <div className="contact-inner">
      <FAQSection />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <ContactForm />
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div style={{ background: '#f8faff' }}>
      <Hero />
      <Features />
      <ContactSection />

      <style>{`
        .contact-section { padding: 48px 24px; background: #f8faff; }
        .contact-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
        .contact-divider { width: 1px; background: #e0ddd8; align-self: stretch; margin-top: 8px; }
        .faq-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #b07d4f; margin-bottom: 12px; }
        .faq-heading { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: #1a1a1a; margin: 0 0 14px; line-height: 1.2; letter-spacing: -0.02em; }
        .faq-subtext { font-size: 15px; color: #666; line-height: 1.65; margin: 0 0 20px; }
        .faq-highlight { color: #b07d4f; font-weight: 500; }
        .faq-list { display: flex; flex-direction: column; gap: 4px; }
        .faq-item { border-radius: 10px; overflow: hidden; background: #fff; border: 1px solid #ece9e4; transition: border-color 0.2s; }
        .faq-item[open] { border-color: #b07d4f44; }
        .faq-question { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 18px; font-size: 14.5px; font-weight: 600; color: #1a1a1a; cursor: pointer; list-style: none; user-select: none; transition: color 0.2s; }
        .faq-question::-webkit-details-marker { display: none; }
        .faq-item[open] .faq-question { color: #b07d4f; }
        .faq-icon { font-size: 20px; font-weight: 300; color: #b07d4f; flex-shrink: 0; transition: transform 0.25s ease; line-height: 1; }
        .faq-item[open] .faq-icon { transform: rotate(45deg); }
        .faq-answer { font-size: 14px; color: #555; line-height: 1.7; padding: 0 18px 18px; margin: 0; }
        @media (max-width: 768px) { .contact-inner { grid-template-columns: 1fr; } .contact-divider { width: 100%; height: 1px; margin: 0; } }
      `}</style>
    </div>
  );
};

export default HomePage;
