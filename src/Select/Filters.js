import React, { useEffect } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Select from "./Select";

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

  return metadata.map((datum, index) => (
    <Select
      label={datum["name"]}
      name={datum["id"]}
      data={datum["values"]}
      value={chosenFilters[index] ? chosenFilters[index]["value"] : ""}
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
  ));
};

export default Filters;
