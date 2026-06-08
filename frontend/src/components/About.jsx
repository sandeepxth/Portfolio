import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Code, Brain, Lightbulb, Globe, GraduationCap } from 'lucide-react';
import sandeepImg from '../assets/sandeep.png';
import { motion } from 'framer-motion';

const About = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const interests = [
    { icon: <Code size={24} />, title: 'Web Development', desc: 'Designing modern responsive SPAs and scalable REST APIs.' },
    { icon: <Brain size={24} />, title: 'Artificial Intelligence', desc: 'Integrating LLMs (like Gemini) to create smart tools and automations.' },
    { icon: <Lightbulb size={24} />, title: 'Problem Solving', desc: 'Applying algorithmic thinking to data-driven coding tasks.' },
    { icon: <Globe size={24} />, title: 'Open Source', desc: 'Contributing to developer tools and sharing projects with the community.' },
  ];

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>
        
        <div className="about-grid">
          <motion.div 
            className="about-image-wrapper glass"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-image-inner">
              <img src={sandeepImg} alt="Sandeep Prajapati" className="about-profile-img" />
              <div className="about-image-overlay"></div>
            </div>
          </motion.div>
 
          <motion.div 
            className="about-bio glass"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3>Who I Am</h3>
            <p>
              I am a dedicated <strong>Computer Science student</strong> and an aspiring <strong>Full-Stack Developer</strong>. My passion lies in constructing clean, performant web platforms that provide stellar user experiences and leverage modern AI technologies.
            </p>
            <p>
              With academic training in data structures, databases, and programming paradigms, I bridge theory and practice through hands-on development. I enjoy writing modular frontend elements as much as designing database schemas and server logic.
            </p>
            
            <div className="career-objective">
              <h4>Career Objective</h4>
              <p>
                To secure a challenging Web Developer internship/placement where I can apply my full-stack skillset, collaborate on scalable production applications, and continuously absorb modern industry paradigms.
              </p>
            </div>
          </motion.div>
 
          <motion.div 
            className="about-details"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="education-quick-card glass color-amber">
              <div className="education-icon-wrapper">
                <GraduationCap size={32} />
              </div>
              <div className="education-content">
                <h4>Academic Background</h4>
                <p className="college-name">B.Tech in Computer Science</p>
                <p className="edu-period">Expected Graduation: May 2027</p>
              </div>
            </div>
 
            <div className="interests-grid">
              {interests.map((interest, idx) => {
                const interestColors = ['color-cyan', 'color-pink', 'color-green', 'color-purple'];
                return (
                  <motion.div 
                    key={idx} 
                    className={`interest-card glass glass-hover ${interestColors[idx % interestColors.length]}`}
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <div className="interest-icon">{interest.icon}</div>
                    <h5>{interest.title}</h5>
                    <p>{interest.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
