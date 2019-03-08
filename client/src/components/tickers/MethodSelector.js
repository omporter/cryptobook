import React, { Component } from "react";
import { Link } from "react-router-dom";

class MethodSelector extends Component {
  render() {
    return (
      <div>
          <Link
            type="button"
            className="btn btn-outline-success btn-lg"
            to={{pathname: "/tickers/buy"}}
          >
            Buy Trades
          </Link>
          <Link
            type="button"
            className="btn btn-outline-danger btn-lg"
            to="/tickers/sell"
          >
            Sell Trades
          </Link>
          {/* <Link
            type="button"
            className="btn btn-outline-info btn-lg"
            to="/tickers/match"
          >
            Match
          </Link> */}
          <br /> <br />
      </div>
    );
  }
}

export default MethodSelector;
