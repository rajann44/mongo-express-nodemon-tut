const mongoose = require("mongoose");
const { databaseURI } = require("./uri");
const mongoURI = databaseURI;

const connectToMongo = async () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to mongo Successful"));
};

module.exports = connectToMongo;
