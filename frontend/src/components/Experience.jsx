import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Experience = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const experiences = [
    {
      role: 'Web Developer Intern',
      company: 'Compozent',
      duration: 'Jan 2025',
      responsibilities: [
        'Designed, developed, and optimized reusable React components for production web applications.',
        'Maintained UI component libraries with cross-browser compatibility and responsive styling.',
        'Improved design system tokens and glassmorphism styling properties.',
        'Collaborated with designers to translate UI/UX wireframes into functional frontend components.'
      ]
    }
  ];

  return (
    <section id="experience" ref={sectionRef} className="experience-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Professional Experience
        </motion.h2>
        
        <div className="timeline">
          <div className="timeline-line"></div>
          
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx} 
              className="timeline-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="timeline-marker glass">
                <Briefcase size={16} />
              </div>
              
              <div className="timeline-content glass glass-hover">
                <div className="timeline-header">
                  <div>
                    <h3>{exp.role}</h3>
                    <h4 className="timeline-company">{exp.company}</h4>
                  </div>
                  <span className="timeline-duration">{exp.duration}</span>
                </div>
                
                <ul className="timeline-responsibilities">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx}>{resp}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
