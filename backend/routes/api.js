const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/adminController');
const contactController = require('../controllers/contactController');
const projectController = require('../controllers/projectController');
const certController = require('../controllers/certController');
const resumeController = require('../controllers/resumeController');

// Middlewares
const protect = require('../middleware/auth');
const {
  validateContact,
  validateProject,
  validateCertification,
} = require('../middleware/validate');

// Admin Auth Routes
router.post('/admin/login', adminController.login);
router.get('/admin/verify', protect, adminController.verifyToken);

// Contact Routes
router.post('/contacts', validateContact, contactController.createContact);
router.get('/contacts', protect, contactController.getContacts);
router.put('/contacts/:id', protect, contactController.toggleReadContact);
router.delete('/contacts/:id', protect, contactController.deleteContact);

// Project Routes
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProject);
router.post('/projects', protect, validateProject, projectController.createProject);
router.put('/projects/:id', protect, validateProject, projectController.updateProject);
router.delete('/projects/:id', protect, projectController.deleteProject);

// Certification Routes
router.get('/certifications', certController.getCertifications);
router.post('/certifications', protect, validateCertification, certController.createCertification);
router.put('/certifications/:id', protect, validateCertification, certController.updateCertification);
router.delete('/certifications/:id', protect, certController.deleteCertification);

// Resume Routes
router.get('/resume/status', resumeController.getResumeStatus);
router.get('/resume/download', resumeController.downloadResume);
router.get('/resume/stats', protect, resumeController.getResumeStats);
router.post('/resume', protect, resumeController.uploadResume);
router.delete('/resume', protect, resumeController.deleteResume);

module.exports = router;
