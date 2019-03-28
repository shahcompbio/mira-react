import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

const QUERY = gql`
  query {
    foo {
      id
      name
      age
    }
  }
`;

const App = ({ data }) => {
  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }

  console.log(data.foo);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default graphql(QUERY)(App);
