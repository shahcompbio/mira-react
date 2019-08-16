import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Paper } from "@material-ui/core";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";

const QUERY = gql`
  query($patientID: String!) {
    qcTableValues(patientID: $patientID) {
      sampleID {
        name
        value
      }
      numCells {
        name
        value
      }
      mito20 {
        name
        value
      }
      numReads {
        name
        value
      }
      numGenes {
        name
        value
      }
      medianGenes {
        name
        value
      }
      meanReads {
        name
        value
      }
      validBarcodes {
        name
        value
      }
      seqSat {
        name
        value
      }
      medUMI {
        name
        value
      }
    }
  }
`;

const styles = {
  rowBehavior: {
    background: "white",
    "&:hover": {
      background: "lightBlue"
    }
  }
};

const QCTable = ({ patientID, label, classes, onClick, onReClick }) => (
  <Query
    query={QUERY}
    variables={{
      patientID
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return null;

      let properties = Object.getOwnPropertyNames(data.qcTableValues[0]);

      const index = properties.indexOf("__typename");

      if (index > -1) {
        properties.splice(index, 1);
      }

      return (
        <div>
          <h2>
            <center>QC Table</center>
          </h2>
          <Paper style={{ overflowX: "auto" }}>
            <Table size="medium" padding="default">
              <HeaderRow properties={properties} data={data.qcTableValues[0]} />
              <Body
                properties={properties}
                data={data.qcTableValues}
                selectedSample={label}
                onClick={onClick}
                onReClick={onReClick}
                classes={classes}
              />
            </Table>
          </Paper>
        </div>
      );
    }}
  </Query>
);

const HeaderRow = ({ properties, data }) => (
  <TableHead>
    <TableRow>
      {properties.map(element => {
        return element !== "sampleID" ? (
          <TableCell
            align="center"
            style={{ backgroundColor: "#E4E4E4" }}
            key={Math.random(0, 1000000)}
          >
            <h4>{data[element].name}</h4>
          </TableCell>
        ) : (
          <TableCell
            key={Math.random(0, 100000)}
            align="center"
            style={{
              position: "sticky",
              left: 0,
              color: "black",
              backgroundColor: "#E4E4E4",
              zIndex: 1
            }}
          >
            <h4>{data[element].name}</h4>
          </TableCell>
        );
      })}
      <TableCell
        key={Math.random(0, 100000)}
        align="center"
        style={{ backgroundColor: "#E4E4E4" }}
      >
        <h4>Summary</h4>
      </TableCell>
    </TableRow>
  </TableHead>
);

const Body = ({
  properties,
  data,
  selectedSample,
  classes,
  onClick,
  onReClick
}) => {
  const handleCellClick = (e, sampleName) => {
    return sampleName === selectedSample ? onReClick() : onClick(sampleName);
  };
  const reformatNumbers = item => {
    if (typeof item === "number" && item !== null) {
      return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return item;
  };

  return (
    <TableBody>
      {data.map(element => {
        return (
          <TableRow
            selected={selectedSample === element["sampleID"].value}
            className={classes.rowBehavior}
          >
            {properties.map(property => {
              return property !== "sampleID" ? (
                <TableCell
                  key={Math.random(0, 100000)}
                  align="center"
                  onClick={event =>
                    handleCellClick(event, element["sampleID"].value)
                  }
                >
                  {reformatNumbers(element[property].value)}
                </TableCell>
              ) : (
                <TableCell
                  key={Math.random(0, 100000)}
                  align="center"
                  onClick={event =>
                    handleCellClick(event, element["sampleID"].value)
                  }
                  style={{
                    position: "sticky",
                    left: 0,
                    color: "black",
                    backgroundColor: "#D4D4D4",
                    zIndex: 1
                  }}
                >
                  <b>{reformatNumbers(element[property].value)}</b>
                </TableCell>
              );
            })}
            <TableCell key={Math.random(0, 100000)} align="center">
              <a href="https://www.google.com"> Summary </a>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default withStyles(styles)(QCTable);
