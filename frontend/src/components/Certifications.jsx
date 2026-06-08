import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Award, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const LOCAL_FALLBACK_CERTS = [
  {
    title: 'Full Stack Developer Certificate',
    issuer: 'Simplilearn',
    date: '2025',
    credentialUrl: 'https://simpli-web.app.link/e/NUcgn8CCN3b',
  },
  {
    title: 'Generative AI',
    issuer: 'Simplilearn',
    date: '2025',
    credentialUrl: 'https://simpli-web.app.link/e/b5aKbKSCN3b',
  }
];

const Certifications = ({ backendUrl }) => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCerts = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${backendUrl}/api/certifications`);
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        setCerts(result.data);
      } else {
        setCerts(LOCAL_FALLBACK_CERTS);
      }
    } catch (err) {
      console.warn('Could not fetch certifications, falling back to offline samples:', err);
      setCerts(LOCAL_FALLBACK_CERTS);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, [backendUrl]);

  return (
    <section id="certifications" ref={sectionRef} className="certifications-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Certifications
        </motion.h2>
        
        {loading ? (
          <div className="certs-loading-state">
            <RefreshCw className="spinner-icon" />
            <p>Loading credentials...</p>
          </div>
        ) : (
          <div className="certs-grid">
            {certs.map((cert, idx) => (
              <motion.div 
                key={cert._id || idx} 
                className="cert-card glass glass-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -5, scale: 1.01 }}
              >
                <div className="cert-badge-icon">
                  <Award size={24} />
                </div>
                
                <div className="cert-details">
                  <h3>{cert.title}</h3>
                  <h4 className="cert-issuer">{cert.issuer}</h4>
                  <span className="cert-date">{cert.date}</span>
                </div>
                
                {cert.credentialUrl && (
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cert-verify-btn"
                    title="Verify Credential"
                  >
                    Verify <ExternalLink size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
