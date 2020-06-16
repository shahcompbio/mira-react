import React, { useState } from "react";
import ExpansionPanel from "../components/ExpansionPanel";
import Header from "../Select/Header";
import Dashboard from "./Dashboard";

import { Grid } from "@material-ui/core";

const DashboardWrapper = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <Header
        title="Dashboard"
        id="dashboardRoot"
        isExpanded={isExpanded}
        setIsExpanded={() => setIsExpanded(!isExpanded)}
      />
      <div style={{ marginTop: -30, marginLeft: 10, marginRight: 10 }}>
        <ExpansionPanel
          isExpanded={isExpanded}
          setIsExpanded={() => setIsExpanded(!isExpanded)}
          displayFlag={true}
          title={""}
        >
          <Grid container direction="column">
            <Grid item>
              <Dashboard />
            </Grid>
          </Grid>
        </ExpansionPanel>
      </div>
    </div>
  );
};
export default DashboardWrapper;
