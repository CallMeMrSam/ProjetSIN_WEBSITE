const express = require('express');
const app = express();

app.use(express.static('/views'))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen('4000', () => {
    console.log(`lancé sur: http://localhost:4000/`);
})