import React, { useState } from "react";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { withRouter } from "react-router";

const QUERY = gql`
  query {
    patients
  }
`;

const PatientSelect = ({ patientID, data, style, history, setSampleLabel }) => {
  const [patient, setPatient] = useState(0);

  const handleChange = event => {
    history.push("/" + event.target.value);
    setPatient(event.target.value);
    setSampleLabel(undefined);
  };

  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }

  return (
    <FormControl style={style}>
      <Select
        style={{ width: 200 }}
        onChange={handleChange}
        name="patientSelect"
        value={patientID ? patientID : patient}
      >
        {data.patients.map((option, index) => (
          <MenuItem value={option} key={index + "-patientSelect"}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default graphql(QUERY)(withRouter(PatientSelect));
