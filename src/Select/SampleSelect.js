import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { withRouter } from "react-router";

const QUERY = gql`
  query($patientID: String!) {
    samples(patientID: $patientID)
  }
`;

const SampleSelectQuery = ({
  patientID,
  history,
  style,
  labelStyle,
  label,
  changeSample
}) => {
  return (
    <Query query={QUERY} variables={{ patientID }}>
      {({ loading, error, data }) => {
        if (loading || error) return null;
        else {
          return (
            <SampleSelect
              style={style}
              history={history}
              patientID={patientID}
              data={data}
              labelStyle={labelStyle}
              label={label}
              changeSample={changeSample}
            />
          );
        }
      }}
    </Query>
  );
};

class SampleSelect extends Component {
  handleChange = event => {
    this.props.history.push(
      "/" + this.props.patientID + "/" + event.target.value
    );
    this.props.changeSample(event.target.value);
  };
  render() {
    const { data, style, label } = this.props;
    return (
      <FormControl style={style}>
        <Select
          style={{ width: 200 }}
          onChange={this.handleChange}
          name={"sampleSelect"}
          value={label}
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
