const mongoose = require("mongoose");

function mongooseConnectDB(uri) {
    mongoose
        .connect(uri, {
        })
        .then((result) =>
            console.log("Mongoose connected to ", result.connections[0].host)
        )
        .catch((err) => console.log("Error connecting to the database", err));
}

module.exports = mongooseConnectDB;