const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { Institution, Payment, Credit } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

const CREDIT_PRICE = 200; // N200 per credit

// Get institution's credit balance
router.get('/credits', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Calculate total credits
    const credits = await Credit.findAll({
      where: { institutionId: institution.id },
      order: [['createdAt', 'DESC']],
    });

    let totalCredits = 0;
    credits.forEach(credit => {
      if (credit.transactionType === 'purchase') {
        totalCredits += credit.transactionAmount;
      } else if (credit.transactionType === 'usage') {
        totalCredits -= credit.transactionAmount;
      }
    });

    res.json({
      totalCredits,
      transactions: credits.slice(0, 10), // Last 10 transactions
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Purchase credits
router.post('/purchase-credits', authenticateToken, requireRole('institution'), [
  body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { credits } = req.body;
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const amount = credits * CREDIT_PRICE;
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment = await Payment.create({
      institutionId: institution.id,
      amount,
      credits,
      paymentReference,
      status: 'pending',
    });

    // In a real implementation, you would integrate with Paystack here
    // For now, we'll simulate a successful payment
    
    res.json({
      paymentReference,
      amount,
      credits,
      // In real implementation, return Paystack authorization URL
      authorizationUrl: `/institution/payment-callback?reference=${paymentReference}`,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment callback (simulate Paystack webhook)
router.post('/verify-payment', authenticateToken, requireRole('institution'), [
  body('reference').notEmpty().withMessage('Payment reference is required'),
], async (req, res) => {
  try {
    const { reference } = req.body;
    
    const payment = await Payment.findOne({
      where: { paymentReference: reference },
      include: [Institution],
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'completed') {
      return res.json({ message: 'Payment already processed' });
    }

    // Simulate payment verification (in real app, verify with Paystack)
    const paymentSuccessful = true; // This would come from Paystack verification

    if (paymentSuccessful) {
      // Update payment status
      payment.status = 'completed';
      await payment.save();

      // Add credits to institution
      await Credit.create({
        institutionId: payment.institutionId,
        amount: payment.credits,
        transactionType: 'purchase',
        transactionAmount: payment.credits,
        description: `Purchased ${payment.credits} credits`,
        reference: payment.paymentReference,
      });

      res.json({
        success: true,
        message: `Successfully purchased ${payment.credits} credits`,
        credits: payment.credits,
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get payment history
router.get('/history', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const payments = await Payment.findAll({
      where: { institutionId: institution.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;