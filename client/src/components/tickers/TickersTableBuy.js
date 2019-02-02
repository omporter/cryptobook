import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

const axios = require("axios");

class TickersTableBuy extends Component {
  state = {
    tickersData: []
  };

  renderTable() {
      const uid = "5c1ad058ab6bf5413f08896e";
      axios
        .get(
          "http://localhost:4000/api/tickersSheet/retrieve-tickers-sheet/" +
            uid
        )
        .then(res => {
          const location = this.props.ticker + "Buy";
          this.setState({ tickersData: res.data[location] });
        })
        .catch(error => {
          console.log({'error': error});
        });
  }

  noDataIndication() {
    console.log('no data indication');
  }

  render() {
    const columns = [
      {
        dataField: "amount",
        text: "Amount"
      },
      {
        dataField: "priceBtc",
        text: "Price (BTC)"
      },
      {
        dataField: "priceUsd",
        text: "Price (USD)"
      },
      {
        dataField: "totalBtc",
        text: "Total (BTC)"
      },
      {
        dataField: "totalUsd",
        text: "Total (USD)"
      },
      {
        dataField: "date",
        text: "Date"
      },
      {
        dataField: "exchange",
        text: "Exchange"
      },
      {
        dataField: "notes",
        text: "Notes"
      }, 
      {
        dataField: "buyId",
        text: "Buy ID"
      },
      {
        dataField: "tradeId",
        text: "Trade ID"
      },
      {
        dataField: "complete",
        text: "Completed"
      }
    ];
    return (
      <div>
        <div className="scroll-style">
          <BootstrapTable
            keyField="buyId"
            data={this.state.tickersData}
            columns={columns}
            striped
            noDataIndication={this.noDataIndication}
            bootstrap4={true}
            loading={true}
          />
        </div>
      </div>
    );
  }
}

export default TickersTableBuy;
