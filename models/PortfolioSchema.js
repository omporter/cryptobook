const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
    token: String,
    ticker: String,
    coinPriceBtc: String,
    coinPriceUsd: String,
    holdings: String,
    totalBtc: String,
    totalUsd: String,
    percentOfTotalPortfolio: String
});


module.exports = PortfolioSchema;