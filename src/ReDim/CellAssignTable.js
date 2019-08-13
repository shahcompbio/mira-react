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
    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleCellEnter = this.handleCellEnter.bind(this);
    this.handleCellLeave = this.handleCellLeave.bind(this);
    this.state = {
      selectedGene: this.props.labelTitle,
      clicked: false,
      currName: ""
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

  handleCellClick(e, name) {
    this.setState({
      clicked: true
    });

    this.props.hoverBehavior(this.nameToObject(name));
  }

  handleCellEnter = (e, name) => {
    this.setState({
      clicked: false
    });
    this.props.hoverBehavior(this.nameToObject(name));
  };

  handleCellLeave = e => {
    if (this.state.clicked === false) {
      this.props.hoverBehavior(undefined);
    }
  };

  nameToObject = name => ({
    id: name,
    name: name,
    title: name,
    type: "gene",
    __typename: "Categorical"
  });

  handleClick(e) {
    this.props.onClick(this.nameToObject(e.currentTarget.value));
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
        <Paper style={{ overflowX: "auto", overflowY: "auto" }}>
          <Table size="small" padding="none">
            <CellTypeAndMarkerGenesRow
              handleClick={this.handleClick}
              colorScale={colorScale}
              highlighted={highlighted}
              handleMouseEnter={this.handleMouseEnter}
              handleMouseLeave={this.handleMouseLeave}
              handleCellEnter={this.handleCellEnter}
              handleCellLeave={this.handleCellLeave}
              handleCellClick={this.handleCellClick.bind(this)}
              selectedGene={this.state.selectedGene}
              countData={countData}
              cellAndMarkerGenes={cellAndMarkerGenes}
              nameToObject={this.nameToObject}
            />
          </Table>
        </Paper>
      </div>
    );
  }
}

const CellTypeAndMarkerGenesRow = ({
  colorScale,
  highlighted,
  cellAndMarkerGenes,
  handleClick,
  handleCellClick,
  selectedGene,
  handleCellEnter,
  handleCellLeave,
  handleMouseEnter,
  handleMouseLeave,
  countData,
  nameToObject
}) => {
  const longestArray = () => {
    let longest = 0;
    cellAndMarkerGenes.map(
      element =>
        (longest =
          element.markerGenes.length > longest
            ? element.markerGenes.length
            : longest)
    );

    let numsArray = [];

    for (let i = 0; i < longest; i++) {
      numsArray.push(i);
    }
    return numsArray;
  };

  const getColor = name =>
    colorScale(name) !== undefined ? colorScale(name) : "#D4D4D4";

  const pickBackgroundColor = row => {
    if (highlighted === null && selectedGene !== "Cell Type") {
      if (row.markerGenes.includes(selectedGene)) return getColor(row.cellType);
    } else if (highlighted(nameToObject(row.cellType))) {
      return getColor(row.cellType);
    }
    return "#D4D4D4";
  };

  const allNums = longestArray();

  return (
    <TableBody>
      <TableRow>
        {cellAndMarkerGenes.map(row => {
          return (
            <TableCell
              align="center"
              style={{
                background: getColor(row.cellType),
                paddingTop: 8,
                paddingBottom: 8
              }}
            >
              {" "}
              <h5>
                {
                  countData.map(element => element.count)[
                    countData.map(element => element.cell).indexOf(row.cellType)
                  ]
                }
              </h5>
            </TableCell>
          );
        })}
      </TableRow>

      <TableRow>
        {cellAndMarkerGenes.map(row => {
          return (
            <TableCell
              value={row.cellType}
              key={Math.random}
              align="center"
              style={{
                background: pickBackgroundColor(row),
                paddingTop: 8,
                paddingBottom: 8
              }}
            >
              <Button
                style={{ textTransform: "none" }}
                onMouseEnter={e => handleCellEnter(e, row.cellType)}
                onMouseLeave={e => handleCellLeave(e)}
                onClick={e => handleCellClick(e, row.cellType)}
              >
                <h5>{row.cellType}</h5>
              </Button>
            </TableCell>
          );
        })}
      </TableRow>

      {allNums.map(element => {
        return (
          <TableRow key={Math.random}>
            {cellAndMarkerGenes.map(row => {
              const markerGenes = row.markerGenes;
              let gene = markerGenes[element];
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
      })}
    </TableBody>
  );
};

const GeneCell = ({
  buttonColor,
  gene,
  handleClick,
  handleMouseEnter,
  handleMouseLeave
}) => (
  <TableCell
    align="center"
    key={Math.random}
    style={{ paddingTop: 4, paddingBottom: 4 }}
  >
    <Button
      color={buttonColor}
      value={gene}
      size={"medium"}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {gene}
    </Button>
  </TableCell>
);

export default CellAssignTable;
