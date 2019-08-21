import React, { useRef, useState, useEffect } from "react";
import Header from "@bit/viz.spectrum.header";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./config/config.js";
import PatientSelect from "./Select/PatientSelect";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/styles";
import LabelSelectQuery from "./Select/LabelSelectQuery";
import QCTable from "./QCTable/QCTable";
import Dashboard from "./ReDim/Dashboard.js";
import { IconButton } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const title = "scRNA Dashboard";
const description =
  "An interactive visualization for single cell RNA (scRNA) QC data, as generated by the scRNA-seq pipeline (https://github.com/shahcompbio/SCRNApipeline).";

const ContentStyles = {
  width: "70%",
  display: "flex",
  flexDirection: "row"
};

const useStyles = makeStyles({
  summary: {
    backgroundColor: "whiteSmoke"
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
    patientID.length > 0 && samplePanelState
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

  const handleClick = sampleLabel => {
    setSampleLabel(sampleLabel);
  };

  const handleReClick = e => {
    setSampleLabel(undefined);
  };

  const handleDemoButtonClick = e => {
    const url = "https://youtu.be/ctMJMiQADiM";
    window.open(url, "_blank");
  };

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
          <ExpansionPanelComponent
            handleChange={handlePatientChange}
            shouldExpand={patientID.length === 0 ? false : patientPanelState}
            widthRef={widthRef}
            handleDemoButtonClick={handleDemoButtonClick}
            patientID={patientID}
            screenWidth={screenWidth}
            setSampleLabel={label => setSampleLabel(label)}
            SelectionStyles={SelectionStyles}
            InputLabelStyle={InputLabelStyle}
            name={"Patient ID : "}
            marginTop={18}
            styles={{
              width: screenWidth * 0.99,
              paddingLeft: screenWidth / 50,
              paddingBottom: 30,
              paddingTop: 30
            }}
          >
            {!patientID ? null : (
              <QCTable
                label={sampleLabel}
                onClick={handleClick}
                patientID={patientID}
                onReClick={handleReClick}
              />
            )}
          </ExpansionPanelComponent>
        </Grid>
        <Grid item>
          <ExpansionPanelComponent
            handleChange={handleSampleChange}
            shouldExpand={patientID.length === 0 ? false : samplePanelState}
            patientID={patientID}
            widthRef={widthRef}
            SelectionStyles={SelectionStyles}
            InputLabelStyle={InputLabelStyle}
            sampleLabel={sampleLabel}
            setSampleLabel={label => setSampleLabel(label)}
            name={"Dashboard : "}
            marginTop={18}
            styles={{
              width: screenWidth * 0.99,
              paddingLeft: screenWidth / 50,
              paddingBottom: 30,
              paddingTop: 30
            }}
          >
            {!sampleLabel ? (
              !patientID ? null : (
                <div>
                  <LabelSelectQuery
                    updateLabel={label => setLabel(label)}
                    patientID={patientID}
                    sampleID={sampleLabel}
                    dashboard={1}
                    labelTitle={
                      label === null || label === undefined
                        ? "Cell Type"
                        : label.title
                    }
                  />
                  <Dashboard
                    screenHeight={screenHeight}
                    screenWidth={screenWidth}
                    patientID={patientID}
                    dashboard={true}
                    label={label}
                    onClick={label => setLabel(label)}
                  />
                </div>
              )
            ) : (
              <div>
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
                <div style={ContentStyles}>
                  <Dashboard
                    screenHeight={screenHeight}
                    screenWidth={screenWidth}
                    patientID={patientID}
                    dashboard={false}
                    sampleID={sampleLabel}
                    label={label}
                    onClick={label => setLabel(label)}
                  />
                </div>
              </div>
            )}
          </ExpansionPanelComponent>
        </Grid>
        {/* <Grid item>
          <ExpansionPanelComponent widthRef={widthRef} name={"DNA Data : "}>
            {"Content coming soon..."}
          </ExpansionPanelComponent>
        </Grid> */}
      </Grid>
    </MuiThemeProvider>
  );
};

const ExpansionPanelComponent = ({
  children,
  handleChange,
  shouldExpand,
  widthRef,
  name,
  handleDemoButtonClick,
  marginTop,
  patientID,
  SelectionStyles,
  InputLabelStyle,
  sampleLabel,
  styles,
  screenWidth,
  setSampleLabel
}) => (
  <ExpansionPanel onChange={handleChange} expanded={shouldExpand}>
    <ExpansionPanelSummary
      className={useStyles().summary}
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <div
        style={{
          color: "#797979",
          marginTop: marginTop,
          marginBottom: name === "Dashboard : " ? 15 : 0,
          paddingLeft: "0px"
        }}
      >
        <h2> {name + " "} </h2>
      </div>

      {name === "Patient ID : " ? (
        <div>
          <PatientSelect
            patientID={patientID}
            style={SelectionStyles}
            labelStyle={InputLabelStyle}
            setSampleLabel={setSampleLabel}
          />

          <IconButton
            onClick={handleDemoButtonClick}
            style={{ marginTop: 10, marginLeft: screenWidth * 0.679 }}
          >
            <InfoIcon />
          </IconButton>
        </div>
      ) : name === "Dashboard : " ? (
        <div
          style={{
            color: "#999999",
            marginTop: marginTop,
            paddingLeft: "10px"
          }}
        >
          <h2>
            {" "}
            {patientID.length > 0 && sampleLabel === undefined
              ? patientID
              : sampleLabel !== undefined
              ? sampleLabel
              : " "}{" "}
          </h2>
        </div>
      ) : name === "DNA Data : " ? null : null}
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
        <Grid item style={styles}>
          {children}
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default withRouter(App);
