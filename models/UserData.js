const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PortfolioSchema = require('./PortfolioSchema');
const LiveTradesSchema = require('./LiveTradesSchema');
const CompletedTradesSchema = require('./CompletedTradesSchema');
const MetaTickerSchema = require('./tickers/MetaTickerSchema');
const EachTickerSchema = require('./tickers/EachTickerSchema');
const BuySchema = require('./tickers/BuySchema');


const userDataSchema = new Schema({
  _id: new mongoose.Schema.Types.ObjectId({ supresswarning: true }),
  user: {
    type: String,
    required: true
  },
  // practice: [{innerPractice: {type: String, default: "No content"}}],
  // portfolioSheet: [PortfolioSchema],
  // liveTradesSheet: [LiveTradesSchema],
  // completedTradesSheet: [CompletedTradesSchema],
  // tickersSheets: [MetaTickerSchema]
  // tickersSheets: [EachTickerSchema]
  // tickersSheets: [BuySchema]
  // tickersSheets: [{BTC: [{BuySchema:[{buyId: String, totalBtc: String}]}]}]
}, {strict: false});

module.exports = mongoose.model("userData", userDataSchema);
