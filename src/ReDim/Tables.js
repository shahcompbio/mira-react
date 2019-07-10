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
    markers {
      cellType
      markerGenes
    }
  }
`;

class Tables extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  nameToObject(name) {
    return {
      id: name,
      title: name,
      type: "gene",
      __typename: "ColorLabel"
    };
  }

  handleClick(e) {
    let id = e.currentTarget.value;
    this.props.onClick(this.nameToObject(id));
  }

  render() {
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

    function makeStyle() {
      const classes = useStyles();
      return classes;
    }

    return (
      <Query query={QUERY}>
        {({ data, loading, error }) => {
          const markers = data.markers;
          console.log(data);
          if (loading) return <p> LOADING </p>;
          if (error) return <p> ERROR </p>;
          return (
            <div className={{ makeStyle }.root}>
              <Paper className={{ makeStyle }.paper}>
                <Table className={{ makeStyle }.table} size="small">
                  <TableBody>
                    {markers.map(row => {
                      const markerGenes = row["markerGenes"];
                      return (
                        <TableRow key={row.cellType}>
                          <TableCell align="center">{row.cellType}</TableCell>
                          {markerGenes.map(gene => {
                            return (
                              <TableCell align="center">
                                <Button
                                  color="outline-primary"
                                  value={gene}
                                  onClick={this.handleClick}
                                  disabled={gene === " "}
                                >
                                  {gene}
                                </Button>
                              </TableCell>
                            );
                          })}
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

export default Tables;
