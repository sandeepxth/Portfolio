import React from 'react';
import { Mail } from 'lucide-react';
import { Github, Linkedin } from './CustomIcons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3>Sandeep Prajapati</h3>
          <p>Full-Stack Developer & AI Enthusiast</p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <div className="footer-links-grid">
            <button onClick={() => scrollToSection('home')}>Home</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('skills')}>Skills</button>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
            <button onClick={() => scrollToSection('experience')}>Experience</button>
            <button onClick={() => scrollToSection('certifications')}>Certifications</button>
          </div>
        </div>

        <div className="footer-socials">
          <h4>Connect</h4>
          <div className="footer-social-icons">
            <a href="https://github.com/sandeepxth?tab=repositories" target="_blank" rel="noopener noreferrer" title="GitHub">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/sandeep-prajapati-447b822b8" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="mailto:sa10sandeep21@gmail.com" title="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Sandeep Prajapati. All rights reserved. Designed for Placement & Internship Portfolios.</p>
      </div>
    </footer>
  );
};

export default Footer;
