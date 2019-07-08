import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";

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
    let id = e.target.value;
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

    function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }

    const rows = [
      createData("Ovarian cancer cell", "AARSD1", "ABAT", "AATK", "ZNF248"),
      createData("Mesothelial cell", "Gene2", 9.0, 37, 4.3),
      createData("Myofibroblast", "Gene3", 16.0, 24, 6.0),
      createData("Plasma cell", "Gene4", 3.7, 67, 4.3),
      createData("Endothelial cell", "Gene5", 16.0, 49, 3.9),
      createData("NK cell", "Gene6", 16.0, 49, 3.9)
    ];

    function makeStyle() {
      const classes = useStyles();
      return classes;
    }

    return (
      <div className={{ makeStyle }.root}>
        <Paper className={{ makeStyle }.paper}>
          <Table className={{ makeStyle }.table} size="small">
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">
                    <button
                      color="default"
                      value={row.calories}
                      onClick={this.handleClick}
                      className={{ makeStyle }.button}
                    >
                      {row.calories}
                    </button>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      color="default"
                      value={row.fat}
                      onClick={this.handleClick}
                      className={{ makeStyle }.button}
                    >
                      {" "}
                      {row.fat}{" "}
                    </button>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      variant="primary"
                      value={row.carbs}
                      onClick={this.handleClick}
                      className={{ makeStyle }.button}
                    >
                      {row.carbs}{" "}
                    </button>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      color="default"
                      value={row.protein}
                      onClick={this.handleClick}
                      className={{ makeStyle }.button}
                    >
                      {row.protein}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default Tables;
