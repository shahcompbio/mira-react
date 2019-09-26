import React, { useState } from "react";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";

import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
const styles = theme => ({
  form: { paddingRight: "25px" },
  selectLabel: {
    fontSize: "20px",
    padding: "5px"
  },
  select: {},
  input: { width: "200px" }
});

const QUERY = gql`
  query {
    patients
  }
`;

const PatientSelect = ({
  location,
  patientID,
  data,
  history,
  setSampleLabel,
  classes
}) => {
  const [patient, setPatient] = useState(
    location.pathname.substr(1).split("/")
  );

  const handleChange = event => {
    history.push("/" + event.target.value);
    setPatient(event.target.value);
    setSampleLabel(undefined);
  };

  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }

  return (
    <FormControl className={classes.form}>
      <TextField
        select
        label="Patient ID"
        variant="outlined"
        margin="normal"
        inputProps={{ name: "patient", id: "patient-select" }}
        input={
          <Input name="patient" id="patient-select" className={classes.input} />
        }
        className={classes.select}
        onChange={handleChange}
        name="patientSelect"
        value={patientID ? patientID : patient}
      >
        {data.patients.map((option, index) => (
          <MenuItem value={option} key={index + "-patientSelect"}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default graphql(QUERY)(withRouter(withStyles(styles)(PatientSelect)));
