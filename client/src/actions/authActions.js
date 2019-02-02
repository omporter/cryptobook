import axios from "axios";
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';



// Register user

// export const registerUser = (userData) => {
//     return {
//         type: TEST_DISPATCH,
//         payload: userData
//     }
// }

export const registerUser = (userData, history) => dispatch => {
    console.log('calling axios now...');
    let url = 'http://localhost:4000/api/userNew/register';
    axios.post(url, userData)
    .then(res => {
        console.log('res', res)
        const newUserData = {
            uid: res.data._id,
            user: res.data.name
        }
        url = 'http://localhost:4000/api/users/register'
        axios.post(url, newUserData)
        .then( res2 => console.log('res2', res2))
        .catch( err2 => console.log('err2', err2));
        history.push('/home')
    })
    .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const loginUser = userData => dispatch => {
    // this route gives us the token for use in all protected routes 
    let url = 'http://localhost:4000/api/userNew/login';
    axios.post(url, userData)
    .then(res => {
        const {token} = res.data;
        localStorage.setItem('jwtToken', token); // can only save strings to local storage, our jwt token is a string
        setAuthToken(token); // set token to header
        const decoded = jwt_decode(token);// decode token to get user data
        dispatch(setCurrentUser(decoded));// set current user

    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    })
};

//Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};

//Log user out 
export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken'); // step 1: Remove token from local storage 
    setAuthToken(false);// step2: remove auth header for every axios request 
    dispatch(setCurrentUser({})); // step3: set current user to empty object {}, which will set isAuthenticated to false
};
