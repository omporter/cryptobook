import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];
const chromeExtention = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()



/*
first parameter is root reducer
second parameter is initial global state
third parameter is middleware
*/
const store = createStore(
  rootReducer,
  initialState,
  compose(
        applyMiddleware(...middleware),
        chromeExtention
      )
);

export default store;
