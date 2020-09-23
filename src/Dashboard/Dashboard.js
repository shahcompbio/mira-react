import React, { useState, useEffect } from "react";

import ReDimChart from "./ReDimChart";
import AttributeCountPlot from "./AttributeCountPlot";

import Grid from "@material-ui/core/Grid";

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
  const location = useLocation();
  const [dashboardType, dashboardID] = [
    useDashboardType(location),
    useDashboardID(location),
  ];

  const initialLabels = [
    { isNum: false, type: "CELL", label: "cell_type" },
    {
      isNum: false,
      type: "CELL",
      label:
        dashboardType === "patient"
          ? "sample_id"
          : dashboardID === "cohort_all"
          ? "site"
          : "cluster_label",
    },
  ];
  const [labels, setLabels] = useState(initialLabels);

  const windowWidth = useWindowWidth();
  const chartWidth = Math.floor((windowWidth - 150) / labels.length + 1);

  return (
    <Grid container direction="column">
      <Grid container direction="row" alignItems="center">
        {labels.map((label, index) => (
          <Grid
            key={`grid_redim_${index}`}
            item
            xs={4}
            style={{ minHeight: 500 }}
          >
            <ReDimChart
              key={`redim_${index}`}
              width={chartWidth}
              labels={labels}
              index={index}
              highlightedGroup={highlightedLabel}
              onLegendHover={setHighlightedLabel}
              onSelect={(label) =>
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
        {/* <Grid item>
          <Grid container direction="column">
            {labels.map((label, index) => (
              <Grid key={`grid_histo_${index}`} item xs={4}>
                <AttributeCountPlot
                  key={`histo_${index}`}
                  width={chartWidth}
                  labels={labels}
                  index={index}
                  highlightedGroup={highlightedLabel}
                />
              </Grid>
            ))}
          </Grid>
        </Grid> */}
      </Grid>
      <Grid item>
        <CellAssignTable
          selectedGene={labels[1]["label"]}
          setSelectedGene={(label) => {
            // eslint-disable-next-line
            const [_, ...restLabels] = labels;
            setLabels([{ isNum: true, label, type: "GENE" }, ...restLabels]);
          }}
          setSelectedCelltype={(celltype) =>
            setHighlightedLabel({
              isNum: false,
              type: "CELL",
              label: "celltype",
              value: celltype,
            })
          }
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
