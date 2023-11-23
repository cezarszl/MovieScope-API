const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const Models = require('./models_sql');

const app = express();



const sequelize = new Sequelize({
    database: "mydb",
    username: "postgres",
    password: "elo350",
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
    define: {
        timestamps: false
    }

});

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

testDbConnection();

const users = Models.User(sequelize, DataTypes);

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