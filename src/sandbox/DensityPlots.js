import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import XYFrame from "semiotic/lib/XYFrame";
import getColorScale from "../Dashboard/getColors";

import Legend from "../Dashboard/Legend";

const TEST_ID = "SPECTRUM-OV-014_CD45P";
const TEST_TYPE = "patient";
const TEST_LABEL = { label: "celltype", type: "CELL" };

const QUERY_CELLTYPES = gql`
  query($dashboardType: String!, $dashboardID: String!) {
    celltypes(type: $dashboardType, dashboardID: $dashboardID) {
      name
    }
  }
`;

const DensityPlots = () => {
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const { data, loading } = useQuery(QUERY_CELLTYPES, {
    variables: {
      dashboardType: TEST_TYPE,
      dashboardID: TEST_ID,
      highlightedGroup: !highlightedLabel
        ? highlightedLabel
        : highlightedLabel["value"]
    }
  });

  if (loading && !data) {
    return null;
  }

  const { celltypes } = data;

  const colorData = celltypes.map(celltype => celltype["name"]);

  const colorScale = getColorScale(TEST_LABEL, colorData);

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <Legend
          data={colorData}
          colorScale={colorScale}
          width={500}
          label={TEST_LABEL}
          onHover={group => setHighlightedLabel(group)}
        />
      </Grid>
      <Grid container direction="row" alignItems="center" justify="center">
        <Grid item>
          <DensityPlot
            highlightedGroup={highlightedLabel}
            label={{ label: "celltype", type: "CELL" }}
            celltypeColorScale={colorScale}
          />
        </Grid>
        <Grid item>
          <DensityPlot
            highlightedGroup={highlightedLabel}
            label={{ label: "Cytotoxic T cell probability", type: "CELL" }}
            celltypeColorScale={colorScale}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const QUERY = gql`
  query(
    $dashboardID: String!
    $highlightedGroup: String
    $label: DashboardAttributeInput!
  ) {
    density(
      dashboardID: $dashboardID
      label: $label
      highlightedGroup: $highlightedGroup
    ) {
      x
      y
      label
      value
    }
  }
`;

const DensityPlot = ({ highlightedGroup, label, celltypeColorScale }) => {
  const { data, loading } = useQuery(QUERY, {
    variables: {
      dashboardID: TEST_ID,
      highlightedGroup: highlightedGroup ? highlightedGroup["value"] : null,
      label: label
    }
  });

  if (loading && !data) {
    return null;
  }

  const { density } = data;

  const colorScale =
    label["label"] === "celltype"
      ? celltypeColorScale
      : getColorScale(label, density);
  return (
    <XYFrame
      {...{
        ...framePropsBase,
        points: density,
        pointStyle: d => ({
          r: 2,
          fill: getColor(d, label, highlightedGroup, colorScale),
          fillOpacity: highlightedGroup ? d["value"] : 1
        })
      }}
    />
  );
};

const framePropsBase = {
  size: [500, 500],
  margin: { left: 25, bottom: 45, right: 25, top: 25 },

  xAccessor: "x",
  yAccessor: "y",
  canvasPoints: true, // TODO wanted to turn this off to see transitions; but they're weird...

  axes: [
    { orient: "left", label: " ", tickFormat: d => "" },
    {
      orient: "bottom",
      label: { name: " ", locationDistance: 55 },
      tickFormat: d => ""
    }
  ]
};

const getColor = (d, label, highlightedGroup, colorScale) => {
  if (!highlightedGroup) {
    // nothing is highlighted, return original color
    return colorScale(d["value"]);
  } else if (d["value"] === 0) {
    // 0 if highlighted group doesn't overlap; so grey out

    return "#ccc";
  } else if (highlightedGroup["label"] === label["label"]) {
    return colorScale(d["label"]);
  } else {
    return colorScale(d["value"]);
  }
};

export default DensityPlots;
