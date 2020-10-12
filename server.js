const express = require('express');
const path = require('path');
const app = express();

const ARTICLES = [
    {
        title: 'Vive le node.js',
        author: 'johnsmith',
        contentShort: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
        date: Date.now()
    },
    {
        title: 'Titre2',
        author: 'johnsmith2',
        contentShort: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
        date: Date.now()
    }
]

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs', { articles: ARTICLES });
});

app.get('/post', (req, res) => {
    res.render('post.ejs');
});

app.listen('4000', () => {
    console.log(`lancé sur: http://localhost:4000/`);
})