const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

// Add User Route
router.post('/addUser', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    const newUser = new User({ username, password, isAdmin });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
});

// Edit User Route
router.post('/editUser/:userId', async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  try {
      const updates = {
          username,
          email,
          isAdmin: isAdmin === 'on',
          updatedAt: new Date(),
      };
      if (password) {
          updates.password = await bcrypt.hash(password, 10);
      }

      await User.findByIdAndUpdate(req.params.userId, updates);

      req.flash('success', 'User updated successfully');
      res.redirect('/admin');
    } catch (err) {
    req.flash('error', 'Error updating user');
    res.redirect('/admin');
  }
});

// Delete User Route
router.get('/deleteUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    req.flash('success', 'User deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    req.flash('error', 'Error deleting user');
    res.redirect('/admin');
  }
});

module.exports = router;
