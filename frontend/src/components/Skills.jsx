import React, { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Monitor, Server, Database, Wrench, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Skills = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const containerRef = useRef(null);

  const skillCategories = [
    {
      title: 'Languages & OS',
      icon: <Code size={22} />,
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'Python', level: 85 },
        { name: 'C', level: 75 },
        { name: 'Linux', level: 80 }
      ]
    },
    {
      title: 'Frontend Development',
      icon: <Monitor size={22} />,
      skills: [
        { name: 'HTML & CSS', level: 95 },
        { name: 'React', level: 88 },
        { name: 'Tailwind CSS', level: 85 }
      ]
    },
    {
      title: 'Backend & Databases',
      icon: <Server size={22} />,
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Express.js', level: 88 },
        { name: 'MongoDB', level: 82 },
        { name: 'MySQL', level: 80 }
      ]
    },
    {
      title: 'Tools & Workflows',
      icon: <Wrench size={22} />,
      skills: [
        { name: 'Git & GitHub', level: 90 },
        { name: 'Postman', level: 85 },
        { name: 'VS Code', level: 92 }
      ]
    }
  ];

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const fills = containerRef.current.querySelectorAll('.progress-bar-fill');
      gsap.fromTo(fills,
        { width: '0%' },
        {
          width: (idx, target) => `${target.getAttribute('data-level')}%`,
          duration: 1.4,
          ease: 'power3.out',
          stagger: 0.05,
        }
      );
    }
  }, [isVisible]);

  return (
    <section id="skills" ref={sectionRef} className="skills-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Skills & Expertise
        </motion.h2>
        
        <div className="skills-grid" ref={containerRef}>
          {skillCategories.map((category, idx) => {
            const skillColors = ['color-pink', 'color-cyan', 'color-green', 'color-amber'];
            const colorClass = skillColors[idx % skillColors.length];
            return (
              <motion.div 
                key={idx} 
                className={`skills-category-card glass ${colorClass}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h3>{category.title}</h3>
                </div>
              
                <div className="skills-list">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          data-level={skill.level}
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
