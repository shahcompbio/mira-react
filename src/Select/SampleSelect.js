import React from "react";
import { Dropdown } from "semantic-ui-react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { withRouter } from "react-router";

const QUERY = gql`
  query($patientID: String!) {
    samples(patientID: $patientID)
  }
`;
const SampleSelect = ({ patientID, sampleID, history, match }) => (
  <Query query={QUERY} variables={{ patientID }}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return null;
      const handleChange = (e, { value }) =>
        history.push("/" + patientID + "/" + value);

      const options = data.samples.map(sample => ({
        key: sample,
        text: sample,
        value: sample
      }));

      return (
        <Dropdown
          onChange={handleChange}
          placeholder="Samples"
          selection
          fluid
          options={options}
          defaultValue={sampleID}
        />
      );
    }}
  </Query>
);

export default withRouter(SampleSelect);
