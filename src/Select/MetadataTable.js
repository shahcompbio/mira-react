import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { withStyles } from "@material-ui/core/styles";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";
import formatInteger from "../utils/formatInteger";

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

const styles = theme => ({
  metadataCell: {
    color: "black",
    backgroundColor: "rgb(245, 246, 247)",
    zIndex: 1,
    fontWeight: "bold",
    textAlign: "center"
  }
});

const MetadataTable = ({ classes, filters, onSelect }) => {
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
  const statsHeaders = stats;

  return (
    <div style={{ maxHeight: 400, overflow: "auto" }}>
      <Table>
        <TableHeader columns={[...metadataHeaders, ...statsHeaders]} />
        <TableBody>
          {dashboards.map(row => (
            <DashboardRow
              key={`dashboardRow_${row["id"]}`}
              classes={classes}
              metadata={metadataHeaders}
              stats={statsHeaders}
              data={row["samples"]}
              onClick={onSelect}
              selectedID={dashboardID}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const TableHeader = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell
          align="center"
          key={column}
          style={{
            backgroundColor: "#fff",
            position: "sticky",
            top: 0
          }}
        >
          {column}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const DashboardRow = ({
  metadata,
  stats,
  classes,
  data,
  onClick,
  selectedID
}) => {
  // Right now just draws on sample level. Later we'll need to accommodate Patient level data.

  const samples = data.map(datum => collapseMetadataAndStats(datum));

  if (samples.length === 1) {
    return (
      <SampleRow
        classes={classes}
        metadata={metadata}
        stats={stats}
        data={samples[0]}
        onClick={onClick}
        selectedID={selectedID}
      />
    );
  } else return null;
};

const SampleRow = ({ metadata, stats, classes, data, onClick, selectedID }) => (
  <TableRow
    hover
    onClick={_ => onClick(data["id"])}
    selected={selectedID === data["id"]}
  >
    {[
      ...metadata.map(column => (
        <TableCell
          className={classes.metadataCell}
          key={`${data["id"]}_metadata_${column}`}
        >
          {data["metadata"][column]}
        </TableCell>
      )),
      ...stats.map(column => (
        <TableCell align="center" key={`${data["id"]}_stats_${column}`}>
          {formatInteger(data["stats"][column])}
        </TableCell>
      ))
    ]}
  </TableRow>
);

const collapseMetadataAndStats = sample => ({
  ...sample,
  metadata: sample["metadata"].reduce(
    (mapping, datum) => ({
      ...mapping,
      [datum["name"]]: datum["value"]
    }),
    {}
  ),
  stats: sample["stats"].reduce(
    (mapping, datum) => ({
      ...mapping,
      [datum["name"]]: datum["value"]
    }),
    {}
  )
});
export default withStyles(styles)(MetadataTable);
