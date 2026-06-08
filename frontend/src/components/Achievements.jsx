import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Trophy, Code, Briefcase, Rocket } from 'lucide-react';

const Achievements = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const achievements = [
    {
      icon: <Briefcase size={28} />,
      title: 'Internship Offers',
      value: '2+ Placements',
      desc: 'Secured summer development roles at mid-tier firms specializing in AI integrations and cloud systems.'
    },
    {
      icon: <Trophy size={28} />,
      title: 'Hackathons',
      value: 'Top 10 Finalist',
      desc: 'Led a team of three at GTU Annual Hackathon 2025, creating an AI-driven disaster alert dashboard using web sockets.'
    },
    {
      icon: <Code size={28} />,
      title: 'Coding Contests',
      value: 'LeetCode 1700+ Rating',
      desc: 'Solved 450+ data structures and algorithm challenges on LeetCode; active participant in weekly contest panels.'
    },
    {
      icon: <Rocket size={28} />,
      title: 'Project Milestones',
      value: '300+ Github Stars',
      desc: 'Open-sourced multiple projects, receiving positive developer traffic and feature proposals for HealthAI.'
    }
  ];

  return (
    <section id="achievements" ref={sectionRef} className={`achievements-section ${isVisible ? 'reveal' : 'hidden'}`}>
      <div className="container">
        <h2 className="section-title">Achievements</h2>
        
        <div className="achievements-grid">
          {achievements.map((item, idx) => (
            <div key={idx} className="achievement-card glass glass-hover">
              <div className="achievement-icon-box">
                {item.icon}
              </div>
              <div className="achievement-content">
                <span className="achievement-value">{item.value}</span>
                <h3 className="achievement-title">{item.title}</h3>
                <p className="achievement-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
