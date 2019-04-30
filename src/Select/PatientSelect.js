import React from "react";
import { Dropdown } from "semantic-ui-react";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withRouter } from "react-router";

const QUERY = gql`
  query {
    patients
  }
`;
const PatientSelect = ({ patientID, history, data }) => {
  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }

  const handleChange = (e, { value }) => history.push("/" + value);

  const options = data.patients.map(patient => ({
    key: patient,
    text: patient,
    value: patient
  }));

  return (
    <Dropdown
      onChange={handleChange}
      placeholder="Patients"
      selection
      fluid
      options={options}
      defaultValue={patientID}
    />
  );
};

export default graphql(QUERY)(withRouter(PatientSelect));
