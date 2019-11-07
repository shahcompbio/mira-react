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
  const [isShown, setIsShown] = useState(false);
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
    <Grid container direction="row">
      <Slide direction="left" in={isShown} mountOnEnter unmountOnExit>
        <Grid item>
          {loading || error
            ? null
            : data["dashboardClusters"]["metadata"].map((datum, index) => (
                <Select
                  key={`filter_${datum["id"]}`}
                  label={datum["name"]}
                  name={datum["id"]}
                  data={datum["values"]}
                  value={
                    chosenFilters[index] ? chosenFilters[index]["value"] : ""
                  }
                  onChange={newValue => {
                    const newValues = chosenFilters.map((value, valueIndex) =>
                      valueIndex === index
                        ? newValue !== ""
                          ? { key: datum["key"], value: newValue }
                          : null
                        : value
                    );
                    setFilters(newValues);
                  }}
                />
              ))}
        </Grid>
      </Slide>
      <Grid item style={{ paddingTop: "10px" }}>
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
