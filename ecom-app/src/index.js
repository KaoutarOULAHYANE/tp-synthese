import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import KeycloakService from "./SERVICES/keycloakService";
// import StoreService from "../src/KEYCLOAK/storeService";
// import { createStore, applyMiddleware } from "redux";
// import { Provider } from "react-redux";
// import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";
// import allReducers from './REDUCERS';

// let store = createStore(
//   allReducers,);
//   composeWithDevTools(applyMiddleware(thunk)),
// );

const renderApp = () => ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

KeycloakService.initKeycloak(renderApp);
