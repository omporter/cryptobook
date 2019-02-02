const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EachTickerSchema = require('./EachTickerSchema');

const MetaTickersSchema = new Schema({
}, {strict: false});


module.exports = MetaTickersSchema;