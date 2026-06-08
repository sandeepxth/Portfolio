import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import CodingBackground from './components/CodingBackground';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' | 'admin'
  const [loading, setLoading] = useState(true);
  const [resumeExists, setResumeExists] = useState(false);

  useEffect(() => {
    // Check custom resume status
    fetch(`${BACKEND_URL}/api/resume/status`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResumeExists(data.exists);
        }
      })
      .catch(err => console.warn('Could not contact resume status endpoint. Serving local static file.', err));
  }, [currentView]);

  useEffect(() => {
    // Mimic initial resource loading for premium entrance animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  const resumeUrl = `${BACKEND_URL}/api/resume/download`;

  return (
    <ThemeProvider>
      <div className="app-wrapper">
        <CodingBackground />
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        {currentView === 'portfolio' ? (
          <main className="portfolio-main">
            <Hero resumeUrl={resumeUrl} />
            <About />
            <Skills />
            <Projects backendUrl={BACKEND_URL} />
            <Experience />
            <Education />
            <Certifications backendUrl={BACKEND_URL} />
            <Contact backendUrl={BACKEND_URL} />
          </main>
        ) : (
          <main className="admin-main">
            <Admin backendUrl={BACKEND_URL} />
          </main>
        )}
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
