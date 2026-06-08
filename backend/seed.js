const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const Certification = require('./models/Certification');

dotenv.config();

const sampleProjects = [
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
    order: 1
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
    order: 2
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
    order: 3
  }
];

const sampleCertifications = [
  {
    title: 'Full Stack Developer Certificate',
    issuer: 'Simplilearn',
    date: '2025',
    credentialUrl: 'https://simpli-web.app.link/e/NUcgn8CCN3b',
    image: '',
    order: 1
  },
  {
    title: 'Generative AI',
    issuer: 'Simplilearn',
    date: '2025',
    credentialUrl: 'https://simpli-web.app.link/e/b5aKbKSCN3b',
    image: '',
    order: 2
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Project.deleteMany({});
    await Certification.deleteMany({});
    console.log('Cleared existing projects and certifications.');

    // Insert new data
    await Project.insertMany(sampleProjects);
    console.log('Sample projects seeded successfully.');

    await Certification.insertMany(sampleCertifications);
    console.log('Sample certifications seeded successfully.');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
