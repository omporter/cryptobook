import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux"; // react component which provides our application with the state, must wrap around everything.
import store from "./store";

import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Footer from "./components/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Portfolio from "./components/portfolio/Portfolio";
import OpenPositions from "./components/open/OpenPositions";
import ClosedPositions from "./components/completed/ClosedPositions";
import Tickers from "./components/tickers/Tickers";
import AddTrade from "./components/addTrade/AddTrade";
import Account from './components/account/account'
import Dashboard from './components/dashboard/dashboard'
// import TickersTableBuy from "./components/tickers/TickersTableBuy";
// import TickersTableSell from "./components/tickers/TickersTableSell";
// import TickersTableMatch from "./components/tickers/TickersTableMatch";

import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken); //step1: Set Auth Tokem Header Auth
  const decoded = jwt_decode(localStorage.jwtToken); // step2: decode token and get user info
  store.dispatch(setCurrentUser(decoded)); // step3: Set user and isAuthenticated

  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser()); //logout user automatically
    //TODO clear current profile
    window.location.href = "/login"; // Redirect to login
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/home" component={Landing} />
            <div className="container">
              <Route exact path="/account" component={Account} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/portfolio" component={Portfolio} />
              <Route exact path="/livetrades" component={OpenPositions} />
              <Route exact path="/closedtrades" component={ClosedPositions} />
              <Route exact path="/tickers" component={Tickers} />
              <Route exact path="/addTrade" component={AddTrade} />

              {/* <Route exact path='/tickers/Buy' component={TickersTableBuy} />
              <Route exact path='/tickers/Sell' component={TickersTableSell} />
              <Route exact path='/tickers/Match' component={TickersTableMatch} /> */}
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
