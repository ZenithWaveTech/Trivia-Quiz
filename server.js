const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport');

//password confign

require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;


//connect to mongo
mongoose.connect(db)
    .then(() => {
        console.log('MongoDB Connected');
        
    })
    .catch(err => {
    console.error('Error connecting to MongoBD', err);
});


app.use(express.static(path.join(__dirname, 'public')));

//EJS
// app.use('views', './views');
app.use(expressLayouts);
app.set('view engine', 'ejs');


//Bodyparser
app.use(express.urlencoded({ extended: true}));


//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.get('views/', (req, res) =>{
    res.render(views,local)
})

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


const PORT = 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
