import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Grid from "@material-ui/core/Grid";
import LabelSelect from "./LabelSelect";

const QUERY = gql`
  query($patientID: String!, $sampleID: String) {
    colorLabels(patientID: $patientID, sampleID: $sampleID) {
      title
      labels {
        title
        type
      }
    }
  }
`;

const LabelSelectQuery = ({ patientID, sampleID, updateLabel, labelTitle }) => (
  <Query query={QUERY} variables={{ patientID, sampleID }}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return null;
      return (
        <Grid
          item
          style={{ padding: "0px 0px 25px 25px", display: "inline-flex" }}
        >
          <LabelSelect
            patientID={patientID}
            sampleID={sampleID}
            data={data.colorLabels}
            onSelect={label => updateLabel(label)}
            labelTitle={{ label: labelTitle, value: labelTitle }}
          />
        </Grid>
      );
    }}
  </Query>
);
export default LabelSelectQuery;
