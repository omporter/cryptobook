import React, { Component } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import classnames from 'classnames';

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
      notes: "",
      uid: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onTickerChange = this.onChange.bind(this);
    this.onButtonPressBuy = this.onButtonPressBuy.bind(this);
  };

  // React Methods
  componentDidMount () {
    this.setState({uid: this.props.auth.user.id})
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // State Methods
  onButtonPressBuy = e => {
    e.preventDefault();
    this.setState({ buttonVal: "Buy" });
  };
  onButtonPressSell = e => {
    e.preventDefault();
    this.setState({ buttonVal: "Sell" });
  };

  // Wrapper Method
  fetchLivePrice = (ticker) => {
    return axios.get('http://localhost:4000/api/wrapper/' + ticker)
  };

  // Portfolio Sheet Methods
  deletePortfolioSheet = (e) => {
    const url = "http://localhost:4000/api/portfolioSheet/delete-portfolio-sheet/" + this.state.uid;
    return axios.patch(url)
  };
  postPortfolioSheet = (res1, res2) => {
    const liveTradesSheet = res1.data.liveTradesSheet;
    let portfolioSheetData = [];
    let template = {};
    for (const i of liveTradesSheet) {
      if (i["Ticker"] !== "") { // filters out any blank entries, can probably delete this once validation is complete on form
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
    const url = "http://localhost:4000/api/portfolioSheet/update-portfolio-sheet/" + this.state.uid;
    return axios.put(url, portfolioSheetData)
  };
  refreshPortfolioSheet = e => {
    this.fetchLiveTradesSheetData().then(res1 => {
        this.deletePortfolioSheet().then(res2 => {
          this.postPortfolioSheet(res1, res2).then(res3 => {
                console.log('Portfolio Sheet in Synch');
              }).catch(err => console.log({ err: err }));
          }).catch(err => console.log({ err: err }));
      }).catch(err => console.log({ err: err }));
  };

  // Tickers Sheets Buy/Sell Methods
  fetchTickersSheet = (res0) => {
    const data = JSON.parse(res0.data);    
    this.setState({ wrapperPriceBtc: data['BTC'] });
    this.setState({ wrapperPriceUsd: data['USD'] });
    return axios.get("http://localhost:4000/api/tickersSheet/retrieve-tickers-sheet/" + this.state.uid)
  };
  addTickersMeta = (res1) => {
    let url;
    // create data object 
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
    // Set price to wrapper price if none entered
    if (Number(this.state.priceBtc) === 0) { // Number of empty string is 0 in js.// 2.1 set price to live price if no price is entered 
      let setPriceBtcIfEmptyString = tickerData['priceBtc'] = this.state.wrapperPriceBtc;
      this.setState({priceBtc: setPriceBtcIfEmptyString});
    } else {
      tickerData['priceBtc'] =  this.state.priceBtc;
    }
    if (Number(this.state.priceUsd) === 0) {
      let setPriceUsdIfEmptyString = tickerData['priceUsd'] = this.state.wrapperPriceUsd;
      this.setState({priceUsd: setPriceUsdIfEmptyString});
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
      if (this.state.buttonVal === 'Buy') {
        tickerData["buyId"] = this.state.ticker + "Buy1";
      } else if (this.state.buttonVal === 'Sell') {
        tickerData["sellId"] = this.state.ticker + "Sell1";
      }
      tickerData["tradeId"] = this.state.ticker + "1";
    } else {
      if (this.state.buttonVal === 'Buy') {
        tickerData["buyId"] = this.state.ticker + "Buy" + (localLength + 1);
      } else if (this.state.buttonVal === 'Sell') {
        tickerData["sellId"] = this.state.ticker + "Sell" + (localLength + 1);
      }
      tickerData["tradeId"] = this.state.ticker + (localLength + 1);
    }
    // generate commission vals
    tickerData["commissionPercent"] = 1;         
    tickerData["commissionCostBtc"] = 1;
    tickerData["commissionCostUsd"] = 1;
    // validation checks and post request 
    if (this.state.tickerDataHasError === true) {           
      console.log("error, tickerDataHaError is true. Please try again");
    } else {
      url = "http://localhost:4000/api/tickersSheet/update-tickers-sheet/" + this.state.ticker + this.state.buttonVal + "/" + this.state.uid;
      axios.put(url, tickerData)
        .then(res2 => {
          console.log("Tickers Sheet for " + this.state.ticker + " in Synch",res2.data)        
        })
        .catch(err => console.log({ err: err }));
    }
    return tickerData
  };
  setMostRecentBuyToComplete = (dbdata) => {
    // Sets the buy trads field {complete: true}
    // There is definitely a more efficient way to do this using mongo logic. Doing it manually for now to save time.
    // Step 1: Get highest buyid 
    const mostRecentBuyId = this.getArrayOfBuyIdsByDateAdded(dbdata)[0];
    // Step 2: Create new object. 
    const location = this.state.ticker + 'Buy';
    const updatedData = dbdata.data[location]
    const updatedObject = {};
    for (const i of updatedData) {
      if (i['buyId'] === mostRecentBuyId) {
        updatedObject['ticker'] = i['ticker'];
        updatedObject['complete'] = true;
        updatedObject['amount'] = i['amount'];
        updatedObject['date'] = i['date'];
        updatedObject['exchange'] =  i['exchange'];
        updatedObject['notes'] =  i['notes'];
        updatedObject['priceBtc'] =  i['priceBtc'];
        updatedObject['priceUsd'] =  i['priceUsd'];
        updatedObject['totalBtc'] =  i['totalBtc'];
        updatedObject['totalUsd'] =  i['totalUsd'];
        updatedObject['buyId'] =  i['buyId'];
        updatedObject['tradeId'] =  i['tradeId'];
        updatedObject['commissionPercent'] =  i['commissionPercent'];
        updatedObject['commissionCostBtc'] =  i['commissionCostBtc'];
        updatedObject['commissionCostUsd'] =  i['commissionCostUsd']
      }
    }
    console.log('object created');
    // Step 2: Delete existing record. 
    let url = 'http://localhost:4000/api/tickersSheet/removeBuyById/' + this.state.uid + '/' + this.state.ticker + 'Buy/' + mostRecentBuyId;
    console.log('calling axios now')
     axios.patch(url).then(() => {
      console.log('axios succesfully called')
      url = 'http://localhost:4000/api/tickersSheet/update-tickers-sheet/' + this.state.ticker + 'Buy/' + this.state.uid;
      console.log('url is', url);
      // Step 3: Post New object. 
      return (axios.put(url, updatedObject));
    }).catch(err => console.log({err:err})); 
  }
  closeMatchTrade = (dbdataUpdatedWithMatch, currentMatchId) => {
    // Sets the match trades fields {completed: true} and {buyId: [corrospondingBuyId] }
    // There is definitely a more efficient way to do this using mongo logic. Doing it manually for now to save time.
    // Step 1: Get current match id, 

    // Step 2: Create new object. 
    const location = this.state.ticker + 'Match';
    const updatedData = dbdataUpdatedWithMatch.data[location];
    const updatedObject = {};
    for (const i of updatedData) {
      if (i['matchId'] === currentMatchId) {
        updatedObject['buyId'] = this.getArrayOfBuyIdsByDateAdded(dbdataUpdatedWithMatch)[0];
        updatedObject['completed'] = true;
        updatedObject['sellId'] = i['sellId'];
        updatedObject['matchId'] = i['matchId'];
        updatedObject['inCompletedTrades'] =  i['inCompletedTrades'];
        updatedObject['amount'] =  i['amount'];
        updatedObject['priceBtc'] =  i['priceBtc'];
        updatedObject['priceUsd'] =  i['priceUsd'];
        updatedObject['totalBtc'] =  i['totalBtc'];
        updatedObject['totalUsd'] =  i['totalUsd'];
        updatedObject['date'] =  i['date'];
        updatedObject['exchange'] =  i['exchange'];
        updatedObject['notes'] =  i['notes'];
      }
    }
    // Step 2: Delete existing record. 
    let url = 'http://localhost:4000/api/tickersSheet/removeMatchById/' + this.state.uid + '/' + this.state.ticker + 'Match/' + currentMatchId;
    axios.patch(url).then(() => {
      url = 'http://localhost:4000/api/tickersSheet/update-tickers-sheet/' + this.state.ticker + 'Match/' + this.state.uid;
      // Step 3: Post New object. 
      console.log('up to here succesfully');
      return axios.put(url, updatedObject)
    }).catch(err => console.log({err:err})); 
  }

  // Tickers Sheets Match Methods
  addMatch = (dbdata, tickerData) => {
    const tickerMatchData = {
        buyId: '',
        sellId: tickerData['sellId'],
        matchId: this.nextMatchId(dbdata),
        completed: tickerData['complete'],
        inCompletedTrades: false,
        amount: tickerData['amount'],
        priceBtc: tickerData['priceBtc'],
        priceUsd: tickerData['priceUsd'],
        totalBtc: tickerData['totalBtc'],
        totalUsd: tickerData['totalUsd'],
        date: Date.now(),
        exchange: tickerData['exchange'],
        notes : tickerData['notes']
      };
    const url = "http://localhost:4000/api/tickersSheet/update-tickers-sheet/" + this.state.ticker + 'Match/' + this.state.uid;
    return axios.put(url, tickerMatchData)
  };
  nextMatchId = (dbdata, tickerData) => {
    let location = this.state.ticker + 'Sell';
    if(dbdata.data[location] === undefined) {
      return 'temp1';
    } else {
      const tempArray = [];
      location = this.state.ticker + 'Match';
      for (const i of dbdata.data[location]){
        if (i['complete'] !== true) {
          const a = i['matchId']
          const b = a.slice(-1);
          tempArray.push(Number(b));
        }
      }
      const max = (Math.max(...tempArray)) + 1;
      return 'temp' + max;
    }

  }
  getArrayOfBuyIdsByDateAdded = (dbdata) => {
    // We can assume the lower the Buy Id number, the earlier the date. 
    // However if we add 'Add Trade by Past Date' functionality, this code will need to be refactored. 
    const arrayOfBuyIds= [];
    const location = this.state.ticker + 'Buy';
    const tickerBuys = dbdata.data[location];
    for (const i of tickerBuys) {
      if (i['complete'] !== true) {
        arrayOfBuyIds.push(i['buyId'])
      }
    }
    return arrayOfBuyIds.reverse();
  }
  getMostRecentBuyAmount = (dbdata) => {
    let mostRecentBuyAmount;
    const arrayOfBuyIdsByMostRecentlyAdded = this.getArrayOfBuyIdsByDateAdded(dbdata)
    const location = this.state.ticker + 'Buy'
    for (const i of dbdata.data[location]){
      if (i['buyId'] === arrayOfBuyIdsByMostRecentlyAdded[0]) {
        mostRecentBuyAmount = i['amount'];
      }
    }
    return mostRecentBuyAmount;
  }
  vacuumTemps = (dbdata, tickerData) => {
    console.log('vacuumTemps called');
  }
  getCurrentMatchId = (dbdataUpdatedWithMatch) => {
    const location = this.state.ticker + 'Match';
    const a = dbdataUpdatedWithMatch.data[location];
    const b = [];
    for (const i of a) {
      b.push(i['matchId']);      
    }
    const result = b.slice(-1)[0] 
    return result;
  }


  // Live Sheets Methods
  fetchLiveTradesSheetData = e => {
    const url = "http://localhost:4000/api/liveTradesSheet/retrieve-live-trades-sheet/" + this.state.uid;
    return axios.get(url)
  };
  liveTradesMeta = (res1, tickerData) => {
    let url;
    const uid = this.state.uid;
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
          if (tickerHistory === undefined) { // if first time adding ticker, must manually use original tickerData variable from step 1.
            // console.log("tickerHistory reassigned to original tickerData object");
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
          liveSheetsData['mostRecentBuyDate'] = mostRecentBuyDate;
          // liveSheetsData["mostRecentBuyDate"] = Math.max.apply(Math, mostRecentBuyDate); // where largest is most recent
          let isNewTickerInLiveTradesAlready = false; // if new just push, else must delete existing record then create new one
          if (!(res1.data.liveTradesSheet === undefined)) {
            for (const i of res1.data.liveTradesSheet) {
              if (i["Ticker"] === this.state.ticker) {
                isNewTickerInLiveTradesAlready = true;
              }
            }
          }
          if (isNewTickerInLiveTradesAlready === false) { // just push to live trades sheet
            url = "http://localhost:4000/api/liveTradesSheet/update-live-trades-sheet/" + uid;
            // console.log("First Instance of Ticker in Live Trades. Creating New Object");
            axios.put(url, liveSheetsData)
              .then(res3 =>console.log("Data successfully appended to Live Trades Sheet", res3.data))
              .catch(err => console.log({ err: err }));
          } else {
            // if ticker exists already, must delete existing instance and create new one
            // console.log("Ticker Already Exists. Deleting Existing Record of Ticker in Live Trades Then Updating.");
            // const localMethod = this.state.ticker + "Buy";
            // step2.1: delete existing record.
            url ="http://localhost:4000/api/liveTradesSheet/delete-live-trades-sheet/" + uid + "/" + this.state.ticker;
            axios.patch(url)
              .then(res3 => {
                // let mostRecentBuyDate = []; // make array of buy dates so we can find the largest (most recent one)
                let updatedAmount = liveSheetsData["Amount"]  = historicAmountsTotal + Number(this.state.amount);
                let updatedTotalCostBtc = liveSheetsData["totalCostBtc"] = totalCostBtc + (Number(this.state.amount) * this.state.priceBtc);
                let updatedTotalCostUsd = liveSheetsData["totalCostUsd"] = totalCostUsd + (Number(this.state.amount) * this.state.priceUsd);
                liveSheetsData["averageBuyPriceBtc"] = updatedTotalCostBtc / updatedAmount;
                liveSheetsData["averageBuyPriceUsd"] = updatedTotalCostUsd / updatedAmount;
                let liveValueBtc = liveSheetsData["LiveValueBtc"] = updatedAmount * Number(this.state.wrapperPriceBtc);
                let liveValueUsd = liveSheetsData["LiveValueUsd"] = updatedAmount * Number(this.state.wrapperPriceUsd);
                liveSheetsData['unrealisedProfitLossBtc'] = liveValueBtc - updatedTotalCostBtc;
                liveSheetsData['unrealisedProfitLossUsd'] = liveValueUsd - updatedTotalCostUsd;
                // step2.3: put request
                url ="http://localhost:4000/api/liveTradesSheet/update-live-trades-sheet/" + uid;
                axios.put(url, liveSheetsData)
                  .then(res4 => {
                    console.log("Live Trades Sheet in Synch", res3.data)
                    // step 3: update portfolio Sheet 
                    this.refreshPortfolioSheet();
                })
                  .catch(err => console.log({ err: err }));
              })
              .catch(err => console.log({ err: err }));
             }

  };

  // Completed Trades Sheet Methods 
  compileCompletedTrades = (dbdataUpdatedAll) => {
      // For this.state.ticker, for any trade that is {complete: true} && {inCompletedTrades: false}:
      // (i) Add that trade to completed trades sheet,
      // (ii) Set status of match trade to {inCompletedTrades: true}
      console.log('completd trades data', dbdataUpdatedAll);
  }

 // Meta Methods: 
  sellMeta = (dbdata, tickerData) => {

    // Step 1: Add to Tickers Sheet under Match
    this.addMatch(dbdata, tickerData).then((dbdataUpdatedWithMatch) => {
      // Step 2: Get Most Recent Buy, and Current Sell Amounts 
      const mostRecentBuyAmount = this.getMostRecentBuyAmount(dbdata);
      const sellAmount = tickerData['amount'];

      // Step 3: Run Matching Logic 
      if (sellAmount < mostRecentBuyAmount) {
        this.vacuumTemps(dbdata, tickerData)
      } else if (sellAmount === mostRecentBuyAmount){
        console.log('starting === condition');
        this.setMostRecentBuyToComplete(dbdata).then((d) => {
          console.log('most recent buy set to complete');
          const currentMatchId = this.getCurrentMatchId(dbdataUpdatedWithMatch);
          this.closeMatchTrade(dbdataUpdatedWithMatch, currentMatchId).then((dbdataUpdatedAll) => {
            this.compileCompletedTrades(dbdataUpdatedAll)
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      } else if (sellAmount > mostRecentBuyAmount) {
      } else {
        console.log('Error, sellAmount or mostRecentBuyAmount are not numbers')
      }
      
      // Step 5: Update Live Trades
      // Update with (now removed) ticker buys that are {complete: true} 


    }).catch(addMatchErr => console.log(addMatchErr));
  };

// User Action Methods
  onSubmit = e => {
    e.preventDefault();
    // Step 1: Fetch Live Prices from Wrapper for use in (i) Live Trades Unrealised P/L, and (ii) In Event of No Price Entered in Form. 
    this.fetchLivePrice(this.state.ticker).then(res0 => {
      // Step 2: Fetch Current Data for Entered Ticker in the DB 
      this.fetchTickersSheet(res0).then(res1 => {  
        // Step 3: With that data, Add to Tickers Sheet (works for both buy and sell trades)  
        const tickerData = this.addTickersMeta(res1);
        // Step 4: Run Buy and Sell Logic 
        if(this.state.buttonVal === 'Sell') {
          this.sellMeta(res1, tickerData)
        } else if (this.state.buttonVal === 'Buy') {
          this.liveTradesMeta(res1, tickerData)
        } else {
          console.log('Oops, button is neither buy or sell');
        }
        this.props.history.push('/dashboard');
      })
      .catch(err => console.log({err: err}));
    })
    .catch(err => console.log({err: err})); 
  };

// Render Method
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

AddTrade.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(AddTrade);




