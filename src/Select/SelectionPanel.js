import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import { IconButton, Grid, Tooltip } from "@material-ui/core";

import Filters from "./Filters";
import MetadataTable from "./MetadataTable";

import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useLocation } from "react-router";
import { useDashboardType } from "../utils/useDashboardInfo";

const SelectionPanel = ({ classes, setIsExpanded, isExpanded }) => {
  let history = useHistory();
  const location = useLocation();

  const [dashboardType] = [useDashboardType(location)];
  const [filters, setFilters] = useState([]);

  const onDashboardIDChange = id => {
    history.push(`/${dashboardType}/${id}`);
  };

  return (
    <Grid container direction="column">
      <Grid container direction="row" justify="flex-end">
        {!dashboardType ? null : (
          <Grid item>
            <Filters chosenFilters={filters} setFilters={setFilters} />
          </Grid>
        )}
        <Grid item>
          <Tooltip title={isExpanded ? "Expand" : "Close"}>
            <IconButton onClick={setIsExpanded}>
              {isExpanded ? (
                <ExpandMoreIcon fontSize="large" />
              ) : (
                <KeyboardArrowUpIcon fontSize="large" />
              )}
            </IconButton>
          </Tooltip>
        </Grid>
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
