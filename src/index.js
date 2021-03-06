import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./semiotic.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./apollo.js";

require("typeface-roboto");

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter basename={process.env.REACT_APP_BASENAME || "."}>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
