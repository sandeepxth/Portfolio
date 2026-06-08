import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Mail, Phone, Send, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';
import { Github, Linkedin } from './CustomIcons';
import { motion } from 'framer-motion';

const Contact = ({ backendUrl }) => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // null, true, false
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sa10sandeep21@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) return 'Please provide a valid email address';
    
    if (!subject.trim()) return 'Subject is required';
    if (!message.trim()) return 'Message is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setErrorMsg('');
    
    const validationError = validateForm();
    if (validationError) {
      setSuccess(false);
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`${backendUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSuccess(false);
        setErrorMsg(data.errors ? data.errors.join(', ') : data.message || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setSuccess(false);
      setErrorMsg('Network error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>
        
        <div className="contact-grid">
          <motion.div 
            className="contact-info glass"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Let's Chat</h3>
            <p>
              I am open to discuss web projects, internship opportunities, or AI ideas. Drop a message using the form or connect via standard social platforms!
            </p>
            
            <div className="contact-methods">
              <div className="contact-method-item">
                <div className="method-icon-box">
                  <Mail size={18} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h4>Email</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <a href="mailto:sa10sandeep21@gmail.com" className="email-link">sa10sandeep21@gmail.com</a>
                    <button 
                      onClick={handleCopyEmail}
                      type="button"
                      className="copy-btn btn-xs"
                      title="Copy Email"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        color: copied ? 'var(--success)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        transition: 'all 0.25s',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon-box">
                  <Phone size={18} />
                </div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:9869681384">+91 9869681384</a>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon-box">
                  <Linkedin size={18} />
                </div>
                <div>
                  <h4>LinkedIn</h4>
                  <a href="https://www.linkedin.com/in/sandeep-prajapati-447b822b8" target="_blank" rel="noopener noreferrer">sandeep-prajapati-447b822b8</a>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="method-icon-box">
                  <Github size={18} />
                </div>
                <div>
                  <h4>GitHub</h4>
                  <a href="https://github.com/sandeepxth?tab=repositories" target="_blank" rel="noopener noreferrer">sandeepxth</a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px' }}>
              <a 
                href="https://www.linkedin.com/in/sandeep-prajapati-447b822b8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline linkedin-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Linkedin size={18} /> Connect on LinkedIn
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form-container glass"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {success === true ? (
              <motion.div 
                className="success-animation-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                style={{ textAlign: 'center', padding: '40px 20px' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.25, 1] }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--success)', 
                    margin: '0 auto 24px',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <CheckCircle size={40} />
                </motion.div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Thank you for reaching out. Your message has been successfully delivered and an email notification has been dispatched to Sandeep. He will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSuccess(null)} 
                  className="btn btn-outline"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      disabled={loading}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      disabled={loading}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Internship / Project / Hello"
                    disabled={loading}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    disabled={loading}
                    className="form-input form-textarea"
                  ></textarea>
                </div>

                {success === false && (
                  <div className="form-alert alert-error">
                    <AlertCircle size={18} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'} <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
