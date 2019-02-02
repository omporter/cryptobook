const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const LiveTradesSchema = new Schema({
    test1: String,
    test2: String
});


module.exports = LiveTradesSchema;