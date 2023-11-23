const { Sequelize, DataTypes } = require("sequelize");


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

const userModel = sequelize.define('user', {

    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    birth_date: {
        type: DataTypes.DATE
    }
});

module.exports.User = userModel;
