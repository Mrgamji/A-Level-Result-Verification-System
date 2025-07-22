const express = require('express');
const { body, validationResult } = require('express-validator');
const { Announcement, Institution, User, Feedback } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get announcements for institution dashboard
router.get('/dashboard', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const announcements = await Announcement.findAll({
      where: {
        isActive: true,
        [require('sequelize').Op.or]: [
          { type: 'general' },
          { 
            type: 'institution-specific',
            targetInstitutionId: institution.id 
          }
        ],
        [require('sequelize').Op.or]: [
          { expiresAt: null },
          { expiresAt: { [require('sequelize').Op.gt]: new Date() } }
        ]
      },
      include: [
        {
          model: User,
          attributes: ['email']
        }
      ],
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 10
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all announcements (Admin)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [
        {
          model: User,
          attributes: ['email']
        },
        {
          model: Institution,
          attributes: ['name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create announcement (Admin)
router.post('/', authenticateToken, requireRole('admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('type').isIn(['general', 'institution-specific']).withMessage('Invalid type'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, type, priority, targetInstitutionId, expiresAt } = req.body;

    // Validate target institution if type is institution-specific
    if (type === 'institution-specific' && !targetInstitutionId) {
      return res.status(400).json({ error: 'Target institution is required for institution-specific announcements' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      type,
      priority,
      targetInstitutionId: type === 'institution-specific' ? targetInstitutionId : null,
      expiresAt: expiresAt || null,
      createdBy: req.user.id,
      isActive: true
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update announcement (Admin)
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, priority, targetInstitutionId, expiresAt, isActive } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await announcement.update({
      title: title || announcement.title,
      content: content || announcement.content,
      type: type || announcement.type,
      priority: priority || announcement.priority,
      targetInstitutionId: type === 'institution-specific' ? targetInstitutionId : null,
      expiresAt: expiresAt !== undefined ? expiresAt : announcement.expiresAt,
      isActive: isActive !== undefined ? isActive : announcement.isActive
    });

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete announcement (Admin)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await announcement.destroy();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit feedback/complaint (Institution)
router.post('/feedback', authenticateToken, requireRole('institution'), [
  body('type').isIn(['feedback', 'complaint', 'suggestion', 'inquiry']).withMessage('Invalid feedback type'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const { type, subject, message, priority, announcementId } = req.body;

    const feedback = await Feedback.create({
      institutionId: institution.id,
      announcementId: announcementId || null,
      type,
      subject,
      message,
      priority,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feedback for institution
router.get('/feedback/my', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const feedback = await Feedback.findAll({
      where: { institutionId: institution.id },
      include: [
        {
          model: Announcement,
          attributes: ['title'],
          required: false
        },
        {
          model: User,
          as: 'Responder',
          attributes: ['email'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all feedback (Admin)
router.get('/feedback', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      include: [
        {
          model: Institution,
          attributes: ['name']
        },
        {
          model: Announcement,
          attributes: ['title'],
          required: false
        },
        {
          model: User,
          as: 'Responder',
          attributes: ['email'],
          required: false
        }
      ],
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to feedback (Admin)
router.put('/feedback/:id/respond', authenticateToken, requireRole('admin'), [
  body('response').trim().notEmpty().withMessage('Response is required'),
  body('status').isIn(['pending', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { response, status } = req.body;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await feedback.update({
      adminResponse: response,
      status,
      respondedBy: req.user.id,
      respondedAt: new Date()
    });

    res.json({
      message: 'Response submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error responding to feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;