import React, { useState, useEffect } from "react";

import ReDimChart from "./ReDimChart";
import AttributeCountPlot from "./AttributeCountPlot";

import ExpansionPanel from "../components/ExpansionPanel";
import Title from "../components/Title";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

import CellAssignTable from "./CellAssignTable";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return width;
}

const Dashboard = () => {
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const [labels, setLabels] = useState([
    { isNum: false, type: "CELL", label: "celltype" },
    { isNum: false, type: "CELL", label: "celltype" }
  ]);

  const location = useLocation();
  const [dashboardType, dashboardID] = [
    useDashboardType(location),
    useDashboardID(location)
  ];
  const windowWidth = useWindowWidth();
  const chartWidth = Math.floor((windowWidth - 150) / labels.length + 1);

  return [
    <Grid item>
      <Paper style={{ padding: "25px 20px" }}>
        <Grid container direction="column">
          <Grid item>
            <Title title={`UMAP : ${dashboardID}`} />
          </Grid>
          <Grid item>
            <Filters facade={highlightedLabel} />
          </Grid>
          <Grid item>
            <UMAP
              labels={labels}
              setLabels={setLabels}
              width={chartWidth}
              highlightedLabel={highlightedLabel}
              setHighlightedLabel={setHighlightedLabel}
              dashboardID={dashboardID}
              dashboardType={dashboardType}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>,
    <Grid item>
      <ExpansionPanel title={"CellAssign: Cell Types and Marker Genes"}>
        <CellAssignTable
          selectedGene={labels[1]["label"]}
          setSelectedGene={label => {
            // eslint-disable-next-line
            const [_, ...restLabels] = labels;
            setLabels([{ isNum: true, label, type: "GENE" }, ...restLabels]);
          }}
          setSelectedCelltype={celltype =>
            setHighlightedLabel({
              isNum: false,
              type: "CELL",
              label: "celltype",
              value: celltype
            })
          }
        />
      </ExpansionPanel>
    </Grid>
  ];
};

const UMAP = ({
  labels,
  setLabels,
  width,
  highlightedLabel,
  setHighlightedLabel,
  dashboardID,
  dashboardType
}) => (
  <Grid container direction="row" alignItems="center">
    {labels.map((label, index) => (
      <Grid key={`grid_redim_${index}`} item xs={4} style={{ minHeight: 500 }}>
        <ReDimChart
          key={`redim_${index}`}
          width={width}
          labels={labels}
          index={index}
          highlightedGroup={highlightedLabel}
          onLegendHover={setHighlightedLabel}
          onSelect={label =>
            setLabels(
              labels.map((oldLabel, oldLabelIndex) =>
                oldLabelIndex === index ? label : oldLabel
              )
            )
          }
          dashboardID={dashboardID}
          dashboardType={dashboardType}
        />
      </Grid>
    ))}
    <Grid item>
      <Grid container direction="column">
        {labels.map((label, index) => (
          <Grid key={`grid_histo_${index}`} item xs={4}>
            <AttributeCountPlot
              key={`histo_${index}`}
              width={width}
              labels={labels}
              index={index}
              highlightedGroup={highlightedLabel}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
);

const Filters = ({ facade }) => {
  if (!facade) {
    return null;
  } else {
    const { label, isNum, value } = facade;

    return isNum ? (
      <Chip
        key={`chip_${label}_${value[0]}-${value[1]}`}
        label={`${label}: ${value[0]} - ${value[1]}`}
      />
    ) : (
      value.map(x => (
        <Chip key={`chip_${label}_${x}`} label={`${label}: ${x}`} />
      ))
    );
  }
};
export default Dashboard;
