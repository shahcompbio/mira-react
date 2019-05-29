import React, {Component} from "react";
import {Segment, Divider} from "semantic-ui-react";
import {Query} from "react-apollo";
import gql from "graphql-tag";

import LabelSelect from "./LabelSelect";
import Content from "./Content";

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
    this.setState(() => ({label}));
  };

  render() {
    const {patientID, sampleID} = this.props;

    return !sampleID ? null : (
      <Query query={QUERY} variables={{patientID, sampleID}}>
        {({loading, error, data}) => {
          if (loading) return null;
          if (error) return null;

          return (
            <div style={DivStyles}>
              <Segment vertical>
                <Content
                  patientID={patientID}
                  sampleID={sampleID}
                  label={this.state.label}
                />
              </Segment>{" "}
              <Segment
                vertical
                style={{width: "25%", marginTop: "50px", marginLeft: "-20vw"}}
              >
                <LabelSelect
                  data={data.colorLabels}
                  onSelect={this.onLabelSelect}
                />
                <Divider style={{margin: "25px"}} />
              </Segment>
            </div>
          );
        }}
      </Query>
    );
  }
}

const DivStyles = {
  width: "70%",
  display: "flex",
  flexDirection: "row",

  backgroundColor: ""
};

export default ReDim;
