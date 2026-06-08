const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact message
// @route   POST /api/contacts
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Escape helper to prevent HTML Injection
    const escapeHtml = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || 'No Subject');
    const safeMessage = escapeHtml(message);

    // Send email notification asynchronously in the background
    const emailSubject = `New Portfolio Message: ${safeSubject}`;
    const emailText = `You have received a new contact form message.

Name: ${name}
Email: ${email}
Subject: ${subject || 'No Subject'}

Message:
${message}`;

    const emailHtml = `
      <h2>New Portfolio Message Received</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f3f4f6; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">${safeMessage}</p>
    `;

    sendEmail({
      replyTo: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    }).catch((err) => {
      console.error('Error sending background notification email:', err);
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while sending message' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private (Admin only)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving messages' });
  }
};

// @desc    Mark contact message as read/unread
// @route   PUT /api/contacts/:id
// @access  Private (Admin only)
exports.toggleReadContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    contact.isRead = !contact.isRead;
    await contact.save();

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating message state' });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await contact.deleteOne();

    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting message' });
  }
};
