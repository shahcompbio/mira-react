import React from "react";
import {Dropdown, Container, Header} from "semantic-ui-react";

import {Query} from "react-apollo";
import gql from "graphql-tag";

import {withRouter} from "react-router";

const QUERY = gql`
  query($patientID: String!) {
    samples(patientID: $patientID)
  }
`;
const SampleSelect = ({patientID, sampleID, history, match, style}) => (
  <Query query={QUERY} variables={{patientID}}>
    {({loading, error, data}) => {
      if (loading) return null;
      if (error) return null;
      const handleChange = (e, {value}) =>
        history.push("/" + patientID + "/" + value);

      const options = data.samples.map(sample => ({
        key: sample,
        text: sample,
        value: sample
      }));
      return (
        <Container>
          {patientID && sampleID ? (
            <Header as="h4">Sample ID:</Header>
          ) : patientID ? (
            <Header as="h4">Select a sample</Header>
          ) : (
            <Header as="h4" style={{color: "white"}}>
              {" "}
              .
            </Header>
          )}
          <Dropdown
            onChange={handleChange}
            placeholder="Samples"
            selection
            floating
            scrolling
            options={options}
            defaultValue={sampleID}
            style={style}
          />
        </Container>
      );
    }}
  </Query>
);

export default withRouter(SampleSelect);
