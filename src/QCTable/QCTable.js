import React, { Component } from "react";
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

class QCTable extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = {
      highlightedSample: undefined
    };
  }

  handleClick = e => {
    this.props.onClick(e.currentTarget.value);
  };

  handleMouseEnter = e =>
    this.setState({ highlightedSample: e.currentTarget.value });

  handleMouseLeave = e => this.setState({ highlightedSample: undefined });

  handleCellClick = (e, sampleName) => {
    this.setState({ highlightedSample: sampleName });
    this.props.onClick(sampleName);
  };

  render() {
    const { patientID } = this.props;

    return (
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
                  <HeaderRow
                    properties={properties}
                    data={data.qcTableValues[0]}
                  />
                  <Body
                    properties={properties}
                    data={data.qcTableValues}
                    handleMouseEnter={this.handleMouseEnter}
                    handleMouseLeave={this.handleMouseLeave}
                    selectedSample={this.props.label}
                    handleCellClick={this.handleCellClick}
                    classes={this.props.classes}
                  />
                </Table>
              </Paper>
            </div>
          );
        }}
      </Query>
    );
  }
}

const HeaderRow = ({ properties, data }) => {
  return (
    <TableHead>
      <TableRow>
        {properties.map(element => {
          return element !== "sampleID" ? (
            <TableCell align="center" style={{ backgroundColor: "#E4E4E4" }}>
              <h4>{data[element].name}</h4>
            </TableCell>
          ) : (
            <TableCell
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
        <TableCell align="center" style={{ backgroundColor: "#E4E4E4" }}>
          <h4>Summary</h4>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const Body = ({
  properties,
  data,
  selectedSample,
  handleCellClick,
  classes
}) => {
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
                  align="center"
                  onClick={event =>
                    handleCellClick(event, element["sampleID"].value)
                  }
                >
                  {reformatNumbers(element[property].value)}
                </TableCell>
              ) : (
                <TableCell
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
            <TableCell align="center">
              <a href="https://www.google.com"> Summary </a>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default withStyles(styles)(QCTable);
