const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

let myTopMovies = [
    {
      title: 'The Departed',
      director: 'Martin Scorsese'
    },
    {
        title:'One Flew Over the Cuckoo\'s Nest',
        director: 'Milos Forman'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis'
    },
    {
        title: 'As Good as It Gets',
        director: 'James L. Brooks'
    },
    {
          title:'Saving Private Ryan',
          director: 'Steven Spielberg'
    },
    {
          title: 'Schindler\'s List',
          director: 'Steven Spielberg'
    },
    {
        title:'Goodfellas',
        director: 'Martin Scorsese'
    },
    {
        title: 'The Wolf of Wall Street',
        director: 'Martin Scorsese'
    },
    {
        title:'Good Will Hunting',
        director: 'Gus Van Sant'
    },
    {
        title: 'Inglourious Basterds',
        director: 'Quentin Tarantino'
    }
  ];

  app.get('/movies', (req, res) => {
    res.json(myTopMovies);
  });

  app.get('/', (req, res) => {
    res.send('Be guest of my movie club :)');
  });

  app.use(express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
  });

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });