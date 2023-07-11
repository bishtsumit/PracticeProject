import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddWallet from "./component/wallet";
import GetTransactions from "./component/transactions";
import "./App.css";

export default function FirstApp() {
  return (
    <>
      <Router>
        <Route exact path="/" component={AddWallet} />
        <Route exact path="/transactions" component={GetTransactions} />
      </Router>
    </>
  )
}
