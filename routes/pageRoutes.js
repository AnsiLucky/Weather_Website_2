const express = require('express');
require('express-flash');
const router = express.Router();
const User = require('../models/user');
const {checkAuthentificated, checkNotAuthentificated, checkIsAdmin} = require('../utils/checks');
const { getAllInfo, getExtendedForecast } = require('../utils/response');
const Response = require('../models/response');
const  generatePDF = require('../utils/pdfCreator');
const language = require('../config/language');

// Home route
router.get('/', checkAuthentificated, async (req, res) => {
  let city = req.query.city || 'Almaty';
  const info = (await getAllInfo(city, req.session.language));
  if (city.toLowerCase() === "astana") city = "nur-sultan"
  if (req.query.city !== undefined) {
    const newResponse = new Response({userId: req.session.userId,
      info: info});
   await newResponse.save();
  }
  const lang = req.session.language || 'en';

  res.render('index', {lang : language[lang], data : info , error : req.flash('error') })
});

router.get('/test', async (req, res) => {
  res.json(language['en']);
})

router.get('/login', checkNotAuthentificated, (req, res) => {
  const lang = req.session.language || 'en';
  res.render('login', {lang : language[lang], message : { success : req.flash('success'), error : req.flash('error')}});
})

router.get('/history', checkAuthentificated, async (req, res) => {
  try {
    const lang = req.session.language || 'en';
    res.render('history', { lang : language[lang], data: (await Response.find({ userId: req.session.userId }).sort({ timestamp: -1 })) });
} catch (error) {
    console.error('Error:', error);
    req.flash('Internal Server Error');
    res.redirect('/');
}
})

router.get('/profile', checkAuthentificated, async (req, res) => {
  const lang = req.session.language || 'en';
  res.render('profile', {lang : language[lang], username: req.session.username, email: req.session.email});
})

router.get('/admin', checkIsAdmin, async (req, res) => {
  const lang = req.session.language || 'en';
  res.render('admin', { users : await User.find(), 
    message : {success: req.flash('success'), 
    error : req.flash('error' )}, 
    lang : language[lang]});
})

router.get('/charts', checkIsAdmin, async (req, res) => {
  const lang = req.session.language || 'en';
  const city = req.query.city || 'Almaty';
  res.render('charts', { data: await getExtendedForecast(city, lang),
    lang : language[lang],
    username: req.session.username,});
})

router.get('/editUser', checkIsAdmin, async (req, res) => {
  const _id = req.query._id;
  const lang = req.session.language || 'en';
  const user = await User.findOne({ _id });
  res.render('editUser', {lang : language[lang], user : user});
})

router.get('/download-history-record/:recordId', async (req, res) => {
  const { recordId } = req.params; 
  const userId = req.session.userId; 

  if (!userId) {
      return res.status(403).send('User not logged in or session not established.');
  }

  try {
    await generatePDF(res, await Response.findOne({ _id: recordId, userId: userId }));
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Handle the error
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;