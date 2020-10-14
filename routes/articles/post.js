const express = require('express');
const router = express.Router();

const Article = require('../../models/Article');
const mongoose = require('mongoose');


module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated) => {

    router.get('/', checkAuthenticated, (req, res) => {
        renderTemplate(req, res, 'post');
    });
    
    router.post('/', checkAuthenticated, async (req, res) => {
        let title = req.body.title;
        let description = req.body.description || 'Aucune description';
        let content = req.body.content;
        
        await new Article({
            _id: mongoose.Types.ObjectId(),
            title,
            description,
            content,
            author: req.user.username
        }).save()

        res.redirect('/');
    })
    
    return {
        name: '/post',
        router: router
    }
}