import React from "react";
import SampleSelect from "./SampleSelect";
import { withRouter } from "react-router";
import ReDimPlot from "./ReDim/ReDimPlot";

const App = ({ location }) => {
  const sampleID = location.pathname.substr(1);
  return (
    <div className="App">
      <SampleSelect sampleID={sampleID} />
      <ReDimPlot sampleID={sampleID} />
    </div>
  );
};

export default withRouter(App);
