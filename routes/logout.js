const express = require('express');
const router = express.Router();

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated) => {

    router.delete('/', checkAuthenticated, (req, res) => {
        req.logOut()
        req.flash('success', 'Vous avez été déconnecté.')
        res.redirect('/login')
    })
    
    return {
        name: '/logout',
        router: router
    }
}