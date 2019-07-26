import React, { useRef, useState, useEffect } from "react";
import Header from "@bit/viz.spectrum.header";
import Grid from "@material-ui/core/Grid";
import Content from "./ReDim/Content";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./config/config.js";
import SampleSelectQuery from "./Select/SampleSelect";
import PatientSelect from "./Select/PatientSelect";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/styles";
import LabelSelectQuery from "./Select/LabelSelectQuery";
import QCTable from "./QCTable/QCTable";

const title = "scRNA Dashboard";
const description =
  "An interactive visualization for single cell RNA (scRNA) QC data, as generated by the scRNA-seq pipeline (https://github.com/shahcompbio/SCRNApipeline)";

const ContentStyles = {
  width: "70%",
  display: "flex",
  flexDirection: "row"
};

const useStyles = makeStyles({
  summary: {
    backgroundImage:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUMAAACcCAMAAADS8jl7AAAABlBMVEXr6+vr6+rffHx5AAAAUElEQVR4nO3MoQEAAAjDsO3/pzF8gEEkpq4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8Fo3va8GxkIABBQrUsIAAAAASUVORK5CYII=")'
  }
});

const App = ({ location }) => {
  const [patientID] = location.pathname.substr(1).split("/");
  const [screenWidth, setWidth] = useState(0);
  const [screenHeight, setHeight] = useState(0);
  const [label, setLabel] = useState({
    id: "A1BG",
    type: "gene",
    title: "A1BG"
  });
  const [sampleLabel, setSampleLabel] = useState();
  const [patientPanelState, setPatientPanelState] = useState(true);
  const [samplePanelState, setSamplePanelState] = useState(true);

  const widthRef = useRef(0);

  const updateDimensions = () => {
    setWidth(widthRef.current.clientWidth);
    setHeight(500);
  };

  const handlePatientChange = e => {
    patientID.length > 0 && patientPanelState
      ? setPatientPanelState(false)
      : setPatientPanelState(true);
  };

  const handleSampleChange = e => {
    sampleLabel !== undefined && samplePanelState
      ? setSamplePanelState(false)
      : setSamplePanelState(true);
  };

  window.addEventListener("resize", updateDimensions);

  useEffect(() => {
    updateDimensions();
  });

  const InputLabelStyle = { padding: "19px" };

  const SelectionStyles = {
    width: 225,
    padding: "15px"
  };

  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <Header name={title} description={description} />
      <Grid
        container
        direction="column"
        width="95%"
        spacing={2}
        style={{
          padding: "60px 20px"
        }}
      >
        <Grid item>
          <ExpansionPanel
            onChange={handlePatientChange}
            expanded={patientID.length === 0 ? false : patientPanelState}
          >
            <ExpansionPanelSummary
              className={classes.summary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div
                style={{
                  color: "#797979",
                  marginTop: "18px",
                  paddingLeft: "0px"
                }}
              >
                <h2>Patient ID: </h2>
              </div>

              <PatientSelect
                patientID={patientID}
                style={SelectionStyles}
                labelStyle={InputLabelStyle}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                item
                style={{
                  width: screenWidth * 0.97,
                  paddingLeft: screenWidth / 50,
                  paddingBottom: 30,
                  paddingTop: 30
                }}
              >
                {!patientID ? null : (
                  <QCTable
                    label={sampleLabel}
                    onClick={sampleLabel => setSampleLabel(sampleLabel)}
                    patientID={patientID}
                  />
                )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item>
          <ExpansionPanel
            onChange={handleSampleChange}
            expanded={sampleLabel === undefined ? false : samplePanelState}
          >
            <ExpansionPanelSummary
              className={classes.summary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div
                style={{
                  color: "#797979",
                  marginTop: "18px",
                  paddingLeft: "0px"
                }}
              >
                <h2>Sample ID: </h2>
              </div>

              <SampleSelectQuery
                patientID={patientID}
                sampleID={sampleLabel}
                style={SelectionStyles}
                labelStyle={InputLabelStyle}
                label={sampleLabel}
                changeSample={sampleLabel => setSampleLabel(sampleLabel)}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
                ref={widthRef}
                style={{
                  flexWrap: "nowrap",
                  whiteSpace: "nowrap",
                  padding: "0px 0px"
                }}
              >
                <Grid item>
                  {!sampleLabel ? null : (
                    <LabelSelectQuery
                      updateLabel={label => setLabel(label)}
                      patientID={patientID}
                      sampleID={sampleLabel}
                      labelTitle={
                        label === null || label === undefined
                          ? "Cell Type"
                          : label.title
                      }
                    />
                  )}
                </Grid>
                <div style={ContentStyles}>
                  <Content
                    screenHeight={screenHeight}
                    screenWidth={screenWidth}
                    patientID={patientID}
                    sampleID={sampleLabel}
                    label={label}
                    onClick={label => setLabel(label)}
                  />
                </div>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary
              className={classes.summary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div style={{ color: "#797979" }}>
                <h2>DNA Data</h2>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              Content Coming Soon...
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

export default withRouter(App);
