import React, { useEffect, useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Select from "./Select";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";

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
  const dashboardType = useDashboardType();

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, filters: chosenFilters }
  });

  useEffect(() => {
    if (loading || error) {
      return;
    } else {
      setFilters(metadata.map(_ => null));
    }
  }, [dashboardType, typeof data === "undefined"]);

  if (loading || error) {
    return null;
  }

  const metadata = data["dashboardClusters"]["metadata"];

  return (
    <Grid container direction="row">
      <Grid item>
        {isShown
          ? metadata.map((datum, index) => (
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
                      ? newValue
                        ? { key: datum["key"], value: newValue }
                        : null
                      : value
                  );
                  setFilters(newValues);
                }}
              />
            ))
          : null}
      </Grid>
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