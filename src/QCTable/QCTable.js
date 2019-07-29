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

  reformatPropertyName = name =>
    name === "Mito_20" ? "QC (Mito<20)" : name.split("_").join(" ");

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
                    reformatPropertyName={this.reformatPropertyName}
                  />
                  <Body
                    properties={properties}
                    data={data}
                    handleMouseEnter={this.handleMouseEnter}
                    handleMouseLeave={this.handleMouseLeave}
                    selectedSample={this.props.label}
                    highlightedSample={this.state.highlightedSample}
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

const HeaderRow = ({ properties, reformatPropertyName }) => {
  return (
    <TableHead>
      <TableRow>
        {properties.map(element => {
          return element !== "Sample_ID" ? (
            <TableCell align="center" style={{ backgroundColor: "#E4E4E4" }}>
              <h4>{reformatPropertyName(element)}</h4>
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
              <h4>{reformatPropertyName(element)}</h4>
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
  highlightedSample,
  handleCellClick,
  classes
}) => {
  return (
    <TableBody>
      {data.qcTableValues.map(element => {
        return (
          <TableRow
            selected={selectedSample === element["Sample_ID"]}
            className={classes.rowBehavior}
          >
            {properties.map(property => {
              return property !== "Sample_ID" ? (
                <TableCell
                  align="center"
                  onClick={event =>
                    handleCellClick(event, element["Sample_ID"])
                  }
                  value={element["Sample_ID"]}
                >
                  {element[property]}
                </TableCell>
              ) : (
                <TableCell
                  align="center"
                  value={element["Sample_ID"]}
                  onClick={event =>
                    handleCellClick(event, element["Sample_ID"])
                  }
                  style={{
                    position: "sticky",
                    left: 0,
                    color: "black",
                    backgroundColor: "#D4D4D4",
                    zIndex: 1
                  }}
                >
                  <b>{element[property]}</b>
                </TableCell>
              );
            })}
            <TableCell align="center" /*style={highlightStyle(element)}*/>
              <a href="https://www.google.com"> Summary </a>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default withStyles(styles)(QCTable);
