import React, { ReactElement } from "react";
import { Switch, Route } from "react-router-dom";

/**
 * Componentes
 */
import { TopBar, BottomBar } from "../components/AppBars";
import App from "../App";
import Test from "../components/Test";
import Login from "../components/Login";
import Register from "../components/Register";

export default function Routes(): ReactElement {
  return (
    <>
      <TopBar />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/">
          {/* <Test /> */}
          <App />
        </Route>
        <Route path="/test">
          <Test />
        </Route>
      </Switch>
      <BottomBar />
    </>
  );
}
