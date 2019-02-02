// root reducer 

import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';


export default combineReducers({
    auth: authReducer, // now we have access to a global props.auth
    errors: errorReducer
});