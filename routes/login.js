const express = require('express');
const router = express.Router();

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated, passport) => {

    router.get('/', checkNotAuthenticated, (req, res) => {
        renderTemplate(req, res, 'login');
    })

    router.post('/', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))
    
    return {
        name: '/login',
        router: router
    }
}