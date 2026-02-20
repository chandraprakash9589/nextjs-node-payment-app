const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Course = require('../models/Course');
const User = require('../models/User');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Creates a Razorpay order and saves it to DB
router.post('/create-order', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already purchased
    const user = await User.findById(req.user.id);
    if (user.purchasedCourses.map(String).includes(String(courseId))) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    const options = {
      amount: course.price * 100, // Razorpay expects paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId.toString(),
        userId: req.user.id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order record in DB with status "created"
    await Order.create({
      user: req.user.id,
      course: courseId,
      razorpayOrderId: razorpayOrder.id,
      amount: course.price,
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      courseName: course.title,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/verify
// Verifies Razorpay signature and grants course access
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    // Verify signature using HMAC SHA256
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order status to paid
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      },
      { new: true }
    );

    // Grant course access to user
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { purchasedCourses: courseId },
    });

    // Increment student count on course
    await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

    res.json({
      message: 'Payment verified successfully',
      orderId: order._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payment/orders — user's purchase history
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('course', 'title thumbnail price instructor')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
