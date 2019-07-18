import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";

class CellAssignTable extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.state = {
      selectedGene: this.props.labelTitle
    };
  }

  handleMouseEnter(e) {
    this.setState({
      selectedGene: e.currentTarget.value
    });
  }

  handleMouseLeave() {
    this.setState({
      selectedGene: "Cell Type"
    });
  }

  handleClick(e) {
    const nameToObject = name => ({ id: name, title: name, type: "gene" });
    this.props.onClick(nameToObject(e.currentTarget.value));
  }

  sortData(data) {
    const sortedCellTypes = data.map(row => row.cellType).sort();
    return sortedCellTypes.map(
      cell => data.filter(element => element.cellType === cell)[0]
    );
  }

  render() {
    const cellAndMarkerGenes = this.sortData(this.props.data);
    return (
      <div>
        <h3>
          <center>CellAssign : Cell Types and Marker Genes</center>
        </h3>
        <Paper style={{ overflowX: "auto" }}>
          <Table size="small" padding="default">
            <TableBody>
              {cellAndMarkerGenes.map(row => {
                const markerGenes = row["markerGenes"];
                return (
                  <CellTypeAndMarkerGenesRow
                    markerGenes={markerGenes}
                    handleClick={this.handleClick}
                    row={row}
                    colorScale={this.props.colorScale}
                    highlighted={this.props.highlighted}
                    handleMouseEnter={this.handleMouseEnter}
                    handleMouseLeave={this.handleMouseLeave}
                    selectedGene={this.state.selectedGene}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

const CellTypeAndMarkerGenesRow = ({
  colorScale,
  highlighted,
  row,
  markerGenes,
  handleClick,
  selectedGene,
  handleMouseEnter,
  handleMouseLeave
}) => {
  const reformatName = name => name.split(" ").join(".");
  const nameToObject = name => ({ name: name, label: reformatName(name) });

  const getColor = name =>
    colorScale(reformatName(name)) !== undefined
      ? colorScale(reformatName(name))
      : "#ccc";

  const pickBackgroundColor = () => {
    if (highlighted === null && selectedGene !== "Cell Type") {
      if (row.markerGenes.includes(selectedGene)) return getColor(row.cellType);
    } else if (highlighted === null && selectedGene === "Cell Type") {
      return getColor(row.cellType);
    } else if (highlighted(nameToObject(row.cellType))) {
      return getColor(row.cellType);
    }
    return "#ccc";
  };

  const createStyles = {
    position: "sticky",
    left: 0,
    color: "black",
    background: pickBackgroundColor(),
    zIndex: 1
  };

  return (
    <TableRow key={row.cellType}>
      <TableCell align="center" style={createStyles}>
        <h5>{row.cellType}</h5>
      </TableCell>
      {markerGenes.map(gene => {
        let buttonColor = gene === selectedGene ? "default" : "primary";
        return (
          <GeneCell
            gene={gene}
            handleClick={handleClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            buttonColor={buttonColor}
          />
        );
      })}
    </TableRow>
  );
};

const GeneCell = ({
  buttonColor,
  gene,
  handleClick,
  handleMouseEnter,
  handleMouseLeave
}) => {
  return (
    <TableCell align="center">
      <Button
        color={buttonColor}
        value={gene}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {gene}
      </Button>
    </TableCell>
  );
};

export default CellAssignTable;
