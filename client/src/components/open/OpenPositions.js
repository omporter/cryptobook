import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

const axios = require("axios");


class OpenPositions extends Component {
  state = {
    openPositionsData: []
  };


  componentDidMount() {
    const uid = "5c1ad058ab6bf5413f08896e";
    axios.get("http://localhost:4000/api/liveTradesSheet/retrieve-live-trades-sheet/" + uid)
      .then(res => { this.setState(  { openPositionsData: res.data.liveTradesSheet })})
      .catch(error => {console.log({'error': error});});
}

  render() {
    const columns = [
      {
        dataField: "Id",
        text: "Ticker"
      },
      {
        dataField: "Amount",
        text: "Live Holdings"
      },
      {
        dataField: "LiveValueBtc",
        text: "Live Value BTC"
      },
      {
        dataField: "LiveValueUsd",
        text: "Live Value USD"
      },
      {
        dataField: "LivePriceBtc",
        text: "Live Price BTC"
      },
      {
        dataField: "LivePriceUsd",
        text: "Live Price USD"
      },
      {
        dataField: "unrealisedProfitLossBtc",
        text: "Unrealised Profit Loss BTC"
      },
      {
        dataField: "unrealisedProfitLossUsd",
        text: "Unrealised Profit Loss USD"
      },
      {
        dataField: "averageBuyPriceBtc",
        text: "Average Buy Price BTC"
      },
      {
        dataField: "averageBuyPriceUsd",
        text: "Average Buy Price USD"
      },
      {
        dataField: "totalCostBtc",
        text: "Total Cost BTC"
      },
      {
        dataField: "totalCostUsd",
        text: "Total Cost USD"
      },
      {
        dataField: "DateToday",
        text: "DateToday"
      },
      {
        dataField: "Most Recent Buy Date",
        text: "Most Recent Buy Date"
      },
      {
        dataField: "TradeDuration",
        text: "Trade Duration"
      },
      {
        dataField: "IsCapitalGain",
        text: "Is Capital Gain?"
      },
      {
        dataField: "TotalCommissionPaidBtc",
        text: "Total Commission Paid BTC"
      },
      {
        dataField: "TotalCommissionPaidUsd",
        text: "Total Commission Paid USD"
      },
      {
        dataField: "Notes",
        text: "Notes"
      }
    ];
    return (
      <div>
        <div className="scroll-style">
          <BootstrapTable keyField="ID" data={this.state.openPositionsData} columns={columns} striped />
        </div>
      </div>
    );
  }
}

export default OpenPositions;
