import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const QUERY = gql`
  query {
    cellAndMarkerGenesPair {
      cellType
      markerGenes
    }
  }
`;

class CellAssignTable extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const nameToObject = name => ({ id: name, title: name, type: "gene" });
    let id = e.currentTarget.value;
    this.props.onClick(nameToObject(id));
  }

  sortData(data) {
    let dataArray = data.cellAndMarkerGenesPair;
    let sortedCellTypes = dataArray.map(row => row.cellType).sort();
    return sortedCellTypes.map(cell =>
      dataArray.filter(element => element.cellType === cell)
    );
  }

  render() {
    return (
      <Query query={QUERY}>
        {({ data, loading, error }) => {
          if (loading) return null;
          if (error) return null;
          let cellAndMarkerGenes = this.sortData(data);
          return (
            <div>
              <h3>
                <center>CellAssign : Cell Types and Marker Genes</center>
              </h3>
              <Paper style={{ overflowX: "auto" }}>
                <Table size="small" padding="default">
                  <TableBody>
                    {cellAndMarkerGenes.map(row => {
                      const markerGenes = row[0]["markerGenes"];
                      return (
                        <CellTypeAndMarkerGenesRow
                          markerGenes={markerGenes}
                          handleClick={this.handleClick}
                          row={row}
                          colorScale={this.props.colorScale}
                        />
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

const CellTypeAndMarkerGenesRow = props => {
  const reformatName = name => name.split(" ").join(".");

  const getColor = name =>
    props.colorScale(reformatName(name)) !== undefined
      ? props.colorScale(reformatName(name))
      : "#ccc";

  const createStyles = {
    position: "sticky",
    left: 0,
    color: "black",
    background: getColor(props.row[0].cellType),
    zIndex: 1
  };

  return (
    <TableRow key={props.row[0].cellType}>
      <TableCell align="center" style={createStyles}>
        <h5>{props.row[0].cellType}</h5>
      </TableCell>
      {props.markerGenes.map(gene => {
        return <GeneCell gene={gene} handleClick={props.handleClick} />;
      })}
    </TableRow>
  );
};

const GeneCell = props => {
  return (
    <TableCell align="center">
      <Button
        color="outline-primary"
        value={props.gene}
        onClick={props.handleClick}
      >
        {props.gene}
      </Button>
    </TableCell>
  );
};

export default CellAssignTable;
