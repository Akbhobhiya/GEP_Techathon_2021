import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
// import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'font-awesome/css/font-awesome.min.css';
import "@pathofdev/react-tag-input/build/index.css";

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from'redux-devtools-extension'
import { BrowserRouter } from 'react-router-dom'

// import rootReducer from './store/reducers/rootReducer'

const initState = {};
const middleware = [thunk];

// const store = createStore(rootReducer, initState, composeWithDevTools(
//   applyMiddleware(...middleware)
// ));

ReactDOM.render(
  <BrowserRouter>
     <App /> 
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

