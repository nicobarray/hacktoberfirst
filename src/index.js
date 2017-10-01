import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path={"/:player1/:player2"} component={App} />
      <Route component={App} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
