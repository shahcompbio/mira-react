import React from "react";
import {Dropdown, Container, Header} from "semantic-ui-react";

import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {withRouter} from "react-router";

const QUERY = gql`
  query {
    patients
  }
`;
const PatientSelect = ({patientID, history, data, style}) => {
  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }

  const handleChange = (e, {value}) => history.push("/" + value);

  const options = data.patients.map(patient => ({
    key: patient,
    text: patient,
    value: patient
  }));

  return (
    <Container style={{"margin-right": "150px !important"}}>
      {patientID ? (
        <Header as="h4">Patient ID:</Header>
      ) : (
        <Header as="h4">Select a patient:</Header>
      )}
      <Dropdown
        onChange={handleChange}
        selection
        floating
        scrolling
        options={options}
        defaultValue={patientID}
        style={style}
      />
    </Container>
  );
};

export default graphql(QUERY)(withRouter(PatientSelect));
