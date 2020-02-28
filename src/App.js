import React from "react";
import Header from "@bit/viz.spectrum.header";

import ExpansionPanel from "./components/ExpansionPanel";

import SelectionPanel from "./Select/SelectionPanel";
import Dashboard from "./Dashboard/Dashboard";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Grid from "@material-ui/core/Grid";
import { theme } from "./config/config.js";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "./utils/useDashboardInfo";

const NAME = "Mira";

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

export default App;
