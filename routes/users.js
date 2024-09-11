const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/User');

router.get('/login', (req,res) => {
    res.render('login', { title: "login"})
});


router.get('/signup', (req,res) => {
    res.render('signup', { title: "signup"})
});


router.post('/signup', (req,res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'});
    }

    //check passwords match
    if(password != password2){
        errors.push({msg: 'Passwords do not match'});
    }

    //check pass length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if (errors.length > 0){
        res.render('signup', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        const newUser = new User({
            name,
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered and can log in');
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err));
            });
        });
    }


});

// login handle
router.post('/start', (req,res) => {
    res.redirect('/game');
});

router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/start',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});


// router.post('/login', (req,res,next) => {
//     passport.authenticate('local', {
//         successRedirect: '/game',
//         failureRedirect: '/users/login',
//         failureFlash: true
//     })(req,res,next);
// });

//logout handle
router.post('/logout', (req,res) => {
    req.logout(err => {
        if(err) {
            console.log('Error logging out:', err);
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});
module.exports = router;