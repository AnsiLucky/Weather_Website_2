const express = require('express');
require('express-flash');
const router = express.Router();
const User = require('../models/user');
const Quiz = require('../models/quiz');
const CityCard = require('../models/cityCard');
const {checkAuthentificated, checkNotAuthentificated, checkIsAdmin} = require('../utils/checks');
const { getAllInfo, getFiftyDaytVisualCrossing } = require('../utils/response');
const Response = require('../models/response');
const  generatePDF = require('../utils/pdfCreator');
const language = require('../config/language');

// Home route
router.get('/', checkAuthentificated, async (req, res) => {
  let city = req.query.city || 'Almaty';
  const lang = req.session.language || 'en';
  const info = (await getAllInfo(city, req.session.language));
  if (city.toLowerCase() === "astana") city = "nur-sultan"
  if (info.error !== undefined) {
    return   res.render('index', {lang : language[lang], error : ['Input Correct City'] })
  }
  if (req.query.city !== undefined) {
    const newResponse = new Response({userId: req.session.userId,
      info: info});
   await newResponse.save();
  }

  res.render('index', {lang : language[lang], data : info , error : req.flash('error'),  cityCards : await CityCard.find()})
});

// routes/quiz.js
router.get('/quiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    const lang = req.session.language || 'en';

    res.render('quiz', { quizzes: quizzes, lang:  language[lang] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/quiz/submit', async (req, res) => {
  try {
    const answers = req.body; // Assuming form data contains answers in the format { answer0: '0', answer1: '1', ... }
    const quizIds = Object.keys(answers);
    
    let score = 0;
    for (const quizId of quizIds) {
      const quiz = await Quiz.findById(quizId.split("|")[0]);
      if (!quiz) {
        console.error(`Quiz with ID ${quizId.split("|")[1]} not found`);
        continue;
      }
      const selectedOptionIndex = parseInt(answers[quizId]);
      if (selectedOptionIndex === quiz.correctAnswer) {
        score++;
      }
    }
    const totalQuestions = quizIds.length;
    const lang = req.session.language || 'en';
    res.render('quiz-results', { score, totalQuestions, lang: language[lang] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}); 

router.get('/test', async (req, res) => {
  try {
    // Sample quiz questions in both English and Russian
    const sampleQuestions = [
      {
        question: {
          en: "What is the primary cause of wind?",
          ru: "Что является основной причиной ветра?"
        },
        options: {
          en: ["Rotation of the Earth", "Differential heating of the Earth's surface", "Movement of ocean currents", "Changes in atmospheric pressure"],
          ru: ["Вращение Земли", "Дифференциальное нагревание поверхности Земли", "Движение океанских течений", "Изменения атмосферного давления"]
        },
        correctAnswer: 1,
        category: "Weather",
        difficultyLevel: "Medium"
      },
      {
        question: {
          en: "Which of the following is NOT a type of precipitation?",
          ru: "Какой из перечисленных не является типом осадков?"
        },
        options: {
          en: ["Rain", "Snow", "Hail", "Sleet"],
          ru: ["Дождь", "Снег", "Град", "Слякоть"]
        },
        correctAnswer: 0,
        category: "Weather",
        difficultyLevel: "Easy"
      },
      {
        question: {
          en: "What is the name for a rotating column of air in contact with both the surface of the Earth and a cumulonimbus cloud?",
          ru: "Как называется вращающаяся колонна воздуха, контактирующая с поверхностью Земли и кучевым дождевым облаком?"
        },
        options: {
          en: ["Tornado", "Hurricane", "Typhoon", "Cyclone"],
          ru: ["Торнадо", "Ураган", "Тайфун", "Циклон"]
        },
        correctAnswer: 0,
        category: "Weather",
        difficultyLevel: "Hard"
      },
      {
        question: {
          en: "What causes the phenomenon known as the Northern Lights?",
          ru: "Что вызывает явление, известное как северное сияние?"
        },
        options: {
          en: ["Reflection of sunlight by the moon's surface", "Ionization of gases in the Earth's atmosphere", "Bioluminescence of marine organisms", "Emission of light from the Earth's core"],
          ru: ["Отражение солнечного света от поверхности Луны", "Ионизация газов в атмосфере Земли", "Биолюминесценция морских организмов", "Излучение света из недр Земли"]
        },
        correctAnswer: 1,
        category: "Astronomy",
        difficultyLevel: "Medium"
      },
      {
        question: {
          en: "Which planet is known as the 'Red Planet'?",
          ru: "Какая планета известна как 'Красная планета'?"
        },
        options: {
          en: ["Venus", "Mars", "Jupiter", "Saturn"],
          ru: ["Венера", "Марс", "Юпитер", "Сатурн"]
        },
        correctAnswer: 1,
        category: "Astronomy",
        difficultyLevel: "Easy"
      }
    ];

    // Insert the sample questions into the database
    await Quiz.insertMany(sampleQuestions);
    console.log('Sample questions inserted successfully');
  } catch (err) {
    console.error('Error inserting sample questions:', err);
  }

})

router.get('/login', checkNotAuthentificated, (req, res) => {
  const lang = req.session.language || 'en';
  res.render('login', {lang : language[lang], message : { success : req.flash('success'), error : req.flash('error')}});
})

router.get('/history', checkAuthentificated, async (req, res) => {
  try {
    const lang = req.session.language || 'en';
    const data = await Response.find({ userId: req.session.userId }).sort({ timestamp: -1 });
    res.render('history', { lang : language[lang], data: data });
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
    cityCards : await CityCard.find(),
    message : {success: req.flash('success'), 
    error : req.flash('error' )}, 
    lang : language[lang]});
})

router.get('/charts', async (req, res) => {
  const lang = req.session.language || 'en';
  const city = req.query.city || 'Almaty';
  res.render('charts', { data: await getFiftyDaytVisualCrossing(city, lang),
    lang : language[lang],
    username: req.session.username,});
})

router.get('/editUser', checkIsAdmin, async (req, res) => {
  const _id = req.query._id;
  const lang = req.session.language || 'en';
  const user = await User.findOne({ _id });
  res.render('editUser', {lang : language[lang], user : user});
})

router.get('/editCityCard/:id', checkIsAdmin, async (req, res) => {
  const _id = req.params.id;
  const lang = req.session.language || 'en';
  const card = await CityCard.findOne({ _id });
  res.render('editCard', {lang : language[lang], card: card});
})

router.get('/addUser', checkIsAdmin, async (req, res) => {
  const lang = req.session.language || 'en';
  res.render('addUser', {lang : language[lang]});
})

router.get('/addCityCard', checkIsAdmin, async (req, res) => {
  const lang = req.session.language || 'en';
  res.render('addCard', {lang : language[lang]});
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
