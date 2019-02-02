import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";

const axios = require("axios");


class TickersTableSell extends Component {
  state = {
    tickersData: ["one", "two", "three"]
  };

  renderTable() {
    console.log('props.data', this.props.ticker);

      const uid = "5c11b37654640c12a041be09";
      const ticker = this.props.ticker;
      axios
        .get(
          "http://localhost:4000/api/tickersSheet/retrieve-tickers-sheet/" +
            ticker +
            "Sell/" +
            uid
        )
        .then(res => {
          const location = this.props.ticker + "Sell";
          this.setState({ tickersData: res.data[location] });
        })
        .catch(error => {
          console.log(error);
        });
  }

  noDataIndication() {
    console.log('no data indication');
  }

  render() {
    const columns = [
      {
        dataField: "sellId",
        text: "sellId"
      },
      {
        dataField: "matchId",
        text: "matchId"
      },
      {
        dataField: "completed",
        text: "completed"
      },
      {
        dataField: "amount",
        text: "amount"
      },
      {
        dataField: "priceBtc",
        text: "priceBtc"
      },
      {
        dataField: "priceUsd",
        text: "priceUsd"
      },
      {
        dataField: "totalBtc",
        text: "totalBtc"
      },
      {
        dataField: "totalUsd",
        text: "totalUsd"
      },
      {
        dataField: "date",
        text: "date"
      },
      {
        dataField: "exchange",
        text: "exchange"
      },
      {
        dataField: "notes",
        text: "notes"
      }
    ];
    return (
      <div>
        <div className="scroll-style">
          <BootstrapTable
            keyField="id"
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

export default TickersTableSell;
