const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String
});

module.exports = mongoose.model("users", userSchema); // users is a db collection