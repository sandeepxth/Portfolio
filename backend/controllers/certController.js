const Certification = require('../models/Certification');

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
exports.getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: certifications.length, data: certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving certifications' });
  }
};

// @desc    Create certification
// @route   POST /api/certifications
// @access  Private (Admin only)
exports.createCertification = async (req, res) => {
  try {
    const { title, issuer, date, credentialUrl, image, order } = req.body;

    const cert = await Certification.create({
      title,
      issuer,
      date,
      credentialUrl,
      image,
      order: order || 0,
    });

    res.status(201).json({ success: true, data: cert, message: 'Certification added successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating certification' });
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private (Admin only)
exports.updateCertification = async (req, res) => {
  try {
    let cert = await Certification.findById(req.params.id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    const { title, issuer, date, credentialUrl, image, order } = req.body;

    cert = await Certification.findByIdAndUpdate(
      req.params.id,
      {
        title,
        issuer,
        date,
        credentialUrl,
        image,
        order: order !== undefined ? order : cert.order,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: cert, message: 'Certification updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating certification' });
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private (Admin only)
exports.deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    await cert.deleteOne();

    res.status(200).json({ success: true, message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting certification' });
  }
};
