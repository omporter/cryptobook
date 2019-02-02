const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const MatchSchema = new Schema({
    test1: String
});

module.exports = MatchSchema;