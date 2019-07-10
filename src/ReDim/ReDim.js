import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import LabelSelect from "./LabelSelect";
import Content from "./Content";
import CellAssignTable from "./CellAssignTable";

const QUERY = gql`
  query($patientID: String!, $sampleID: String!) {
    colorLabels(patientID: $patientID, sampleID: $sampleID) {
      id
      title
      labels {
        id
        title
        type
      }
    }
  }
`;

class ReDim extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: null
    };
  }

  onLabelSelect = label => {
    this.setState(() => ({ label }));
  };

  render() {
    const { patientID, sampleID } = this.props;

    return !sampleID ? null : (
      <Query query={QUERY} variables={{ patientID, sampleID }}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;

          return (
            <div style={DivStyles}>
              <LabelSelect
                data={data.colorLabels}
                onSelect={this.onLabelSelect}
              />
              <Content
                patientID={patientID}
                sampleID={sampleID}
                label={this.state.label}
              />
              <CellAssignTable onClick={this.onLabelSelect} />
            </div>
          );
        }}
      </Query>
    );
  }
}

const DivStyles = {
  margin: "25px",

  width: "70%",
  display: "flex",
  flexDirection: "column"
};

export default ReDim;
