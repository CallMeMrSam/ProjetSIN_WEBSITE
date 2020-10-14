require('dotenv').config();

const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const app = express();
const slugify = require('slugify');
const methodOverride = require('method-override');
const fs = require('fs');
const createError = require('http-errors')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => USERS.find(user => user.username === username),
  id => USERS.find(user => user.id === id)
);

const ARTICLES = [];
const USERS = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');


const routesDirectory = './routes/';
fs.readdirSync(routesDirectory).forEach((file) => {
    let propsName = file.split(".")[0];
  
    if(file.split(".").pop() === propsName) {

        fs.readdirSync(path.resolve(`${routesDirectory}${path.sep}${propsName}`)).forEach((file2) => {
            if(file2.split(".").pop() === 'js') {
                var props = require(path.resolve(`${routesDirectory}${path.sep}${propsName}${path.sep}${file2}`))(renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS, passport);
                app.use(props.name, props.router);
            }
        })

    } else {
        if(file.split(".").pop() === 'js') {
            var props = require(path.resolve(`${routesDirectory}${path.sep}${file}`))(renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS, passport);
            app.use(props.name, props.router);
        }
    }
})

app.use(function(req, res, next) {
    next(createError(404));
});

app.use((err, req, res, next) => {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    res.status(err.status || 500);

    renderTemplate(req, res, 'error');
});

function renderTemplate(req, res, template, data = {}) {
    Object.assign(data, {
        user: req.isAuthenticated() ? req.user : null
    })
    res.render(template, data);
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    
    req.flash('error', 'Vous devez être connecté, veuillez vous connecter.')
    res.redirect('/login')
  }
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen('4000', () => {
    console.log(`lancé sur: http://localhost:4000/`);
});