const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../config/auth');

//welcome page
router.get('/', (req,res) => {
    res.render('index', {title: "QuizTrivia"})
});

router.get('/start', (req,res) => {
    res.render('welcomeQuiz', {title: "Landing"})
});


router.get('/game', ensureAuthenticated, (req,res) => {
    const firstLetter = req.user.name[0].toUpperCase();
    res.render('game', {
        title: 'quizgame',
        letter: firstLetter 
    });
});

router.get('/mark35', (req,res) => {
    res.render('mark35', {title: "Welcome"})
});

router.get('/mark50', (req,res) => {
    res.render('mark50', {title: "Welcome"})
});

router.get('/mark60', (req,res) => {
    res.render('mark60', {title: "Welcome"})
});

router.get('/mark75', (req,res) => {
    res.render('mark75', {title: "Welcome"})
});

module.exports = router;