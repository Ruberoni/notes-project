import React, { ReactElement } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

/**
 * Componentes
 */
import { TopBar, BottomBar } from "../components/AppBars";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";

export default function Routes(): ReactElement {
  return (
    <Router>
      <TopBar />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>
      <BottomBar h="4.2vh"/>
    </Router>
  );
}
