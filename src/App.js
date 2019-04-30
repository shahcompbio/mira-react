import React from "react";
import DataSelect from "./Select/DataSelect";
import { withRouter } from "react-router";
import ReDim from "./ReDim/ReDim";

const App = ({ location }) => {
  const [patientID, sampleID] = location.pathname.substr(1).split("/");
  console.log(patientID, sampleID);
  return (
    <div className="App" style={AppStyles}>
      <DataSelect patientID={patientID} sampleID={sampleID} />
      <ReDim patientID={patientID} sampleID={sampleID} />
    </div>
  );
};

const AppStyles = {
  width: "100%",
  height: "100%",
  display: "flex",
  padding: "25px",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexDirection: "column"
};

export default withRouter(App);
