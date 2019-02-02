/* 


All fields for liveTradesSheet: 

Ticker
Token
LivePriceBtc
LivePriceUsd
DateToday
TradeDuration
IsCapitalGain
totalCommissionPaidBtc
totalCommissionPaidUsd
notes
Id
amount
totalCostBtc
totalCostUsd
averageBuyPriceBtc
averageBuyPriceUsd

liveValueBtc
liveValueUsd
unrealisedProfitLossBtc
unrealisedProfitLossUsd





what will be the same? 

Ticker
Token
LivePriceBtc
LivePriceUsd
DateToday
TradeDuration
IsCapitalGain
totalCommissionPaidBtc
totalCommissionPaidUsd
notes
Id



what will be different? 

amount
totalCostBtc
totalCostUsd
averageBuyPriceBtc
averageBuyPriceUsd
totalCostBtc
totalCostUsd
liveValueBtc
liveValueUsd
unrealisedProfitLossBtc
unrealisedProfitLossUsd

*/



const newData2 = {
    Ticker: this.state.ticker,
    Token: this.state.token,
    LivePriceBtc: Number(this.state.wrapperPriceBtc),
    LivePriceUsd: Number(this.state.wrapperPriceUsd),
    DateToday: Date.now(),
    TradeDutation: 1,
    IsCapitalGain: false,
    totalCommissionPaidBtc: 1,
    totalCommissionPaidUsd: 1,
    notes: 1,
  };
  let location = this.state.ticker + "Buy";
  let tickerHistory = res1.data[location];
  console.log("tickerHistory is", tickerHistory);
  if (tickerHistory === undefined) { // if first time adding ticker, must manually use original newData variable from step 1.
    console.log("tickerHistory reassigned to original newData object");
    tickerHistory = [];
    tickerHistory.push(newData);
  }
  let totalCostBtc, totalCostUsd;
  let localAmount = totalCostBtc = totalCostUsd = 0;
  let mostRecentBuyDate = []; // make array of buy dates so we can find the largest (most recent one)
  for (const i of tickerHistory) {
    if (i["complete"] !== true) { // checks the trade isn't in completed trades
      localAmount += Number(i["amount"]);
      totalCostBtc += Number(i["totalBtc"]);
      totalCostUsd += Number(i["totalUsd"]);
      mostRecentBuyDate += i["date"];
    }
  }
  newData2["Id"] = this.state.ticker;
  newData2["Amount"] = localAmount;
  newData2["totalCostBtc"] = totalCostBtc;
  newData2["totalCostUsd"] = totalCostUsd;
  newData2["averageBuyPriceBtc"] = totalCostBtc / localAmount;
  newData2["averageBuyPriceUsd"] = totalCostUsd / localAmount;
  














  const newData3 = {
    Ticker: this.state.ticker,
    Token: this.state.token,
    LivePriceBtc: Number(this.state.wrapperPriceBtc),
    LivePriceUsd: Number(this.state.wrapperPriceUsd),
    DateToday: Date.now(),
    TradeDutation: 1,
    IsCapitalGain: false,
    totalCommissionPaidBtc: 1,
    totalCommissionPaidUsd: 1,
    notes: 1,
  };
  let location = this.state.ticker + "Buy";
  let toLoop = res1.data[location];
  let historicAmountsTotal = 0;
  let totalCostBtc = 0;
  let totalCostUsd = 0;
  let mostRecentBuyDate = []; // make array of buy dates so we can find the largest (most recent one)
  for (const i of toLoop) {
    if (i["complete"] !== true) { // checks the trade isn't in completed trades
      historicAmountsTotal += Number(i["amount"]);
      totalCostBtc += Number(i["totalBtc"]);
      totalCostUsd += Number(i["totalUsd"]);
      mostRecentBuyDate += i["date"];
    }
  }
  newData3["Id"] = this.state.ticker;
  let updatedAmount = newData3["Amount"]  = historicAmountsTotal + Number(this.state.amount);
  let updatedTotalCostBtc = newData3["totalCostBtc"] = totalCostBtc + (updatedAmount * this.state.priceBtc);
  let updatedTotalCostUsd = newData3["totalCostUsd"] = totalCostUsd + (updatedAmount * this.state.priceUsd);
  newData3["averageBuyPriceBtc"] = updatedTotalCostBtc / updatedAmount;
  newData3["averageBuyPriceUsd"] = updatedTotalCostUsd / updatedAmount;
  let liveValueBtc = newData3["LiveValueBtc"] = updatedAmount * Number(this.state.wrapperPriceBtc);
  let liveValueUsd = newData3["LiveValueUsd"] = updatedAmount * Number(this.state.wrapperPriceUsd);
  newData3['unrealisedProfitLossBtc'] = liveValueBtc - updatedTotalCostBtc;
  newData3['unrealisedProfitLossUsd'] = liveValueUsd - updatedTotalCostUsd;