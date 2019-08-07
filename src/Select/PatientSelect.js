import React, { Component } from "react";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { withRouter } from "react-router";

const QUERY = gql`
  query {
    patients
  }
`;

class PatientSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient: ""
    };
  }

  handleChange = event => {
    this.props.history.push("/" + event.target.value);
    this.setState({ patient: event.target.value });
    this.props.setSampleLabel(undefined);
  };
  render() {
    const { data, patientID, history, style } = this.props;
    if (data && data.loading) {
      return null;
    }

    if (data && data.error) {
      return null;
    }
    return (
      <FormControl style={style}>
        <Select
          style={{ width: 200 }}
          onChange={this.handleChange}
          name="patientSelect"
          value={patientID ? patientID : this.state.patient}
        >
          {data.patients.map((option, index) => (
            <MenuItem value={option} key={index + "-patientSelect"}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default graphql(QUERY)(withRouter(PatientSelect));
