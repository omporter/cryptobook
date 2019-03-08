import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import TickersSelector from "./TickersSelector";
import MethodSelector from "./MethodSelector";
import TickersTableBuy from "./TickersTableBuy";
import TickersTableSell from "./TickersTableSell";
import TickersTableMatch from "./TickersTableMatch";
import axios from "axios";

class Tickers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "BTC",
      uid: '',
      dataExists: false
    };
    this.onTickerChange = this.onTickerChange.bind(this);
    this.refMethod = this.refMethod.bind(this);
    this.child = React.createRef();
  }

  componentDidMount() {
    axios.get('http://localhost:4000/api/users/retrieve-user/' + this.props.auth.user.id)
    .then(res => {
      console.log('tickers res is', res)
      if(res.data.liveTradesSheet) {
        console.log('exists');
        this.setState({dataExists: true});
      } else {
        console.log('not exists');
        this.setState({dataExists: false});
      }
    })
    .catch(err => console.log(err));
  }

  onTickerChange(data) {
    this.setState({ ticker: data });
  }

  onTickerSelectorSubmit() {
    const uid = this.props.auth.user.id;
    this.refMethod(uid);
  }

  refMethod(uid) {
    this.child.current.renderTable(uid);
  }

  render() {
    const dataDoesNotExist = (
      <div>
        <div>
          Please click Add Trade to get started 
        </div>
      </div>
    )

    const dataDoesExist = (
      <div>
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
    )

    return (
      <Router>
        <div>
        <MethodSelector />
          <TickersSelector
            ticker={this.state.ticker}
            changeParent={this.onTickerChange.bind(this)}
            tickerSelectorSubmit={this.onTickerSelectorSubmit.bind(this)}
          />
          {this.state.dataExists ? dataDoesExist : dataDoesNotExist}
        </div>
      </Router>
    );
  }
}

// export default Tickers;


Tickers.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(Tickers);
