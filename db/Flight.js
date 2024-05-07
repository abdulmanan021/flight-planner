const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    origin:String,
    destination:String,
    cost:Number,
});

module.exports = mongoose.model("flights", flightSchema); // flights is a db collection