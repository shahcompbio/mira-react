import React from "react";
import Header from "@bit/viz.spectrum.header";

import ExpansionPanel from "./components/ExpansionPanel";

import SelectionPanel from "./Select/SelectionPanel";
import Dashboard from "./Dashboard/Dashboard";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Grid from "@material-ui/core/Grid";
import { theme } from "./config/config.js";

import { useLocation, Switch, Route } from "react-router";
import { useDashboardType, useDashboardID } from "./utils/useDashboardInfo";

import CumulativeGenePlot from "./sandbox/CumulativeGenePlot";
import CorrelationPlot from "./sandbox/CorrelationPlot";
import GeneExpressionColors from "./sandbox/GeneExpressionColors";

// const ContentStyles = {
//     width: "70%",
//     display: "flex",
//     flexDirection: "row"
//   };

//   const useStyles = makeStyles({
//     summary: {
//       backgroundColor: "#ffffff"
//     },
//     title: {
//       color: "#8a939a",
//       fontSize: "25px",
//       fontWeight: "500"
//     }
//   });

const NAME = "Mira";
const testApp = () => (
  <Switch>
    <Route exact path="/cumulative-gene">
      <MuiThemeProvider theme={theme}>
        <CumulativeGenePlot />
      </MuiThemeProvider>
    </Route>
    <Route exact path="/correlation">
      <MuiThemeProvider theme={theme}>
        <CorrelationPlot />
      </MuiThemeProvider>
    </Route>
    <Route exact path="/gene-plot-colors">
      <MuiThemeProvider theme={theme}>
        <GeneExpressionColors />
      </MuiThemeProvider>
    </Route>
    <Route path={"/"}>
      <App />
    </Route>
  </Switch>
);

const HEADERS = ["Wiki", "Mira", "Sylph", "Hydra"].map(label => ({
  label,
  link: process.env[`${label.toUpperCase()}_URL`] || ""
}));

const App = () => {
  const location = useLocation();
  const [dashboardType, dashboardID] = [
    useDashboardType(location),
    useDashboardID(location)
  ];

  return (
    <MuiThemeProvider theme={theme}>
      <Header appName={NAME} headers={HEADERS} />
      <div style={{ flexGrow: 1 }}>
        <Grid
          container
          direction="column"
          width="95%"
          spacing={2}
          style={{
            padding: "40px 20px"
          }}
        >
          <Grid item>
            <ExpansionPanel title={"Dashboard Selection"}>
              <SelectionPanel />
            </ExpansionPanel>
          </Grid>
          {dashboardType && dashboardID ? (
            <Grid item>
              <ExpansionPanel
                title={`Dashboard : ${dashboardID.replace(/_/g, " ")}`}
              >
                <Dashboard />
              </ExpansionPanel>
            </Grid>
          ) : null}
        </Grid>
      </div>
    </MuiThemeProvider>
  );
};

export default testApp;
