import React, { Component } from "react";
import axios from "axios";


class AddTrade extends Component {
  constructor() {
    super();
    this.state = {
      newDataHasError: false,
      buttonVal: "Buy",
      wrapperPriceBtc: 0,
      wrapperPriceUsd: 0,
      token: "",
      ticker: "",
      amount: "",
      priceBtc: "",
      priceUsd: "",
      exchange: "",
      notes: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onTickerChange = this.onChange.bind(this);
    this.onButtonPressBuy = this.onButtonPressBuy.bind(this);
  }

  onButtonPressBuy = e => {
    e.preventDefault();
    this.setState({ buttonVal: "Buy" });
    this.refreshPortfolioSheet();
  };

  onButtonPressSell = e => {
    e.preventDefault();
    this.setState({ buttonVal: "Sell" });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // onTickerChange = e => { 
  //   // different onChange event when the ticker is entered into form so we can send off an API call to auto generate the live prices for user reference. 
  //   let url = 'http://localhost:4000/api/wrapper/' + e.target.ticker;
  //   axios
  //     .get(url)
  //     .then(res0 => {
  //       const data = JSON.parse(res0.data);    
  //       this.setState({ wrapperPriceBtc: data['BTC'] });
  //       this.setState({ wrapperPriceUsd: data['USD'] }); 
  //       this.setState({ [e.target.name]: e.target.value });
  //       console.log(this.state.wrapperPriceBtc);
  //     }).catch(err => console.log(err));
  // }


  refreshPortfolioSheet = e => {
    const uid = "5c1ad058ab6bf5413f08896e";
    let portfolioSheetData = []; // defining it in global scope
    console.log('Setting portfolioSheetData to []')
    // fetch latest data from live trades sheet
    let url = "http://localhost:4000/api/liveTradesSheet/retrieve-live-trades-sheet/" + uid;
    console.log('Running res1 - retrieve-live-trades-sheet ')
    axios.get(url)
      .then(res1 => {
        // set portfolioSheet to empty array
        console.log('retrieve-live-trades-sheet successfully retrieved, res1 is', res1);
        url = "http://localhost:4000/api/portfolioSheet/delete-portfolio-sheet/" + uid;
        console.log('running delete-portfolio sheet');
        axios.patch(url)
          .then(res2 => {
            console.log("portfolio sheet succesfully deleted, res2 is", res2);
            const liveTradesSheet = res1.data.liveTradesSheet;
            console.log('initialising template for each ticker');
            let template = {
              ticker: "",
              token: "",
              holdings: 0,
              priceBtc: 0,
              priceUsd: 0,
              totalBtc: 0,
              totalUsd: 0,
              percentOfTotalPortfolio: 0
            };
            console.log('running loop to append each object to array of data');
            for (const i of liveTradesSheet) {
              if (i["Ticker"] !== "") {
                // filters out any blank entries, can probably delete this once validation is complete on form
                template['id'] = i["Ticker"];
                template['token'] = i['Token'];
                template["ticker"] = i["Ticker"];
                template["holdings"] = i["Amount"];
                template["priceBtc"] = i["LivePriceBtc"];
                template["priceUsd"] = i["LivePriceUsd"];
                template["totalBtc"] = i["LiveValueBtc"];
                template["totalUsd"] = i["LiveValueUsd"];
                portfolioSheetData.push(template);
                template = {};
              }
            }
            console.log("portfolioSheetData successfully created, is", portfolioSheetData);
            url = "http://localhost:4000/api/portfolioSheet/update-portfolio-sheet/" + uid;
            console.log('running update-portfolio-sheet')
            axios.put(url, portfolioSheetData)
              .then(res3 => {
                console.log("portfolioSheet succesfully updated, res3 is", res3)
              })
              .catch(err => console.log({ err: err }));
          })
          .catch(err => console.log({ err: err }));
      })
      .catch(err => console.log({ err: err }));
  };
  

  onSubmit = e => {
    e.preventDefault();

    // Fetch live prices for ticker
    let url = 'http://localhost:4000/api/wrapper/' + this.state.ticker;
    axios.get(url)
      .then(res0 => {
        const data = JSON.parse(res0.data);    
        this.setState({ wrapperPriceBtc: data['BTC'] });
        this.setState({ wrapperPriceUsd: data['USD'] });


    // Step1: Add Ticker Form to Tickers Sheet
    const uid = "5c1ad058ab6bf5413f08896e";
     url = "http://localhost:4000/api/tickersSheet/retrieve-tickers-sheet/" + uid;
    axios.get(url)
      .then(res1 => {
        let tickerData = {
          token: this.state.token,
          ticker: this.state.ticker,
          complete: false,
          amount: this.state.amount,
          date: Date.now(),
          exchange: this.state.exchange,
          targetSell: this.state.targetSell,
          stopLoss: this.state.stopLoss,
          notes: this.state.notes
        };
        // set price to live price if no price is entered 
        if (Number(this.state.priceBtc) === 0) {
          tickerData['priceBtc'] = this.state.wrapperPriceBtc;
        } else {
          tickerData['priceBtc'] =  this.state.priceBtc;
        }
        if (Number(this.state.priceUsd) === 0) {
          tickerData['priceUsd'] = this.state.wrapperPriceUsd;
        } else {
          tickerData['priceUsd'] =  this.state.priceUsd;
        }
        // generate totals
        tickerData["totalBtc"] = tickerData["priceBtc"] * tickerData["amount"];
        tickerData["totalUsd"] = tickerData["priceUsd"] * tickerData["amount"];
        // generate ids
        let localPath = this.state.ticker + this.state.buttonVal;
        let localLength;
        if (res1.data[localPath] === undefined) {
          localLength = 0;
        } else {
          localLength = res1.data[localPath].length;
        }
        if (localLength === 0) {
          tickerData["buyId"] = this.state.ticker + "Buy1";
          tickerData["tradeId"] = this.state.ticker + "1";
        } else {
          tickerData["buyId"] = this.state.ticker + "Buy" + (localLength + 1);
          tickerData["tradeId"] = this.state.ticker + (localLength + 1);
        }
        // generate commission vals
        tickerData["commissionPercent"] = 1;
        tickerData["commissionCostBtc"] = 1;
        tickerData["commissionCostUsd"] = 1;
        const ticker = this.state.ticker;
        const method = this.state.buttonVal;
        if (this.state.tickerDataHasError === true) {
          // validation checks
          console.log("error, tickerDataHaError is true. Please try again");
        } else {
          url = "http://localhost:4000/api/tickersSheet/update-tickers-sheet/" + ticker + method + "/" + uid;
          axios.put(url, tickerData)
            .then(res2 => console.log("Tickers Sheet for " + ticker + " in Synch",res2.data))
            .catch(err => console.log({ err: err }));
        }




        // step 2: add to live trades if buy trade
        const liveSheetsData = {
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
        if (tickerHistory === undefined) { // if first time adding ticker, must manually use original tickerData variable from step 1.
          console.log("tickerHistory reassigned to original tickerData object");
          tickerHistory = [];
          tickerHistory.push(tickerData);
        }
        let totalCostBtc, totalCostUsd;
        let historicAmountsTotal = totalCostBtc = totalCostUsd = 0;
        let mostRecentBuyDate = []; // make array of buy dates so we can find the largest (most recent one)
        for (const i of tickerHistory) {
          if (i["complete"] !== true) { // checks the trade isn't in completed trades
            historicAmountsTotal += Number(i["amount"]);
            totalCostBtc += Number(i["totalBtc"]);
            totalCostUsd += Number(i["totalUsd"]);
            mostRecentBuyDate += i["date"];
          }
        }
        liveSheetsData["Id"] = this.state.ticker;
        let amount = liveSheetsData["Amount"] = historicAmountsTotal;
        liveSheetsData["totalCostBtc"] = totalCostBtc;
        liveSheetsData["totalCostUsd"] = totalCostUsd;
        liveSheetsData["averageBuyPriceBtc"] = totalCostBtc / historicAmountsTotal;
        liveSheetsData["averageBuyPriceUsd"] = totalCostUsd / historicAmountsTotal;
        let liveValueBtc = liveSheetsData["LiveValueBtc"] = Number(amount) * Number(this.state.wrapperPriceBtc);
        let liveValueUsd = liveSheetsData["LiveValueUsd"] = Number(amount) * Number(this.state.wrapperPriceUsd);
        liveSheetsData['unrealisedProfitLossBtc'] = liveValueBtc - totalCostBtc;
        liveSheetsData['unrealisedProfitLossUsd'] = liveValueUsd - totalCostUsd;

        // liveSheetsData["mostRecentBuyDate"] = Math.max.apply(Math, mostRecentBuyDate); // where largest is most recent
        let isNewTickerInLiveTradesAlready = false; // if new just push, else must delete existing record then create new one
        for (const i of res1.data.liveTradesSheet) {
          if (i["Ticker"] === this.state.ticker) {
            isNewTickerInLiveTradesAlready = true;
          }
        }
        if (isNewTickerInLiveTradesAlready === false) { // just push to live trades sheet
          url = "http://localhost:4000/api/liveTradesSheet/update-live-trades-sheet/" + uid;
          console.log("First Instance of Ticker in Live Trades. Creating New Object");
          axios.put(url, liveSheetsData)
            .then(res3 =>console.log("Data successfully appended to Live Trades Sheet", res3.data))
            .catch(err => console.log({ err: err }));
        } else {
          // if ticker exists already, must delete existing instance and create new one
          console.log("Ticker Already Exists. Deleting Existing Record of Ticker in Live Trades Then Updating.");
          const localMethod = this.state.ticker + "Buy";
          console.log("Data to Manipulate from Database is",res1.data[localMethod]);
          // step2.1: delete existing record.
          url ="http://localhost:4000/api/liveTradesSheet/delete-live-trades-sheet/" + uid + "/" + this.state.ticker;
          axios.patch(url)
            .then(res4 => {
              let mostRecentBuyDate = []; // make array of buy dates so we can find the largest (most recent one)
              let updatedAmount = liveSheetsData["Amount"]  = historicAmountsTotal + Number(this.state.amount);
              let updatedTotalCostBtc = liveSheetsData["totalCostBtc"] = totalCostBtc + (updatedAmount * this.state.priceBtc);
              let updatedTotalCostUsd = liveSheetsData["totalCostUsd"] = totalCostUsd + (updatedAmount * this.state.priceUsd);
              liveSheetsData["averageBuyPriceBtc"] = updatedTotalCostBtc / updatedAmount;
              liveSheetsData["averageBuyPriceUsd"] = updatedTotalCostUsd / updatedAmount;
              let liveValueBtc = liveSheetsData["LiveValueBtc"] = updatedAmount * Number(this.state.wrapperPriceBtc);
              let liveValueUsd = liveSheetsData["LiveValueUsd"] = updatedAmount * Number(this.state.wrapperPriceUsd);
              liveSheetsData['unrealisedProfitLossBtc'] = liveValueBtc - updatedTotalCostBtc;
              liveSheetsData['unrealisedProfitLossUsd'] = liveValueUsd - updatedTotalCostUsd;
              // step2.3: put request
              url ="http://localhost:4000/api/liveTradesSheet/update-live-trades-sheet/" + uid;
              axios.put(url, liveSheetsData)
                .then(res3 => {
                  console.log("Live Trades Sheet in Synch", res3.data)
                  // step 3: update portfolio Sheet 
                  this.refreshPortfolioSheet();
              })
                .catch(err => console.log({ err: err }));
            })
            .catch(err => console.log({ err: err }));
        }})
      .catch(err => console.log({err: err}));
    })
    .catch(err => console.log({err: err})); 
  };

  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-outline-success btn-lg"
          onClick={this.onButtonPressBuy}
        >
          Buy Trade
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-lg"
          onClick={this.onButtonPressSell}
        >
          Sell Trade
        </button>
        <br /> <br />
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col">
              <label>Token</label>
              <input
                className="form-control"
                name="token"
                placeholder="Token..."
                value={this.state.token}
                onChange={this.onChange}
              />{" "}
              <br />
            </div>
            <div className="col">
              <label> Ticker </label>
              <input
                className="form-control"
                name="ticker"
                placeholder="Ticker..."
                value={this.state.ticker}
                onChange={this.onChange}
              />
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>Amount</label>
              <input
                className="form-control"
                name="amount"
                placeholder="Amount..."
                value={this.state.amount}
                onChange={this.onChange}
              />
              <br />
            </div>
            <div className="col">
              <label> Exchange </label>
              <input
                className="form-control"
                name="exchange"
                placeholder="Exchange..."
                value={this.state.exchange}
                onChange={this.onChange}
              />
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>Price BTC</label>
              <input
                className="form-control"
                name="priceBtc"
                placeholder={this.state.wrapperPriceBtc}
                value={this.state.priceBtc}
                onChange={this.onChange}
              />
              <br />
            </div>
            <div className="col">
              <label> Price USD </label>
              <input
                className="form-control"
                name="priceUsd"
                placeholder={this.state.wrapperPriceUsd}
                value={this.state.priceUsd}
                onChange={this.onChange}
              />
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label>Notes</label>
              <input
                className="form-control"
                name="notes"
                placeholder="Notes..."
                value={this.state.notes}
                onChange={this.onChange}
              />
              <br />
            </div>
          </div>
          <button className="btn btn-dark" type="submit">
            Submit
          </button>
          <div className="form-bottom" />
        </form>
      </div>
    );
  }
}

export default AddTrade;
