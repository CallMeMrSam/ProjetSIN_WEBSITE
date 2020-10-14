var express = require('express');
var router = express.Router();

module.exports = (renderTemplate, checkAuthenticated, checkNotAuthenticated, ARTICLES, USERS) => {

    router.get('/', (req, res, next) => {
        renderTemplate(req, res, 'index', {articles: ARTICLES});
    })
    
    return {
        name: '/',
        router: router
    }
}