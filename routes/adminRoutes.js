const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

// Add User Route
router.post('/addUser', async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User Already Exist");
      return res.redirect('/login');
    }

    const newUser = new User({ username, email, password, isAdmin });
    await newUser.save();
    req.flash('success', 'User added successfully');
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error adding user');
    res.redirect('/admin');
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
