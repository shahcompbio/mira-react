import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const QUERY = gql`
  query($patientID: String!) {
    qcTableValues(patientID: $patientID) {
      Sample_ID
      Estimated_Number_of_Cells
      Mito_20
      Number_of_Reads
      Number_of_Genes
      Mean_Reads_per_Cell
      Median_Genes_per_Cell
      Valid_Barcodes
      Sequencing_Saturation
      Median_UMI_Counts_per_Cell
    }
  }
`;

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

  reformatPropertyName = name =>
    name === "Mito_20" ? "QC (Mito<20)" : name.split("_").join(" ");

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
                <Table size="small" padding="default">
                  <HeaderRow
                    properties={properties}
                    reformatPropertyName={this.reformatPropertyName}
                  />
                  <Body
                    properties={properties}
                    data={data}
                    handleClick={this.handleClick}
                    handleMouseEnter={this.handleMouseEnter}
                    handleMouseLeave={this.handleMouseLeave}
                    selectedSample={this.props.label}
                    highlightedSample={this.state.highlightedSample}
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

const HeaderRow = ({ properties, reformatPropertyName }) => {
  return (
    <TableHead>
      <TableRow>
        {properties.map(element => {
          return element !== "Sample_ID" ? (
            <TableCell align="center">
              <h4>{reformatPropertyName(element)}</h4>
            </TableCell>
          ) : (
            <TableCell
              align="center"
              style={{
                position: "sticky",
                left: 0,
                color: "black",
                backgroundColor: "white",
                zIndex: 1
              }}
            >
              <h4>{reformatPropertyName(element)}</h4>
            </TableCell>
          );
        })}
        <TableCell align="center">
          <h4>Summary</h4>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const Body = ({
  properties,
  data,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
  selectedSample,
  highlightedSample
}) => {
  const highlightStyle = element => {
    return {
      backgroundColor:
        highlightedSample === undefined
          ? element["Sample_ID"] === selectedSample
            ? "lightBlue"
            : "white"
          : element["Sample_ID"] === highlightedSample
          ? "lightBlue"
          : "white"
    };
  };

  return (
    <TableBody>
      {data.qcTableValues.map(element => {
        return (
          <TableRow>
            {properties.map(property => {
              return property !== "Sample_ID" ? (
                <TableCell align="center" style={highlightStyle(element)}>
                  {element[property]}
                </TableCell>
              ) : (
                <TableCell
                  align="center"
                  style={{
                    position: "sticky",
                    left: 0,
                    color: "black",
                    backgroundColor: "#D4D4D4",
                    zIndex: 1
                  }}
                >
                  <Button
                    value={element[property]}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <b>{element[property]}</b>
                  </Button>
                </TableCell>
              );
            })}
            <TableCell align="center" style={highlightStyle(element)}>
              <a href="https://www.google.com"> Summary </a>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default QCTable;
