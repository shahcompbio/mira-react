import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import Select from "./Select";

import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";

const QUERY = gql`
  query {
    dashboards {
      type
      dashboards {
        id
      }
    }
  }
`;

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

const SelectionPanel = ({ classes }) => {
  let history = useHistory();
  const [dashboardType, setDashboardType] = useState(useDashboardType());
  const [dashboardID, setDashboardID] = useState(useDashboardID());

  const onDashboardTypeChange = type => {
    history.push(`/${type}`);
    setDashboardType(type);
  };

  const onDashboardIDChange = id => {
    history.push(`/${dashboardType}/${id}`);
    setDashboardID(id);
  };

  const { data, loading, error } = useQuery(QUERY);

  if (loading || error) {
    return null;
  }

  const { dashboards } = data;

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Typography variant="h4" className={classes.title}>
        Dashboard Selection
      </Typography>
      <Paper className={classes.paper} elevation={1}>
        <Select
          label={"Dashboard Type"}
          name={"dashboard-type"}
          data={dashboards.map(dashboard => dashboard["type"])}
          value={dashboardType}
          onChange={onDashboardTypeChange}
        />
        {dashboardType === "" ? null : (
          <Select
            label={"Dashboard"}
            name={"dashboard-id"}
            data={dashboards
              .filter(dashboard => dashboard["type"] === dashboardType)[0]
              ["dashboards"].map(dashboard => dashboard["id"])}
            value={dashboardID}
            onChange={onDashboardIDChange}
          />
        )}
      </Paper>
    </Grid>
  );
};
export default withStyles(styles)(SelectionPanel);
