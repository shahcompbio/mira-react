import React from "react";

import { makeStyles } from "@material-ui/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import LabelSelectQuery from "./LabelSelectQuery";
import PatientSelect from "./PatientSelect";
import SampleSelectQuery from "./SampleSelect";

const useStyles = makeStyles({
  root: {
    display: "inline-block",
    height: "70vh",
    padding: "15px",
    marginTop: "35px",
    marginLeft: "25px"
  }
});

const SelectionStyles = {
  width: 225,
  padding: "15px"
};
const InputLabelStyle = { padding: "15px" };
const DataSelect = ({ patientID, sampleID, updateLabel, label }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Paper className={classes.root}>
        <Grid item>
          <PatientSelect
            patientID={patientID}
            style={SelectionStyles}
            labelStyle={InputLabelStyle}
          />
        </Grid>
        <Grid item>
          <SampleSelectQuery
            patientID={patientID}
            sampleID={sampleID}
            style={SelectionStyles}
            labelStyle={InputLabelStyle}
          />
        </Grid>
        {!sampleID ? null : (
          <LabelSelectQuery
            updateLabel={updateLabel}
            patientID={patientID}
            sampleID={sampleID}
            labelTitle={
              label === null || label === undefined ? "Cell Type" : label.title
            }
          />
        )}
      </Paper>
    </Grid>
  );
};
export default DataSelect;
