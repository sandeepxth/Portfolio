const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Sign token
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret_key_123',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      message: 'Admin authentication successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.verifyToken = async (req, res) => {
  // If the auth middleware passed, this endpoint returns true
  res.status(200).json({ success: true, message: 'Token is valid' });
};
