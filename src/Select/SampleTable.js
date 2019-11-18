import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { makeStyles } from "@material-ui/core/styles";

import formatInteger from "../utils/formatInteger";

const useStyles = makeStyles({
  metadataCell: {
    color: "black",
    backgroundColor: "rgb(245, 246, 247)",
    zIndex: 1,
    fontWeight: "bold",
    textAlign: "center"
  }
});

const SampleTable = ({ columns, rows, onClick, selectedID }) => {
  const { metadata, stats } = columns;

  const classes = useStyles();
  return (
    <Table>
      <TableHeader columns={[...metadata, ...stats]} />
      <TableBody>
        {rows.map(row => (
          <SampleRow
            key={`sampleRow_${row["id"]}`}
            classes={classes}
            metadata={metadata}
            stats={stats}
            data={collapseMetadataAndStats(row)}
            onClick={onClick}
            selectedID={selectedID}
          />
        ))}
      </TableBody>
    </Table>
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

export default SampleTable;
