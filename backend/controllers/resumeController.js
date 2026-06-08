const fs = require('fs');
const path = require('path');
const Stats = require('../models/Stats');
const Resume = require('../models/Resume');
const connectDB = require('../config/db');

const DEFAULT_RESUME_PATH = path.join(__dirname, '..', 'uploads', 'default_resume.pdf');

// @desc    Get resume status (checks if custom resume exists in database)
// @route   GET /api/resume/status
// @access  Public
exports.getResumeStatus = async (req, res) => {
  try {
    await connectDB();
    const resume = await Resume.findOne({ filename: 'resume.pdf' });
    const exists = !!resume;
    res.status(200).json({
      success: true,
      exists,
      filename: exists ? 'resume.pdf' : null
    });
  } catch (error) {
    console.error('Error checking resume status:', error);
    // FALLBACK: If DB connection failed, report that custom resume does not exist (so it uses default)
    res.status(200).json({
      success: true,
      exists: false,
      filename: null,
      isOffline: true
    });
  }
};

// @desc    Download resume file
// @route   GET /api/resume/download
// @access  Public
exports.downloadResume = async (req, res) => {
  try {
    try {
      await connectDB();
    } catch (dbErr) {
      console.warn('Database offline/connection failed, using fallback resume file:', dbErr.message);
      // Immediately serve fallback resume without trying database queries
      if (fs.existsSync(DEFAULT_RESUME_PATH)) {
        return res.download(DEFAULT_RESUME_PATH, 'Sandeep_Prajapati_Resume.pdf');
      }
      return res.status(404).json({ success: false, message: 'Fallback resume file not found' });
    }

    const customResume = await Resume.findOne({ filename: 'resume.pdf' });
    
    // Increment resume download count in MongoDB
    try {
      await Stats.findOneAndUpdate(
        { key: 'resume_downloads' },
        { $inc: { value: 1 }, updatedAt: Date.now() },
        { upsert: true, new: true }
      );
      console.log('Resume download count incremented successfully.');
    } catch (err) {
      console.error('Failed to update resume download stats:', err);
    }

    if (customResume && customResume.fileData) {
      const buffer = Buffer.from(customResume.fileData, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Sandeep_Prajapati_Resume.pdf"');
      return res.send(buffer);
    } else if (fs.existsSync(DEFAULT_RESUME_PATH)) {
      return res.download(DEFAULT_RESUME_PATH, 'Sandeep_Prajapati_Resume.pdf');
    } else {
      res.status(404).json({ success: false, message: 'Resume file not found' });
    }
  } catch (error) {
    console.error('Error downloading resume:', error);
    // Final fallback in case of query errors (e.g. database disconnect during execution)
    if (fs.existsSync(DEFAULT_RESUME_PATH)) {
      console.log('Final fallback: serving default resume after query execution error.');
      return res.download(DEFAULT_RESUME_PATH, 'Sandeep_Prajapati_Resume.pdf');
    }
    res.status(500).json({ success: false, message: 'Error downloading resume' });
  }
};

// @desc    Upload resume file (Base64 to MongoDB)
// @route   POST /api/resume
// @access  Private (Admin only)
exports.uploadResume = async (req, res) => {
  try {
    await connectDB();
    const { fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    // Extract base64 content
    let base64Data = fileData;
    if (fileData.includes(';base64,')) {
      base64Data = fileData.split(';base64,')[1];
    }

    // Store custom resume in MongoDB
    await Resume.findOneAndUpdate(
      { filename: 'resume.pdf' },
      { fileData: base64Data, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully to database!',
      exists: true
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
};

// @desc    Delete custom resume file (from MongoDB)
// @route   DELETE /api/resume
// @access  Private (Admin only)
exports.deleteResume = async (req, res) => {
  try {
    await connectDB();
    const result = await Resume.deleteOne({ filename: 'resume.pdf' });
    
    if (result.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: 'Custom resume deleted. Reverted to default.',
        exists: false
      });
    } else {
      res.status(404).json({ success: false, message: 'Custom resume file not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting resume file' });
  }
};

// @desc    Get resume download statistics
// @route   GET /api/resume/stats
// @access  Private (Admin only)
exports.getResumeStats = async (req, res) => {
  try {
    await connectDB();
    const stat = await Stats.findOne({ key: 'resume_downloads' });
    res.status(200).json({
      success: true,
      downloads: stat ? stat.value : 0,
      updatedAt: stat ? stat.updatedAt : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving resume download statistics' });
  }
};

