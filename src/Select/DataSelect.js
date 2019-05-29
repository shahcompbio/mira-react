import React from "react";
import {Segment} from "semantic-ui-react";

import PatientSelect from "./PatientSelect";
import SampleSelect from "./SampleSelect";

const DataSelect = ({patientID, sampleID}) => (
  <Segment stacked className="leftMenu" style={SelectionWrapperStyles}>
    <PatientSelect patientID={patientID} style={SelectionStyles} />
    <SampleSelect
      patientID={patientID}
      sampleID={sampleID}
      style={SelectionStyles}
    />
  </Segment>
);
const SelectionWrapperStyles = {
  background: "#f3f6fb",
  width: "75vw",
  height: "100%",
  display: "flex",
  padding: "15px",
  marginTop: "35px",
  marginLeft: "25px",
  flexDirection: "row"
};
const SelectionStyles = {
  zIndex: 200,
  padding: "15px",
  width: "100%"
};
export default DataSelect;
