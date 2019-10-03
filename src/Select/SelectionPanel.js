import React from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PatientSelect from "./PatientSelect";
import SampleSelect from "./SampleSelect";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  title: {
    color: "#8a939a",
    fontSize: "25px",
    fontWeight: "500",
    paddingBottom: "20px"
  },
  paper: {
    width: "100%",
    padding: "10px",
    marginBottom: "30px",
    boxShadow:
      "0px 1px 13px 0px rgba(174, 181, 177, 0.18), -3px 1px 14px 2px rgba(129, 133, 136, 0.17), 0px 1px 8px -1px rgba(78, 79, 80, 0.23);"
  }
};
const SelectionPanel = ({
  handlePatientClick,
  handleSampleClick,
  setSampleLabel,
  name,
  marginTop,
  patientID,
  sampleLabel,
  classes
}) => {
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Typography variant="h4" className={classes.title}>
        Sample Selection
      </Typography>
      <Paper className={classes.paper} elevation={1}>
        <PatientSelect
          setSampleLabel={setSampleLabel}
          onChange={handlePatientClick}
          patientID={patientID}
        />
        {patientID && (
          <SampleSelect
            setSampleLabel={setSampleLabel}
            onChange={handleSampleClick}
            patientID={patientID}
            labelStyle={{ padding: "19px" }}
            sampleLabel={sampleLabel}
          />
        )}
      </Paper>
    </Grid>
  );
};
export default withStyles(styles)(SelectionPanel);
