import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Grid from "@material-ui/core/Grid";

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
            value={dashboardType === "" ? undefined : dashboardType}
            onChange={onDashboardTypeChange}
          />
        </Grid>
        {!dashboardType ? null : (
          <Grid item>
            <Filters chosenFilters={filters} setFilters={setFilters} />
          </Grid>
        )}
      </Grid>
      {!dashboardType ? null : (
        <Grid item>
          <MetadataTable filters={filters} onSelect={onDashboardIDChange} />
        </Grid>
      )}
    </Grid>
  );
};

export default SelectionPanel;
