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
      portfolioData: []
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
