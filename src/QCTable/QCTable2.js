import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const QUERY = gql`
  query($dashboardType: String!, $dashboardID: String!) {
    sampleStatsHeaders(type: $dashboardType, dashboardID: $dashboardID)
    sampleStats(type: $dashboardType, dashboardID: $dashboardID) {
      patientID
      sampleID
      site
      surgery
      sort
      values {
        name
        value
      }
    }
  }
`;

const QCTable = ({ dashboardType, dashboardID }) => {
  const { data, error, loading } = useQuery(QUERY, {
    variables: { dashboardType, dashboardID }
  });

  if (error || loading) {
    return null;
  }
  const headers = data["sampleStatsHeaders"];
  const stats = formatTableData(data["sampleStats"]);
  console.log(stats);
  return (
    <Table stickyHeader>
      <TableHeader columns={headers} />
      <TableBody>
        {stats.map(row => (
          <StatsRow key={row["sampleID"]} columns={headers} data={row} />
        ))}
      </TableBody>
    </Table>
  );
};

const formatTableData = data => {
  const formatDatum = datum => {
    const { values, ...stats } = datum;

    return values.reduce(
      (oldStats, value) => ({ ...oldStats, [value["name"]]: value["value"] }),
      stats
    );
  };

  return data.map(datum => formatDatum(datum));
};
const TableHeader = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell key={column}>{column}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const StatsRow = ({ columns, data }) => (
  <TableRow key={data["sampleID"]}>
    {columns.map(column => (
      <TableCell key={`${data["sampleID"]}_${column}}`}>
        {data[column]}
      </TableCell>
    ))}
  </TableRow>
);
export default QCTable;
