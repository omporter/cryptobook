import React, { Component } from "react";

class TickersSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "BTC"
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // get array of buy tickers from db
    // const tickersArray = ["BTC", "XMR", "NEO"];
  }

  onChange = e => {
    this.setState({ ticker: e.target.value });
    this.props.changeParent(e.target.value);
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.tickerSelectorSubmit();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input placeholder="ticker" onChange={this.onChange} />
          <button>{this.state.ticker}</button>
          <br />
          <br />
        </form>

        {/* <div className="dropdown show">
          <Link
            className="btn btn-secondary dropdown-toggle"
            to="/tickers"
            role="button"
            id="dropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Select Coin
          </Link>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <Link className="dropdown-item" to="/tickers/btc">
              BTC
            </Link>
            <Link className="dropdown-item" to="/tickers/eth">
              ETH
            </Link>
            <Link className="dropdown-item" to="/tickers/ltc">
              LTC
            </Link>
          </div>
        </div> */}
      </div>
    );
  }
}

export default TickersSelector;
