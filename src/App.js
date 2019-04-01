import React from "react";
import SampleSelect from "./SampleSelect";
import { withRouter } from "react-router";
import { BrowserRouter } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <div className="App">
      <SampleSelect />
    </div>
  </BrowserRouter>
);

export default App;
