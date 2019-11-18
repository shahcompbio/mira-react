import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import SampleTable from "./SampleTable";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";

const QUERY = gql`
  query($dashboardType: String!, $filters: [filterInput]!) {
    dashboardClusters(type: $dashboardType, filters: $filters) {
      dashboards {
        id
        samples {
          id
          name
          metadata {
            name
            value
          }
          stats {
            name
            value
          }
        }
      }
      metadata {
        name
      }
      stats
    }
  }
`;

const MetadataTable = ({ filters, onSelect }) => {
  const location = useLocation();
  const dashboardType = useDashboardType(location);
  const dashboardID = useDashboardID(location);

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, filters }
  });

  if (!data && (loading || error)) {
    return null;
  }

  const { dashboards, metadata, stats } = data["dashboardClusters"];

  const metadataHeaders = metadata.map(datum => datum["name"]);

  return (
    <div style={{ maxHeight: 400, overflow: "auto" }}>
      {dashboardType === "sample" ? (
        <SampleTable
          columns={{ metadata: metadataHeaders, stats }}
          rows={dashboards.map(dashboard => dashboard["samples"][0])}
          onClick={onSelect}
          selectedID={dashboardID}
        />
      ) : null}
    </div>
  );
};

export default MetadataTable;
