import React from "react";

import {Query} from "react-apollo";
import gql from "graphql-tag";
import {makeStyles} from "@material-ui/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import LabelSelect from "./LabelSelect";
import PatientSelect from "./PatientSelect";
import SampleSelectQuery from "./SampleSelect";

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
const InputLabelStyle = {padding: "15px"};
const DataSelect = ({patientID, sampleID, updateLabel}) => {
  console.log(InputLabelStyle);
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      {" "}
      <Paper className={classes.root}>
        <Grid item>
          <PatientSelect
            patientID={patientID}
            style={SelectionStyles}
            labelStyle={InputLabelStyle}
          />
        </Grid>{" "}
        <Grid item>
          <SampleSelectQuery
            patientID={patientID}
            sampleID={sampleID}
            style={SelectionStyles}
            labelStyle={InputLabelStyle}
          />
        </Grid>
        {!sampleID ? null : (
          <Query query={QUERY} variables={{patientID, sampleID}}>
            {({loading, error, data}) => {
              if (loading) return null;
              if (error) return null;
              return (
                <Grid item>
                  <LabelSelect
                    patientID={patientID}
                    sampleID={sampleID}
                    data={data.colorLabels}
                    onSelect={label => updateLabel(label)}
                  />
                </Grid>
              );
            }}
          </Query>
        )}{" "}
      </Paper>
    </Grid>
  );
};
export default DataSelect;
