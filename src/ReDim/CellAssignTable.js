import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  tableRowHeader: {
    "&:hover": {
      backgroundColor: "rgb(158, 158, 158) !important"
    }
  },
  geneLabel: {
    fontWeight: 400,
    color: "#242527",
    "&:hover": {
      backgroundColor: "#d4d3d4"
    }
  },
  geneLabelSelected: {
    fontWeight: 700,
    background: "#aeb0c3",
    color: "#000000",
    "&:hover": {
      backgroundColor: "#d4d3d4"
    }
  }
});
const CellAssignTable = ({
  labelTitle,
  hoverBehavior,
  onClick,
  data,
  highlighted,
  countData,
  colorScale,
  classes
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
      <Typography variant={"h6"} style={{ marginLeft: 10 }}>
        CellAssign : Cell Types and Marker Genes
      </Typography>
      <Paper
        style={{
          overflowX: "auto",
          overflowY: "auto",
          margin: "10px",
          marginRight: "30px"
        }}
      >
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
            classes={classes}
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
  nameToObject,
  classes
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
    return "#e2e2e2";
  };

  const allNums = longestArray();
  const formatTitle = title => {
    if (title.length <= 10) {
      return title;
    } else if (title.indexOf("/") !== -1) {
      return title.replace("/", "/\n");
    } else {
      return title.replace(" ", "\n");
    }
  };
  return (
    <TableBody>
      <TableRow>
        {cellAndMarkerGenes.map(row => {
          return (
            <TableCell
              align="center"
              style={{
                background: getColor(row.cellType)
              }}
            >
              {" "}
              <Typography variant={"h6"}>
                {
                  countData.map(element => element.count)[
                    countData.map(element => element.cell).indexOf(row.cellType)
                  ]
                }
              </Typography>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        {cellAndMarkerGenes.map(row => {
          return (
            <TableCell
              value={row.cellType}
              padding="none"
              align="center"
              variant="head"
              className={classes.tableRowHeader}
              style={{
                pointerEvents: "all",
                whiteSpace: "pre-line",
                textTransform: "none",
                background: pickBackgroundColor(row)
              }}
              onMouseEnter={e => handleCellEnter(e, row.cellType)}
              onMouseLeave={e => handleCellLeave(e)}
              onClick={e => handleCellClick(e, row.cellType)}
            >
              <Typography
                variant={"h8"}
                style={{
                  pointerEvents: "none"
                }}
              >
                {formatTitle(row.cellType)}
              </Typography>
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
              let isSelected = gene === selectedGene;
              return (
                <GeneCell
                  gene={gene}
                  handleClick={handleClick}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  isSelected={isSelected}
                  classes={classes}
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
  isSelected,
  gene,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
  classes
}) => (
  <TableCell align="center">
    <Button
      value={gene}
      fullWidth={true}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={isSelected ? classes.geneLabelSelected : classes.geneLabel}
    >
      {gene}
    </Button>
  </TableCell>
);

export default withStyles(styles)(CellAssignTable);
