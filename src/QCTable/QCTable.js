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
      sample_id
      mito5
      mito10
      mito15
      mito20
      num_cells
      num_reads
      num_genes
      mean_reads
      median_genes
      percent_barcodes
      sequencing_sat
      median_umi
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
      selectedSample: this.props.sampleLabel
    };
  }
  handleClick(e) {
    this.props.onClick(e.currentTarget.value);
  }

  handleMouseEnter(e) {
    this.setState({ selectedSample: e.currentTarget.value });
  }

  handleMouseLeave(e) {
    this.setState({ selectedSample: this.props.sampleLabel });
  }

  getPropertyName(name) {
    return name === "sample_id"
      ? "Sample ID"
      : name === "mito5"
      ? "Mito 5"
      : name === "mito10"
      ? "Mito 10"
      : name === "mito15"
      ? "Mito 15"
      : name === "mito20"
      ? "Mito 20"
      : name === "num_cells"
      ? "Estimated Number of Cells"
      : name === "num_reads"
      ? "Number of Reads"
      : name === "num_genes"
      ? "Number of Genes"
      : name === "mean_reads"
      ? "Mean Reads per Cell"
      : name === "median_genes"
      ? "Median Genes per Cell"
      : name === "percent_barcodes"
      ? "Valid Barcodes"
      : name === "sequencing_sat"
      ? "Sequencing Saturation"
      : "Median UMI Counts per Cell";
  }

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
              <h3>
                <center>QC Table</center>
              </h3>
              <Paper style={{ overflowX: "auto" }}>
                <Table size="small" padding="default">
                  <TableHead>
                    <TableRow>
                      {properties.map(element => {
                        return element !== "sample_id" ? (
                          <TableCell align="center">
                            <h4>{this.getPropertyName(element)}</h4>
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
                            <h4>{this.getPropertyName(element)}</h4>
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        <h4>Summary</h4>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.qcTableValues.map(element => {
                      return (
                        <TableRow>
                          {properties.map(property => {
                            return property !== "sample_id" ? (
                              <TableCell
                                align="center"
                                style={{
                                  backgroundColor:
                                    element["sample_id"] ===
                                    this.state.selectedSample
                                      ? "lightBlue"
                                      : "white"
                                }}
                              >
                                {element[property]}
                              </TableCell>
                            ) : (
                              <TableCell
                                align="center"
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  color: "black",
                                  zIndex: 1,
                                  backgroundColor: "#D4D4D4"
                                }}
                              >
                                <Button
                                  value={element[property]}
                                  onClick={this.handleClick}
                                  onMouseEnter={this.handleMouseEnter}
                                  onMouseLeave={this.handleMouseLeave}
                                >
                                  <b>{element[property]}</b>
                                </Button>
                              </TableCell>
                            );
                          })}
                          <TableCell
                            align="center"
                            style={{
                              backgroundColor:
                                element["sample_id"] ===
                                this.state.selectedSample
                                  ? "lightBlue"
                                  : "white"
                            }}
                          >
                            <a href="https://www.google.com"> Summary </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default QCTable;
