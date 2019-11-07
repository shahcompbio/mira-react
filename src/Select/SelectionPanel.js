import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import Select from "./Select";
import Filters from "./Filters";
import MetadataTable from "./MetadataTable";

import { useLocation } from "react-router";
import { useDashboardType } from "../utils/useDashboardInfo";

const QUERY = gql`
  query {
    dashboardTypes
  }
`;

const styles = {
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
  const location = useLocation();

  const [dashboardType] = [useDashboardType(location)];
  const [filters, setFilters] = useState([]);

  const onDashboardTypeChange = type => {
    const typeConvert = type ? type : "";
    history.push(`/${typeConvert}`);
  };

  const onDashboardIDChange = id => {
    history.push(`/${dashboardType}/${id}`);
  };

  const { data, loading, error } = useQuery(QUERY);

  if (loading || error) {
    return null;
  }

  const { dashboardTypes } = data;
  return (
    <Grid container direction="column">
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Select
            label={"Dashboard Type"}
            name={"dashboard-type"}
            data={dashboardTypes}
            value={dashboardType}
            onChange={onDashboardTypeChange}
          />
        </Grid>
        {dashboardType === "" ? null : (
          <Grid item>
            <Filters chosenFilters={filters} setFilters={setFilters} />
          </Grid>
        )}
      </Grid>
      <Grid item>
        <MetadataTable filters={filters} onSelect={onDashboardIDChange} />
      </Grid>
    </Grid>
  );
};

export default SelectionPanel;
