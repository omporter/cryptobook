import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const axios = require("axios");


class OpenPositions extends Component {
  state = {
    openPositionsData: [],
    uid: ''
  };


  componentDidMount() {
    const uid = this.props.auth.user.id;
    this.setState({uid: uid})
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

// export default OpenPositions;


OpenPositions.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(OpenPositions);
