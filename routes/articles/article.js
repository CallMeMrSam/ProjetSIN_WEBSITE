var express = require('express');
var router = express.Router();

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS) => {

    router.get('/', (req, res) => {
        res.redirect('/')
    })

    router.get('/:id', (req, res) => {
        let id = req.params.id;
        if(!id || !ARTICLES.find(a => a.id === id)) {
            return res.redirect('/');
        }
        let article = ARTICLES.find(a => a.id === id);
        renderTemplate(req, res, 'article', {article});
    });
    
    return {
        name: '/articles',
        router: router
    }
}