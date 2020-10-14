const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated) => {

    router.get('/', async (req, res, next) => {
        let articles = await Article.find({});
        renderTemplate(req, res, 'index', {articles});
    })
    
    return {
        name: '/',
        router: router
    }
}