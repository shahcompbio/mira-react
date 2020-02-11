import React, { useState } from "react";
import XYFrame from "semiotic/lib/XYFrame";

import Grid from "@material-ui/core/Grid";

import Correlation from "./Correlation";

const TEST_DASHBOARDID = "SPECTRUM-OV-014_CD45P";
const TEST_DASHBOARDTYPE = "patient";

const CumulativeGenePlot = () => {
  // TODO: add drop down to select sample/patient
  // TODO: add text box that parses and stores labels, then pass to query that will give you density plot, then parse results into plot
  const density = [];
  const colorScale = datum => "#FFFFFF";

  return (
    <Grid container direction="row">
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: density,
            colorScale
          })}
        />
      </Grid>
    </Grid>
  );
};

const getFrameProps = ({ data, label, highlightedGroup, colorScale }) => ({
  points: data,
  pointStyle: d => ({
    r: 2,
    fill: colorScale(d["value"])
  }),

  size: [500, 500],
  margin: { left: 25, bottom: 45, right: 25, top: 0 },

  xAccessor: "x",
  yAccessor: "y",

  // canvasPoints: true,

  axes: [
    { orient: "left", label: " ", tickFormat: d => "" },
    {
      orient: "bottom",
      label: { name: " ", locationDistance: 55 },
      tickFormat: d => ""
    }
  ]
});

export default () => null;
