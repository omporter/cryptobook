const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BuySchema = require('./BuySchema');
const SellSchema = require('./SellSchema');
const MatchSchema = require('./MatchSchema');


const EachTickerSchema = new Schema({
    BuySheet: [BuySchema],
    SellSheet: [SellSchema, {default: 'test'}],
    MatchSheet: [MatchSchema, {default: 'test'}]
});


module.exports = EachTickerSchema;