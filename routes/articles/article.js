const express = require('express');
const router = express.Router();

const Article = require('../../models/Article');

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated) => {

    router.get('/', (req, res) => {
        res.redirect('/')
    })

    router.get('/:id', async (req, res) => {
        let id = req.params.id;
        if(!id || !await Article.findOne({ id: id })) {
            return res.redirect('/');
        }
        let article = await Article.findOne({ id: id });
        renderTemplate(req, res, 'article', {article});
    });
    
    return {
        name: '/articles',
        router: router
    }
}