const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  if (!name || name.trim() === '') errors.push('Name is required');
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }
  if (!subject || subject.trim() === '') errors.push('Subject is required');
  if (!message || message.trim() === '') errors.push('Message is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

const validateProject = (req, res, next) => {
  const { title, description, techStack } = req.body;
  const errors = [];

  if (!title || title.trim() === '') errors.push('Project title is required');
  if (!description || description.trim() === '') errors.push('Project description is required');
  if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
    errors.push('At least one technology is required in techStack array');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

const validateCertification = (req, res, next) => {
  const { title, issuer, date } = req.body;
  const errors = [];

  if (!title || title.trim() === '') errors.push('Certification title is required');
  if (!issuer || issuer.trim() === '') errors.push('Issuer is required');
  if (!date || date.trim() === '') errors.push('Date is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
};

module.exports = {
  validateContact,
  validateProject,
  validateCertification,
};
