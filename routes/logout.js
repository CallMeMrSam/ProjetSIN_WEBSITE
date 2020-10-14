var express = require('express');
var router = express.Router();

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS) => {

    router.delete('/', (req, res) => {
        req.logOut()
        req.flash('success', 'Vous avez été déconnecté.')
        res.redirect('/login')
    })
    
    return {
        name: '/logout',
        router: router
    }
}