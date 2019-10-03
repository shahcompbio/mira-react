import React, { useState, useEffect } from "react";
import Input from "@material-ui/core/Input";
import { withStyles } from "@material-ui/core/styles";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import { withRouter } from "react-router";
const styles = theme => ({
  form: { paddingRight: "25px", display: "inline-flex", flexDirection: "row" },
  selectLabel: {
    fontSize: "20px",
    padding: "5px"
  },
  select: { paddingRight: "25px" },
  input: { width: "200px" }
});

const QUERY = gql`
  query($patientID: String!) {
    qcTableValues(patientID: $patientID) {
      sampleID {
        name
        value
      }
    }
  }
`;

const SampleSelect = ({
  location,
  patientID,
  data,
  history,
  setSampleLabel,
  classes,
  sampleLabel
}) => {
  const [sample, setSample] = useState(0);
  const [expression, setExpression] = useState(0);
  const [statusChoices, setStatusChoices] = useState(["CD45N", "CD45P"]);

  const handleExpressionChange = event => {
    if (sample) {
      history.push("/" + patientID + "/" + event.target.value + "_" + sample);
      setSampleLabel(event.target.value + "_" + sample);
    }
    setExpression(event.target.value);
  };

  const handleSampleChange = event => {
    if (expression) {
      history.push(
        "/" + patientID + "/" + expression + "_" + event.target.value
      );
      setSampleLabel(expression + "_" + event.target.value);
    }
    setSample(event.target.value);
  };

  useEffect(() => {
    if (data.qcTableValues) {
      const chosenSamples = data.qcTableValues
        .map(samples => samples.sampleID.value)
        .filter(samples => samples.indexOf(sample) !== -1);
      const choicesLeft = chosenSamples.map(samples => samples.substring(0, 5));
      setStatusChoices(choicesLeft);
    }
  }, [sample]);
  useEffect(() => {
    if (sampleLabel) {
      setSample(sampleLabel.substr(6, sampleLabel.length));
      setExpression(sampleLabel.substr(0, 5));
    } else {
      setSample(0);
      setExpression(0);
    }
  }, [sampleLabel]);

  if (data && data.loading) {
    return null;
  }

  if (data && data.error) {
    return null;
  }
  var uniqueSampleNames = [
    ...new Set(
      data.qcTableValues.map(samples =>
        samples.sampleID.value.substring(6, samples.sampleID.value.length)
      )
    )
  ];
  return (
    <FormControl className={classes.form}>
      <TextField
        select
        label="Sample"
        variant="outlined"
        margin="normal"
        inputProps={{ name: "sample-name", id: "sample-select" }}
        input={
          <Input
            name="sample-name"
            id="sample-select"
            className={classes.input}
          />
        }
        className={classes.select}
        onChange={handleSampleChange}
        name="sampleSelect"
        value={sample}
      >
        {uniqueSampleNames.map((option, index) => (
          <MenuItem value={option} key={index + "-sampleSelect"}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      {sample ? (
        <FormControl className={classes.form}>
          <TextField
            select
            label="Variant"
            variant="outlined"
            margin="normal"
            inputProps={{
              name: "samplevarient-name",
              id: "samplevarient-select"
            }}
            input={
              <Input
                name="samplevarient-name"
                id="samplevarient-select"
                className={classes.input}
              />
            }
            className={classes.select}
            onChange={handleExpressionChange}
            name="sampleSelect"
            value={expression}
          >
            {statusChoices.map((option, index) => (
              <MenuItem value={option} key={index + "-expressionSelect"}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      ) : (
        ""
      )}
    </FormControl>
  );
};
export default graphql(QUERY)(withRouter(withStyles(styles)(SampleSelect)));
