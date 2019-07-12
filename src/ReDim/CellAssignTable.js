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

  render() {
    return (
      <Query query={QUERY}>
        {({ data, loading, error }) => {
          const cellAndMarkerGenesPair = data.cellAndMarkerGenesPair;
          if (loading) return <p> LOADING </p>;
          if (error) return <p> ERROR </p>;
          return (
            <div>
              <Paper style={{ overflowX: "auto" }}>
                <Table size="small" padding="default">
                  <TableBody>
                    {cellAndMarkerGenesPair.map(row => {
                      const markerGenes = row["markerGenes"];
                      return (
                        <CellTypeAndMarkerGenesRow
                          markerGenes={markerGenes}
                          handleClick={this.handleClick}
                          row={row}
                          data={cellAndMarkerGenesPair}
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
  return (
    <TableRow key={props.row.cellType}>
      <TableCell
        align="center"
        style={{
          position: "sticky",
          left: 0,
          background: "#ccc",
          color: "black",
          zIndex: 1
        }}
      >
        <h5>{props.row.cellType}</h5>
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
