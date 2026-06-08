import React, { useState, useEffect } from 'react';
import { Mail, FileText, ArrowRight } from 'lucide-react';
import { Github, Linkedin } from './CustomIcons';
import { motion } from 'framer-motion';

const Hero = ({ resumeUrl }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ['Full-Stack Web Developer', 'AI/ML Enthusiast', 'Problem Solver', 'B.Tech CSE Student'];

  useEffect(() => {
    let timer;
    const handleType = () => {
      const i = loopNum % words.length;
      const fullWord = words[i];

      if (!isDeleting) {
        setText(fullWord.substring(0, text.length + 1));
        setTypingSpeed(100);

        if (text === fullWord) {
          timer = setTimeout(() => {
            setIsDeleting(true);
            setTypingSpeed(40);
          }, 2000);
          return;
        }
      } else {
        setText(fullWord.substring(0, text.length - 1));
        setTypingSpeed(45);

        if (text === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setTypingSpeed(150);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Decorative Glows */}
      <div className="glow-effect" style={{ top: '15%', left: '10%' }}></div>
      <div className="glow-effect-secondary" style={{ bottom: '20%', right: '10%' }}></div>

      <div className="container hero-container">
        <motion.div 
          className="hero-content glass"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="live-dot"></span>
            Available for Internships & Placement
          </motion.div>
          
          <motion.h1 className="hero-title" variants={itemVariants}>
            Hi, I'm <br />
            <span className="highlight">Sandeep Prajapati</span>
          </motion.h1>
          
          <motion.h2 className="hero-subtitle" variants={itemVariants}>
            I am a <span className="typing-text">{text}</span><span className="cursor-blink">|</span>
          </motion.h2>
          
          <motion.p className="hero-tagline" variants={itemVariants}>
            I craft high-performance, beautifully interactive web applications, merging clean backend systems with AI capabilities to solve complex real-world problems.
          </motion.p>

          <motion.div className="hero-actions" variants={itemVariants}>
            <button onClick={() => scrollToSection('projects')} className="btn btn-primary">
              View Projects <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn btn-secondary">
              Contact Me
            </button>
            <a 
              href={resumeUrl || "/Sandeep_Prajapati_Resume.pdf"} 
              download 
              className="btn btn-outline"
            >
              <FileText size={18} /> Download Resume
            </a>
          </motion.div>

          <motion.div className="hero-socials" variants={itemVariants}>
            <a href="https://github.com/sandeepxth?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="GitHub">
              <Github size={22} />
            </a>
            <a href="https://www.linkedin.com/in/sandeep-prajapati-447b822b8" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="LinkedIn">
              <Linkedin size={22} />
            </a>
            <a href="mailto:sa10sandeep21@gmail.com" className="social-icon-link" title="Email">
              <Mail size={22} />
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Interactive Terminal Mockup */}
        <motion.div 
          className="hero-visual glass"
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.3 }}
        >
          <div className="terminal-header">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
            <span className="terminal-title">developer_terminal.js</span>
          </div>
          <div className="terminal-body">
            <p className="code-line"><span className="code-keyword">const</span> developer = &#123;</p>
            <p className="code-line indent-1">name: <span className="code-string">'Sandeep Prajapati'</span>,</p>
            <p className="code-line indent-1">contact: <span className="code-string">'+91 9869681384'</span>,</p>
            <p className="code-line indent-1">role: <span className="code-string">'Full-Stack Developer'</span>,</p>
            <p className="code-line indent-1">skills: [</p>
            <p className="code-line indent-2"><span className="code-string">'React'</span>, <span className="code-string">'Node.js'</span>, <span className="code-string">'Express'</span>,</p>
            <p className="code-line indent-2"><span className="code-string">'MongoDB'</span>, <span className="code-string">'Tailwind'</span>, <span className="code-string">'Gemini AI'</span></p>
            <p className="code-line indent-1">],</p>
            <p className="code-line indent-1">objective: <span className="code-string">'Build intelligent web solutions'</span>,</p>
            <p className="code-line indent-1">interests: [</p>
            <p className="code-line indent-2"><span className="code-string">'AI/ML'</span>, <span className="code-string">'Open Source'</span>, <span className="code-string">'Problem Solving'</span>]</p>
            <p className="code-line">&#125;;</p>
            <br />
            <p className="code-line"><span className="code-comment">// Ready to collaborate!</span></p>
            <p className="code-line"><span className="code-function">console</span>.<span className="code-method">log</span>(developer.objective);</p>
            <p className="code-line output">&gt;&gt; Build intelligent web solutions</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
