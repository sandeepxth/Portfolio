import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Terminal, Settings } from 'lucide-react';

const Navbar = ({ currentView, setCurrentView }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home', type: 'scroll' },
    { name: 'About', id: 'about', type: 'scroll' },
    { name: 'Skills', id: 'skills', type: 'scroll' },
    { name: 'Projects', id: 'projects', type: 'scroll' },
    { name: 'Experience', id: 'experience', type: 'scroll' },
    { name: 'Education', id: 'education', type: 'scroll' },
    { name: 'Certifications', id: 'certifications', type: 'scroll' },
    { name: 'Contact', id: 'contact', type: 'scroll' },
  ];

  const handleNavClick = (link) => {
    setIsOpen(false);
    if (currentView !== 'portfolio') {
      setCurrentView('portfolio');
      // Wait for view switch to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(link.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(link.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigateToAdmin = () => {
    setIsOpen(false);
    setCurrentView(currentView === 'admin' ? 'portfolio' : 'admin');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="nav-logo" onClick={() => handleNavClick({ id: 'home' })}>
          <div className="logo-icon-wrapper">
            <Terminal size={22} className="logo-icon" />
          </div>
          <span className="logo-text">
            Sandeep<span className="logo-dot">.</span><span className="logo-subtext">Prajapati</span>
            <span className="logo-cursor">_</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="nav-desktop">
          {currentView === 'portfolio' && navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className="nav-link-btn"
            >
              {link.name}
            </button>
          ))}
          {currentView !== 'portfolio' && (
            <button onClick={() => setCurrentView('portfolio')} className="nav-link-btn">
              Back to Portfolio
            </button>
          )}

          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={navigateToAdmin} 
            className={`admin-toggle-btn ${currentView === 'admin' ? 'active' : ''}`}
            title="Admin Dashboard"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="nav-mobile-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button onClick={navigateToAdmin} className={`admin-toggle-btn ${currentView === 'admin' ? 'active' : ''}`}>
            <Settings size={18} />
          </button>

          <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle-btn" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="nav-mobile-menu glass">
          {currentView === 'portfolio' && navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className="mobile-nav-link"
            >
              {link.name}
            </button>
          ))}
          {currentView !== 'portfolio' && (
            <button
              onClick={() => {
                setCurrentView('portfolio');
                setIsOpen(false);
              }}
              className="mobile-nav-link"
            >
              Back to Portfolio
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
