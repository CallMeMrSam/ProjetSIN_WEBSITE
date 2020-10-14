const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated) => {

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

        if(await User.findOne({ username: username })) {
            req.flash('error', 'Le nom d\'utilisateur est déjà utilisé.');
            return res.redirect('/signin');
        }

        try {
            let hashedPassword = await bcrypt.hash(password, 10);
            new User({
                _id: mongoose.Types.ObjectId(),
                username: username,
                password: hashedPassword,
                createdAt: Date.now(),
            }).save()
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