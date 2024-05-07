const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    name:String,
});

module.exports = mongoose.model("cities", citySchema); // cities is a db collection