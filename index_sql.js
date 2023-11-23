const express = require('express')
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const Models = require('./models_sql');

const app = express();

const users = Models.User;

app.use(bodyParser.json());

// Get all Users
app.get('/users', async (req, res) => {
    await users.findAll()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});



app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});