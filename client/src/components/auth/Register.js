import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';

// a container is a react component that works with redux 


class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      errors: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount () { // cannot go to '/login' or '/register' if logged in already 
  if (this.props.auth.isAuthenticated) {
    this.props.history.push('/dashboard');
  }
}

  componentWillReceiveProps (nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    this.props.registerUser(payload, this.props.history);
    // note our second parameter (this.props.history) is also required to access this.props.history from a redux action
  };



  render() {
    // const {errors} = this.state;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col">
              <label>User Name</label>
              <input
                className="form-control"
                name="name"
                placeholder="User Name..."
                value={this.state.name}
                onChange={this.onChange}
              />{" "}
              <br />
            </div>
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
    )
  }
}


// this is good practice is react to register all our proptypes. 
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// this mapStateToProps allows us to call this.state.auth to access data from our global state 
// note this comes from the root reducer 
const mapStateToProps = (state) => ({
  auth: state.auth, 
  errors: state.errors
});

export default connect(mapStateToProps, {registerUser})(withRouter(Register));
// note we have to add withRouter to change a route within a redux action 


// export default Register;