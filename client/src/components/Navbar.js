import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";

class Navbar extends Component {

  onLogoutClick (e) {
    e.preventDefault();
    this.props.logoutUser();
  }



  render() {
    // const { isAuthenticated, user } = this.props.auth;
    const { isAuthenticated } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            href="account"
            className="nav-link"
          >
            {" "}
            Account
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            {" "}
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    const authBar = (
      <div className="collapse navbar-collapse" id="mobile-nav">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/portfolio">
            {" "}
            Portfolio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/livetrades">
            {" "}
            Live Trades
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/closedtrades">
            {" "}
            Closed Trades
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/tickers">
            {" "}
            Tickers
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addTrade">
            {" "}
            Add Trade
          </Link>
        </li>
      </ul>
    </div>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/home">
            Cryptobook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

            {isAuthenticated ? authBar : null} 

            {isAuthenticated ? authLinks : guestLinks} 
            {/* where isAuthenticated comes from our state.auth */}

          </div>
      </nav>
    );
  }
}

Navbar.proptypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
