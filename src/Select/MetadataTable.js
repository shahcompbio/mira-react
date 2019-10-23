import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

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
    }
  }
`;

const MetadataTable = ({ filters, onSelect }) => {
  const dashboardType = useDashboardType();
  const dashboardID = useDashboardID();

  const isRowSelected = id => id === dashboardID;

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, filters }
  });

  if (loading || error) {
    return null;
  }

  const dashboards = data["dashboardClusters"]["dashboards"];

  // TODO: Unhard-code headers
  const headers = ["Patient", "Surgery", "Site", "Sort"];
  const statsHeaders = [
    "Estimated Number of Cells",
    "Median Genes per Cell",
    "Median UMI Counts",
    "Mito20",
    "Number of Genes",
    "Number of Reads"
  ];

  // TODO: Unhardcode for samples
  return (
    <div style={{ maxHeight: 400, overflow: "auto" }}>
      <Table>
        <TableHeader columns={[...headers, ...statsHeaders]} />
        <TableBody>
          {dashboards.map(row => (
            <StatsRow
              columns={headers}
              stats={statsHeaders}
              data={row["samples"][0]}
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

const StatsRow = ({ columns, stats, data, onClick, selectedID }) => (
  <TableRow
    hover
    onClick={_ => onClick(data["id"])}
    selected={selectedID === data["id"]}
  >
    {[
      ...data["metadata"].map(column => (
        <TableCell key={column["id"]}>{column["value"]}</TableCell>
      )),
      ...data["stats"].map(column => (
        <TableCell key={column["id"]}>
          {formatInteger(column["value"])}
        </TableCell>
      ))
    ]}
  </TableRow>
);

export default MetadataTable;
