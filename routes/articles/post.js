var express = require('express');
var router = express.Router();
const slugify = require('slugify')

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS) => {

    router.get('/', checkAuthenticated, (req, res) => {
        renderTemplate(req, res, 'post');
    });
    
    router.post('/', checkAuthenticated, (req, res) => {
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
    
    return {
        name: '/post',
        router: router
    }
}