var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS, passport) => {

    router.get('/', checkNotAuthenticated, (req, res) => {
        renderTemplate(req, res, 'signin');
    });

    router.post('/', checkNotAuthenticated, async (req, res) => {
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
    
    return {
        name: '/signin',
        router: router
    }
}