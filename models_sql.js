const { Sequelize, DataTypes } = require("sequelize");

const userModel = function (sequelize, DataTypes) {

    return sequelize.define('user', {

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
    })
};

module.exports.User = userModel;
