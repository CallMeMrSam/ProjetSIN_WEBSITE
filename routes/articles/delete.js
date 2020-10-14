const express = require('express');
const router = express.Router();

const Article = require('../../models/Article');

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated) => {

    router.get('/', (req, res) => {
        res.redirect('/')
    })

    router.delete('/:id', checkAuthenticated, async (req, res) => {
        let id = req.params.id;
        if(!id || !await Article.findById(id)) {
            return res.redirect('/');
        }
        let article = await Article.findById(id);
        if(req.user.username !== article.author) {
            if(req.user.permission < 50) {
                return res.redirect('/');
            }
        }
        await Article.findByIdAndDelete(id);
        res.redirect('/')
    });
    
    return {
        name: '/delete',
        router: router
    }
}