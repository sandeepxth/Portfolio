import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Github } from './CustomIcons';
import { motion } from 'framer-motion';

const LOCAL_FALLBACK_PROJECTS = [
  {
    title: 'AI-Powered Health Prediction and Diet Recommendation System',
    description: 'An AI-driven health assessment and prediction system designed to analyze disease risks and generate customized dietary regimens using machine learning.',
    techStack: ['React', 'TypeScript', 'Python', 'Machine Learning'],
    features: [
      'Built an AI-driven health prediction system to assess disease risk and generate personalized diet plans',
      'Developed machine learning models in Python for health analysis and recommendation generation',
      'Integrated ML predictions with a responsive React and TypeScript frontend for seamless user experience'
    ],
    image: '/projects/health.png',
    githubUrl: 'https://github.com/sandeepxth/health-prediction-system',
    liveUrl: 'https://health-prediction-system.example.com',
  },
  {
    title: 'Disaster Management System',
    description: 'A centralized collaborative web platform to coordinate disaster alerts, map affected zones, and manage critical relief actions.',
    techStack: ['JavaScript', 'React', 'Tailwind CSS', 'MySQL'],
    features: [
      'Developed a centralized web platform to manage disaster alerts, affected areas, and relief operations',
      'Built secure backend APIs and integrated MySQL for user authentication, disaster reporting, resource management, and real-time updates',
      'Implemented advanced search and filtering features for quick retrieval of disaster records, relief resources, and affected population details'
    ],
    image: '/projects/disaster.png',
    githubUrl: 'https://github.com/sandeepxth/disaster-management-system',
    liveUrl: 'https://disaster-management.example.com',
  },
  {
    title: 'Personal Portfolio Website',
    description: 'A highly responsive developer portfolio showcasing profile details, skills, certifications, and projects, coupled with an admin dashboard.',
    techStack: ['React', 'CSS Modules', 'Node.js', 'Express.js', 'MongoDB'],
    features: [
      'Stunning dark theme with responsive glassmorphism card layouts',
      'Dynamic admin dashboard for updating projects, certifications, and uploaded resume files',
      'Secure token-based auth for administrative panels',
      'Responsive design catering to desktops, tablets, and mobile devices'
    ],
    image: '/projects/portfolio.png',
    githubUrl: 'https://github.com/sandeepxth/portfolio',
    liveUrl: 'https://sandeep-prajapati-portfolio.example.com',
  }
];

const Projects = ({ backendUrl }) => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05, triggerOnce: true });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${backendUrl}/api/projects`);
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        setProjects(result.data);
      } else {
        setProjects(LOCAL_FALLBACK_PROJECTS);
      }
    } catch (err) {
      console.warn('Could not fetch projects, falling back to offline samples:', err);
      setProjects(LOCAL_FALLBACK_PROJECTS);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [backendUrl]);

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        
        {loading ? (
          <div className="projects-loading-state">
            <RefreshCw className="spinner-icon" />
            <p>Loading projects...</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, idx) => {
              const projectColors = ['color-cyan', 'color-pink', 'color-purple', 'color-green', 'color-amber'];
              const colorClass = projectColors[idx % projectColors.length];
              return (
                <motion.div 
                  key={project._id || idx} 
                  className={`project-card glass glass-hover ${colorClass}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="project-card-header">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="project-img" />
                    ) : (
                      <div className="project-img-placeholder">
                        <span className="placeholder-tag">&lt;/&gt;</span>
                      </div>
                    )}
                  </div>

                  <div className="project-card-body">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    
                    <div className="project-features-list">
                      <strong>Key Features:</strong>
                      <ul>
                        {project.features && project.features.map((feature, fIdx) => (
                          <li key={fIdx}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="project-tech-badges">
                      {project.techStack && project.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className="project-card-footer">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-project-link github-link">
                        <Github size={16} /> GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-project-link live-link">
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
