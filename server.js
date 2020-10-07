const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    
});

app.listen('4000', () => {
    console.log(`lancé sur: http://localhost:4000/`);
})