import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Select from "./Select";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";

import Slide from "@material-ui/core/Slide";

import { useLocation } from "react-router";
import { useDashboardType } from "../utils/useDashboardInfo";

const QUERY = gql`
  query($dashboardType: String!, $filters: [filterInput]!) {
    dashboardClusters(type: $dashboardType, filters: $filters) {
      metadata {
        id
        key
        name
        values
      }
    }
  }
`;

const Filters = ({ chosenFilters, setFilters }) => {
  const [isShown, setIsShown] = useState(true);
  const location = useLocation();
  const dashboardType = useDashboardType(location);

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, filters: chosenFilters }
  });

  useEffect(() => {
    if (loading || error) {
      return;
    } else {
      setFilters(data["dashboardClusters"]["metadata"].map(_ => null));
    }
  }, [dashboardType, typeof data === "undefined"]);

  return (
    <Grid container direction="row" wrap="nowrap">
      <Slide direction="left" in={isShown} mountOnEnter unmountOnExit>
        <Grid container direction="row">
          {loading || error
            ? null
            : data["dashboardClusters"]["metadata"].map((datum, index) => (
                <Grid key={`filter_${datum["id"]}`} item>
                  <Select
                    label={datum["name"]}
                    data={datum["values"]}
                    value={
                      chosenFilters[index]
                        ? chosenFilters[index]["value"]
                        : chosenFilters[index]
                    }
                    onChange={newValue => {
                      const newValues = chosenFilters.map((value, valueIndex) =>
                        valueIndex === index
                          ? newValue
                            ? { key: datum["key"], value: newValue }
                            : null
                          : value
                      );
                      setFilters(newValues);
                    }}
                  />
                </Grid>
              ))}
        </Grid>
      </Slide>
      <Grid item>
        <Tooltip title="Filter">
          <IconButton
            aria-label="filter list"
            onClick={() => setIsShown(!isShown)}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default Filters;
