const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BuySchema = new Schema({
  ticker: { type: String, default: "" },
  token: { type: String, default: "" },
  buyId: { type: String, default: "" },
  tradeId: { type: String, default: "" },
  complete: { type: String, default: "" },
  amount: { type: String, default: "" },
  priceBtc: { type: String, default: "" },
  priceUsd: { type: String, default: "" },
  totalBtc: { type: String, default: "" },
  totalUsd: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  exchange: { type: String, default: "" },
  commissionPercent: { type: String, default: "" },
  commissionCostBtc: { type: String, default: "" },
  commissionCostUsd: { type: String, default: "" },
  targetSell: { type: String, default: "" },
  stopLoss: { type: String, default: "" },
  riskRewardRatio: { type: String, default: "" },
  notes: { type: String, default: "" }
});

module.exports = BuySchema;
