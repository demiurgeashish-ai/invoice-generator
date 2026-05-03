const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');
const generateToken = require('../middlewares/tokenMiddleware');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.displayName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({
        _id: user._id,
        name: user.displayName,
        email: user.email,
        token: generateToken(user._id)
      });
    });
  })(req, res, next);
});

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

// Google Auth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to frontend with token
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
  }
);

// Get current user
router.get('/me', protect, (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.displayName,
      email: req.user.email
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout User
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
