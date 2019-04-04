import React from "react";
import { Dropdown } from "semantic-ui-react";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { withRouter } from "react-router";

const QUERY = gql`
  query {
    samples
  }
`;
const SampleSelect = ({ sampleID, history, data }) => {
  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }

  const handleChange = (e, { value }) => history.push("/" + value);

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
};

export default graphql(QUERY)(withRouter(SampleSelect));
