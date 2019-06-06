import React, {Component} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Query} from "react-apollo";
import gql from "graphql-tag";

import {withRouter} from "react-router";

const QUERY = gql`
  query($patientID: String!) {
    samples(patientID: $patientID)
  }
`;

const SampleSelectQuery = ({
  patientID,
  sampleID,
  history,
  style,
  labelStyle
}) => {
  return (
    <Query query={QUERY} variables={{patientID}}>
      {({loading, error, data}) => {
        if (loading || error) return null;
        else {
          return (
            <SampleSelect
              style={style}
              history={history}
              patientID={patientID}
              data={data}
              sampleID={sampleID}
              labelStyle={labelStyle}
            />
          );
        }
      }}
    </Query>
  );
};

class SampleSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sample: ""
    };
  }
  handleChange = event => {
    this.props.history.push(
      "/" + this.props.patientID + "/" + event.target.value
    );
    this.setState({sample: event.target.value});
  };
  render() {
    const {patientID, sampleID, data, style, labelStyle} = this.props;
    return (
      <FormControl style={style}>
        {patientID && sampleID ? (
          <InputLabel as="h4" style={labelStyle}>
            Sample ID:
          </InputLabel>
        ) : patientID ? (
          <InputLabel as="h4" style={labelStyle}>
            Select a sample
          </InputLabel>
        ) : (
          <InputLabel as="h4" style={{color: "white"}}>
            {" "}
            .
          </InputLabel>
        )}
        <Select
          style={{width: 200}}
          onChange={this.handleChange}
          name={"sampleSelect"}
          value={sampleID ? sampleID : this.state.sample}
        >
          {data.samples.map((option, index) => (
            <MenuItem value={option} key={index + "-sampleSelect"}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withRouter(SampleSelectQuery);
