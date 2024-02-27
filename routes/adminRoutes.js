const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const CityCard = require('../models/cityCard');

/////////////////
///    User   ///
/////////////////

// Add User Route
router.post('/addUser', async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User Already Exist");
      return res.redirect('/admin');
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
    await User.findByIdAndDelete(req.params.userId);
    req.flash('success', 'User deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    req.flash('error', 'Error deleting user');
    res.redirect('/admin');
  }
});


/////////////////
/// City Card ///
/////////////////
router.post('/addCityCard', async (req, res) => {
  try {
    const r = req.body;
    const existingCard = await CityCard.findOne({ "name.ru": r.ruName });
    if (existingCard) {
      req.flash("error", "Card Already Exist");
      return res.redirect('/admin');
    }

    const newUser = new CityCard({
      name: { en: r.enName, ru: r.ruName },
      description: { en: r.enDescription , ru: r.ruDescription },
      photos: { one: r.photoOne, two: r.photoTwo, three: r.photoThree }
    });
    await newUser.save();
    req.flash('success', 'Card added successfully');
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Error adding card');
    res.redirect('/admin');
  }
});

// Edit User Route
router.post('/editCityCard/:cityId', async (req, res) => {
  const r = req.body;
  try {
      const updates = {       name: { en: r.enName, ru: r.ruName },
      description: { en: r.enDescription , ru: r.ruDescription },
      photos: { one: r.photoOne, two: r.photoTwo, three: r.photoThree }
 };
      await CityCard.findByIdAndUpdate(req.params.cityId, updates);

      req.flash('success', 'Card updated successfully');
      res.redirect('/admin');
    } catch (err) {
    req.flash('error', 'Error updating card');
    res.redirect('/admin');
  }
});

// Delete User Route
router.get('/deleteCityCard/:cityId', async (req, res) => {
  try {
    await CityCard.findByIdAndDelete(req.params.cityId);
    req.flash('success', 'Card deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    req.flash('error', 'Error deleting card');
    res.redirect('/admin');
  }
});

module.exports = router;
