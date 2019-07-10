import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    marginTop: theme.spacing(2),
    width: "100%",
    overflowX: "scroll",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 600
  }
}));

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
    const makeStyle = () => useStyles();

    return (
      <Query query={QUERY}>
        {({ data, loading, error }) => {
          const cellAndMarkerGenesPair = data.cellAndMarkerGenesPair;
          if (loading) return <p> LOADING </p>;
          if (error) return <p> ERROR </p>;
          return (
            <div className={{ makeStyle }.root}>
              <Paper className={{ makeStyle }.paper}>
                <Table className={{ makeStyle }.table} size="small">
                  <TableBody>
                    {cellAndMarkerGenesPair.map(row => {
                      const markerGenes = row["markerGenes"];
                      return (
                        <CellTypeAndMarkerGenesRow
                          markerGenes={markerGenes}
                          handleClick={this.handleClick}
                          row={row}
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
      <TableCell align="center">{props.row.cellType}</TableCell>
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
        disabled={props.gene === " "}
      >
        {props.gene}
      </Button>
    </TableCell>
  );
};

export default CellAssignTable;
