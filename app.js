const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const apps = require('./playstore.js'); 

app.get('/apps', (req, res) => {
    const { sort, genre = "" } = req.query;
    console.log(genre)

    if(sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of Rating or App');
        }
    }

    if(genre) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
            return res
                .status(400)
                .send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, Card')
        };
    }
    
   let results = apps
        .filter(app => 
            app.Genres.toLowerCase().includes(genre.toLowerCase()));
    
    if(sort === 'Rating') {
        results.sort((a, b) => {
            return a[sort] < b[sort]  ? 1 : a[sort] > b[sort] ? -1 : 0;
        });
    }

    if(sort === 'App') {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }

    res
        .json(results);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
})