import React, { Component } from "react";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import classnames from 'classnames';
import {loginUser} from '../../actions/authActions';


class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount () { // cannot go to '/login' or '/register' if logged in already 
  if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated) {
      this.props.history.push('/home');
    }
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors});
    }
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const payload = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(payload);
        // const url = "http://localhost:4000/api/userNew/login";
    // axios
    //   .post(url, payload)
    //   .then(res => console.log("res", res))
    //   .catch(err => console.log("err", err));
  };

  render() {
    // const {errors} = this.state; 



    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col">
              <label> Email </label>
              <input
                className="form-control"
                name="email"
                placeholder="Password..."
                value={this.state.email}
                onChange={this.onChange}
              />
            </div>
            <div className="col">
              <label> Password </label>
              <input
                className="form-control"
                name="password"
                placeholder="Password..."
                value={this.state.password}
                onChange={this.onChange}
              />
            </div>
          </div>
          <button className="btn btn-dark" type="submit">
            Submit
          </button>
          <div className="form-bottom" />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(Login);
