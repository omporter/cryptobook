import React, { Component } from "react";

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import BootstrapTable from "react-bootstrap-table-next";

const axios = require("axios");

class Portfolio extends Component {
  constructor() {
    super();
    this.state = {
      uid: "",
      portfolioData: [], 
    };
  }

  componentDidMount() {
    const uid = this.props.auth.user.id;
    this.setState({uid: uid});

    axios
      .get("http://localhost:4000/api/portfolioSheet/retrieve-portfolio-sheet/" + uid)
      .then(res => {this.setState({ portfolioData: res.data.portfolioSheet[0] });
      })
      .catch(error => {
        console.log(error);
      });
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
                            this.props.history.push('/portfolio');

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
    const columns = [
      {
        dataField: "id",
        text: "Ticker"
      },
      {
        dataField: "token",
        text: "Token"
      },
      {
        dataField: "priceBtc",
        text: "Price BTC"
      },
      {
        dataField: "priceUsd",
        text: "Price USD"
      },
      {
        dataField: "holdings",
        text: "Holdings"
      },
      {
        dataField: "totalBtc",
        text: "Total BTC"
      },
      {
        dataField: "totalUsd",
        text: "Total USD"
      },
      {
        dataField: "percentOfTotalPortfolio",
        text: "Percent of Total Portfolio"
      }
    ];
    return (
      <div>
        <button
          type="button"
          className="btn btn-outline-success btn-lg"
          onClick={this.refreshPrices}
        >
          Refresh Prices
        </button>
        <BootstrapTable
          keyField="_id"
          data={this.state.portfolioData}
          columns={columns}
          striped
        />
      </div>
    );
  }
}

Portfolio.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(Portfolio);
