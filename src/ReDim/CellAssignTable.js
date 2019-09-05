import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const CellAssignTable = ({
  labelTitle,
  hoverBehavior,
  onClick,
  data,
  highlighted,
  countData,
  colorScale
}) => {
  const [selectedGene, setSelectedGene] = useState(labelTitle);
  const [clicked, changeClicked] = useState(false);

  const handleMouseEnter = e => {
    setSelectedGene(e.currentTarget.value);
  };

  const handleMouseLeave = () => {
    setSelectedGene(labelTitle);
  };

  const handleCellClick = (e, name) => {
    changeClicked(true);
    hoverBehavior(nameToObject(name));
  };

  const handleCellEnter = (e, name) => {
    changeClicked(false);
    hoverBehavior(nameToObject(name));
  };

  const handleCellLeave = e => {
    if (clicked === false) {
      hoverBehavior(undefined);
    }
  };

  const nameToObject = name => ({
    id: name,
    name: name,
    title: name,
    type: "gene",
    __typename: "Categorical"
  });

  const handleClick = e => {
    onClick(nameToObject(e.currentTarget.value));
  };

  const sortData = data => {
    const sortedCellTypes = data.map(row => row.cellType).sort();
    return sortedCellTypes.map(
      cell => data.filter(element => element.cellType === cell)[0]
    );
  };
  const cellAndMarkerGenes = sortData(data);
  return (
    <div>
      <h3>
        <center>CellAssign : Cell Types and Marker Genes</center>
      </h3>
      <Paper style={{ overflowX: "auto", overflowY: "auto", margin: "10px" }}>
        <Table size="small" padding="none">
          <CellTypeAndMarkerGenesRow
            handleClick={handleClick}
            colorScale={colorScale}
            highlighted={highlighted}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleCellEnter={handleCellEnter}
            handleCellLeave={handleCellLeave}
            handleCellClick={handleCellClick}
            selectedGene={selectedGene}
            countData={countData}
            cellAndMarkerGenes={cellAndMarkerGenes}
            nameToObject={nameToObject}
          />
        </Table>
      </Paper>
    </div>
  );
};

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
    if (selectedGene !== "Cell Type") {
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
          <TableRow>
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
  <TableCell align="center" style={{ paddingTop: 4, paddingBottom: 4 }}>
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
