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

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => USERS.find(user => user.username === username),
  id => USERS.find(user => user.id === id)
)


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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        console.log('connecté', req.user)
    }
    renderTemplate(req, res, 'index', {articles: ARTICLES});
});

app.get('/post', checkAuthenticated, (req, res) => {
    renderTemplate(req, res, 'post');
});

app.post('/post', checkAuthenticated, (req, res) => {
    let title = req.body.title;
    let description = req.body.description || 'Aucune description';
    let content = req.body.content;

    ARTICLES.push({
        title,
        author: {
            id: req.user.id,
            username: req.user.username
        },
        description,
        content,
        date: Date.now(),
        id: slugify(title, {
            strict: true,
            lower: true,
            replacement: '-'
        })
    })
    res.redirect('/');
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    renderTemplate(req, res, 'login');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get('/signin', checkNotAuthenticated, (req, res) => {
    renderTemplate(req, res, 'signin');
});

app.post('/signin', checkNotAuthenticated, async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let password2= req.body.password2;

    if(password !== password2) {
        req.flash('error', 'Les mots de passes ne correspondent pas.');
        return res.redirect('/signin');
    }

    try {
        let hashedPassword = await bcrypt.hash(password, 10);
        USERS.push({
            id: Date.now().toString(),
            username: username,
            password: hashedPassword
        })
        req.flash('success', 'Vous avez été inscris, veuillez vous connecter.')
        res.redirect('/login');
    } catch(e) {
        console.log(e);
        req.flash('error', 'Erreur indéfinie');
        res.redirect('/signin');
    }
});

app.get('/articles/:id', (req, res) => {
    let id = req.params.id;
    if(!id || !ARTICLES.find(a => a.id === id)) {
        return res.redirect('/');
    }
    let article = ARTICLES.find(a => a.id === id);
    renderTemplate(req, res, 'article', {article});
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