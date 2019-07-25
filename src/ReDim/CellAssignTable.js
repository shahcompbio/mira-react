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
      selectedGene: this.props.labelTitle
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
    const { colorScale, highlighted, data, countData } = this.props;
    const cellAndMarkerGenes = this.sortData(data);
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
                    colorScale={colorScale}
                    highlighted={highlighted}
                    handleMouseEnter={this.handleMouseEnter}
                    handleMouseLeave={this.handleMouseLeave}
                    selectedGene={this.state.selectedGene}
                    countData={countData}
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
  handleMouseLeave,
  countData
}) => {
  const reformatName = name => name.split(" ").join(".");
  const nameToObject = name => ({ name: name, label: reformatName(name) });

  const getColor = name =>
    colorScale(reformatName(name)) !== undefined
      ? colorScale(reformatName(name))
      : "#D4D4D4";

  const pickBackgroundColor = () => {
    if (highlighted === null && selectedGene !== "Cell Type") {
      if (row.markerGenes.includes(selectedGene)) return getColor(row.cellType);
    } else if (highlighted(nameToObject(row.cellType))) {
      return getColor(row.cellType);
    }
    return "#D4D4D4";
  };

  const styles = (backgroundColor, leftPosition, anyPadding) => {
    return {
      position: "sticky",
      left: leftPosition,
      color: "black",
      background: backgroundColor,
      zIndex: 1,
      padding: anyPadding
    };
  };

  return (
    <TableRow key={row.cellType}>
      <TableCell align="center" style={styles(getColor(row.cellType), 0, null)}>
        {" "}
        <h5>
          {
            countData.map(element => element.count)[
              countData
                .map(element => element.cell)
                .indexOf(reformatName(row.cellType))
            ]
          }
        </h5>
      </TableCell>
      <TableCell style={styles("#E0E0E0", 65, 0.25)} />
      <TableCell
        align="center"
        style={styles(pickBackgroundColor(), 65.75, null)}
      >
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
