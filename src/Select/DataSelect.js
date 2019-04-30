import React from "react";

import PatientSelect from "./PatientSelect";
import SampleSelect from "./SampleSelect";

const DataSelect = ({ patientID, sampleID }) => (
  <div>
    <PatientSelect patientID={patientID} />
    {!patientID ? (
      ""
    ) : (
      <SampleSelect patientID={patientID} sampleID={sampleID} />
    )}
  </div>
);

export default DataSelect;
