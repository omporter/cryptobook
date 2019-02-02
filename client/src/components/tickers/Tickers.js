import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import TickersSelector from "./TickersSelector";
import MethodSelector from "./MethodSelector";
import TickersTableBuy from "./TickersTableBuy";
import TickersTableSell from "./TickersTableSell";
import TickersTableMatch from "./TickersTableMatch";

class Tickers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "BTC"
    };
    this.onTickerChange = this.onTickerChange.bind(this);
    this.refMethod = this.refMethod.bind(this);
    this.child = React.createRef();
  }

  onTickerChange(data) {
    this.setState({ ticker: data });
  }

  onTickerSelectorSubmit() {
    this.refMethod();
  }

  refMethod() {
    this.child.current.renderTable();
  }

  render() {
    return (
      <Router>
        <div>
          <TickersSelector
            ticker={this.state.ticker}
            changeParent={this.onTickerChange.bind(this)}
            tickerSelectorSubmit={this.onTickerSelectorSubmit.bind(this)}
          />
          <MethodSelector />
          <Route
            exact
            path="/tickers"
            render={() => (
              <TickersTableBuy ticker={this.state.ticker} ref={this.child} />
            )}
          />
          <Route
            path="/tickers/buy"
            render={() => <TickersTableBuy ticker={this.state.ticker} ref={this.child} />}
          />
          <Route
            path="/tickers/sell"
            render={() => <TickersTableSell ticker={this.state.ticker} ref={this.child} />}
          />
          <Route
            path="/tickers/match"
            render={() => <TickersTableMatch ticker={this.state.ticker} ref={this.child} />}
          />
        </div>
      </Router>
    );
  }
}

export default Tickers;
