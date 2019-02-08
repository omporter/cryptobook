import React, { Component } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import PieChart from './piechart';
import Pie from "./piechart";


class Dashboard extends Component {
  state = {
    uid: ""

  };

  componentDidMount() {
    this.setState({ uid: this.props.auth.user.id });
  }

  testMethod = (e) => {
    this.secondMethod()
    .then(res => console.log('success', res.data))
    .catch(err => console.log(err))
  }

  secondMethod = (e) => {
    const url = 'http://localhost:4000/api/users/'
    return axios.get(url)
  }

  refreshPrices = e => {
    e.preventDefault();
    // Step 1: Fetch all data
    let url = "http://localhost:4000/api/users/retrieve-user/" + this.state.uid;
    axios
      .get(url)
      .then(res => {
        // Step 2: Fetch wrapper for each ticker
        let tickerBody = "";
        for (const i of res.data.liveTradesSheet) {
          tickerBody += i["Ticker"];
          tickerBody += ",";
        }
        tickerBody = tickerBody.slice(0, -1); // remove the last comma
        url = "http://localhost:4000/api/wrapper/multiple/" + tickerBody;
        axios
          .get(url)
          .then(res2 => {
            // Step 3: Create new data array of objects.
            const wrapperPrices = JSON.parse(res2.data);
            const liveTradesSheet = res.data.liveTradesSheet;
            let updatedTotalSheet = [];
            let updatedTicker = {};
            for (const i of liveTradesSheet) {
              updatedTicker['Id'] = i['Ticker'];
              const localAmount = (updatedTicker["Amount"] = i["Amount"]);
              updatedTicker["IsCapitalGain"] = i["IsCapitalGain"];
              const localTicker = (updatedTicker["Ticker"] = i["Ticker"]);
              updatedTicker["Token"] = i["Token"];
              updatedTicker["averageBuyPriceBtc"] = i["averageBuyPriceBtc"];
              updatedTicker["averageBuyPriceUsd"] = i["averageBuyPriceUsd"];
              updatedTicker["notes"] = i["notes"];
              updatedTicker["totalCommissionPaidBtc"] = i["totalCommissionPaidBtc"];
              updatedTicker["totalCommissionPaidUsd"] = i["totalCommissionPaidUsd"];
              const localTotalCostBtc = (updatedTicker["totalCostBtc"] = i["totalCostBtc"]);
              const localTotalCostUsd = (updatedTicker["totalCostUsd"] = i["totalCostUsd"]);
              // updatedTicker['TradeDuration'] = i['TradeDuration'];
              updatedTicker["DateToday"] = Date.now();
              const localLivePriceBtc = (updatedTicker["LivePriceBtc"] = wrapperPrices[localTicker]["BTC"]);
              const localLivePriceUsd = (updatedTicker["LivePriceUsd"] = wrapperPrices[localTicker]["USD"]);
              const localLiveValueBtc = (updatedTicker["LiveValueBtc"] = Number(localAmount) * Number(localLivePriceBtc));
              const localLiveValueUsd = (updatedTicker["LiveValueUsd"] = Number(localAmount) * Number(localLivePriceUsd));
              updatedTicker["unrealisedProfitLossBtc"] = Number(localLiveValueBtc) - Number(localTotalCostBtc);
              updatedTicker["unrealisedProfitLossUsd"] = Number(localLiveValueUsd) - Number(localTotalCostUsd);
              updatedTotalSheet.push(updatedTicker);
              updatedTicker = {};
            }
              // Step 4: Post to DB
            url ="http://localhost:4000/api/liveTradesSheet/refresh/" + this.state.uid;
            axios
              .put(url, updatedTotalSheet)
              .then(res3 => {
                // Step 5: Refresh portfolio sheet from (now updated) live trades sheet. 
                const uid = this.state.uid;
                let portfolioSheetData = []; // defining it in global scope
                let url = "http://localhost:4000/api/liveTradesSheet/retrieve-live-trades-sheet/" + uid;
                axios.get(url)
                  .then(res4 => {
                    url = "http://localhost:4000/api/portfolioSheet/delete-portfolio-sheet/" + uid;
                    axios.patch(url)
                      .then(res5 => {
                        const liveTradesSheet = res4.data.liveTradesSheet;
                        let template = {};
                        for (const i of liveTradesSheet) {
                          if (i["Ticker"] !== "") {
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
                        url = "http://localhost:4000/api/portfolioSheet/update-portfolio-sheet/" + uid;
                        axios.put(url, portfolioSheetData)
                          .then(res6 => {
                            console.log('All Tasks Complete', res6);
                          })
                          .catch(err6 => console.log({ err6: err6 }));
                      })
                      .catch(err5 => console.log({ err5: err5 }));
                  })
                  .catch(err4 => console.log({ err4: err4 }));
              })
              .catch(err3 => console.log({ err3: err3 }));
          })
          .catch(err2 => console.log({ err2: err2 }));
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <h1> Dashboard</h1>
        <button
          type="button"
          className="btn btn-outline-success btn-lg"
          onClick={this.refreshPrices}
        >
          Refresh Prices
        </button>

        <button
          type="button"
          className="btn btn-outline-success btn-lg"
          onClick={this.testMethod}
        >
          Test Button
        </button>



        <Pie></Pie>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(Dashboard);
