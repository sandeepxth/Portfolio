import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Award, BookOpen, Calendar } from 'lucide-react';

const Education = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const educationHistory = [
    {
      degree: 'Bachelor of Technology in Computer Science',
      college: 'Shree L.R. Tiwari College of Engineering, Mira Road',
      duration: 'Jul 2023 – May 2027',
      grade: '7.5 CGPA',
      icon: <BookOpen size={28} />
    },
    {
      degree: 'Higher Secondary Education',
      college: 'Patkar College, Goregaon',
      duration: 'Jul 2021 – May 2023',
      grade: '72%',
      icon: <Award size={28} />
    }
  ];

  const relevantCourses = [
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Object Oriented Programming',
    'Web Technologies',
    'Software Engineering',
    'Machine Learning'
  ];

  return (
    <section id="education" ref={sectionRef} className={`education-section ${isVisible ? 'reveal' : 'hidden'}`}>
      <div className="container">
        <h2 className="section-title">Education</h2>
        
        <div className="education-grid">
          <div className="education-cards-list">
            {educationHistory.map((edu, idx) => (
              <div key={idx} className="education-card glass glass-hover" style={{ marginBottom: '20px' }}>
                <div className="edu-card-header">
                  <div className="edu-icon-wrapper">
                    {edu.icon}
                  </div>
                  <div>
                    <h3 className="degree-title">{edu.degree}</h3>
                    <p className="college-text">{edu.college}</p>
                  </div>
                </div>
                
                <div className="edu-meta" style={{ marginTop: '12px' }}>
                  <span className="edu-meta-item">
                    <Calendar size={16} style={{ color: 'var(--accent)' }} /> {edu.duration}
                  </span>
                  <span className="edu-meta-item">
                    <Award size={16} style={{ color: 'var(--accent)' }} /> {edu.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="courses-card glass">
            <div className="edu-card-header">
              <Award size={28} className="edu-icon" />
              <h3>Relevant Coursework</h3>
            </div>
            
            <div className="courses-list">
              {relevantCourses.map((course, idx) => (
                <span key={idx} className="course-badge glass glass-hover">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
