import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";

import CircularProgress from "@material-ui/core/CircularProgress";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import { getCelltypeColors } from "./getColors";

const QUERY = gql`
  query($dashboardType: String!, $dashboardID: String!) {
    celltypes(type: $dashboardType, dashboardID: $dashboardID) {
      name
      markers
    }
  }
`;

const styles = (theme) => ({
  tableRowHeader: {
    "&:hover": {
      backgroundColor: "rgb(158, 158, 158) !important",
    },
  },
  geneLabel: {
    fontWeight: 400,
    color: "#242527",
    "&:hover": {
      backgroundColor: "#d4d3d4",
    },
  },
  geneLabelSelected: {
    fontWeight: 700,
    background: "#aeb0c3",
    color: "#000000",
    "&:hover": {
      backgroundColor: "#d4d3d4",
    },
  },
});
const CellAssignTable = ({
  selectedGene,
  setSelectedGene,
  setSelectedCelltype,
  classes,
}) => {
  const location = useLocation();
  const [dashboardType, dashboardID] = [
    useDashboardType(location),
    useDashboardID(location),
  ];

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, dashboardID },
  });

  if (loading || error) {
    return <CircularProgress />;
  }

  const { celltypes } = data;
  const colorScale = getCelltypeColors(
    celltypes.map((celltype) => celltype["name"])
  );

  return (
    <div>
      <Typography variant={"h6"} style={{ marginLeft: 10, marginTop: 30 }}>
        CellAssign : Cell Types and Marker Genes
      </Typography>
      <Paper
        style={{
          overflowX: "auto",
          overflowY: "auto",
          margin: "10px",
          marginRight: "30px",
        }}
      >
        <CellTypeAndMarkerGenesRow
          colorScale={colorScale}
          celltypes={celltypes}
          classes={classes}
          selectedGene={selectedGene}
          setSelectedGene={setSelectedGene}
          setSelectedCelltype={setSelectedCelltype}
        />
      </Paper>
    </div>
  );
};

const CellTypeAndMarkerGenesRow = ({
  colorScale,
  celltypes,
  classes,
  selectedGene,
  setSelectedGene,
  setSelectedCelltype,
}) => {
  const [highlightedGene, setHighlightedGene] = useState(null);

  const longestArray = () => {
    const longest = celltypes.reduce(
      (currLongest, celltype) =>
        Math.max(currLongest, celltype["markers"].length),
      0
    );

    return Array.from(Array(longest).keys());
  };

  return (
    <Table size="small" padding="none">
      <TableHead>
        <TableRow>
          {celltypes.map((celltype) => {
            return (
              <TableCell
                key={`cellassign_name_${celltype["name"]}`}
                value={celltype["name"]}
                align="center"
                className={classes.tableRowHeader}
                style={{
                  pointerEvents: "all",
                  whiteSpace: "pre-line",
                  textTransform: "none",
                  background: "#e2e2e2", //TODO: Add highlighting here
                }}
                //   onClick={e => handleCellClick(e, row.cellType)}
              >
                {celltype["name"]}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {longestArray().map((_, index) => {
          return (
            <TableRow key={`cellassign_rho_${index}`}>
              {celltypes.map((celltype) => {
                const gene = celltype["markers"][index];
                return (
                  <TableCell
                    key={`cellassign_rho_${index}_${celltype["name"]}`}
                    align="center"
                  >
                    {celltype["markers"].length - 1 < index ? null : (
                      <Button
                        value={gene}
                        fullWidth={true}
                        onClick={(e) => {
                          setSelectedGene(e.currentTarget.value);
                          setHighlightedGene(e.currentTarget.value);
                        }}
                        onMouseEnter={(e) =>
                          setHighlightedGene(e.currentTarget.value)
                        }
                        onMouseLeave={() => setHighlightedGene(selectedGene)}
                        className={
                          gene === highlightedGene
                            ? classes.geneLabelSelected
                            : classes.geneLabel
                        }
                      >
                        {gene}
                      </Button>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default withStyles(styles)(CellAssignTable);
