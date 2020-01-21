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
  query(
    $dashboardType: String!
    $dashboardID: String!
    $props: [DashboardAttributeInput!]!
  ) {
    cells(type: $dashboardType, dashboardID: $dashboardID, props: $props) {
      name
      x
      y
      celltype
    }
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
      props: [TEST_LABEL],
      label: TEST_LABEL
    }
  });

  if (loading) {
    return null;
  }

  const { cells, celltypes } = data;

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
          <PureScatterplot
            data={cells}
            label={TEST_LABEL}
            highlightedGroup={highlightedLabel}
            colorScale={colorScale}
          />
        </Grid>
        <Grid item>
          <DensityScatterplot
            data={cells}
            label={TEST_LABEL}
            highlightedGroup={highlightedLabel}
            colorScale={colorScale}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const PureScatterplot = ({ data, highlightedGroup, colorScale, label }) => (
  <XYFrame
    {...{
      ...framePropsBase,
      points: data,

      pointStyle: d => {
        return {
          r: 4,
          fill:
            !highlightedGroup || d[label["label"]] === highlightedGroup["value"]
              ? colorScale(d[label["label"]])
              : "#333333",
          stroke: "#eee",
          strokeWidth: 1
        };
      }
    }}
  />
);

const DensityScatterplot = ({ data, label, highlightedGroup, colorScale }) => (
  <XYFrame
    {...{
      ...framePropsBase,
      summaries: data,
      points: highlightedGroup
        ? data.filter(
            datum =>
              datum[highlightedGroup["label"]] === highlightedGroup["value"]
          )
        : [],

      summaryType: {
        type: "hexbin",
        bins: 0.03,
        binValue: d => getMaxLabel(d, label)
      },
      summaryStyle: d => ({
        fill: d["value"] === "" ? "#FFFFFF" : colorScale(d["value"]),
        fillOpacity: 0.3
      }),
      pointStyle: d => {
        return {
          r: 4,
          fill: colorScale(d[label["label"]]),
          stroke: "#eee",
          strokeWidth: 1
        };
      }
    }}
  />
);

const getMaxLabel = (data, label) => {
  if (label["label"] === "celltype" || label["type"] === "SAMPLE") {
    const counts = data
      .map(point => point[label["label"]])
      .reduce(
        (countMap, point) =>
          countMap.hasOwnProperty(point)
            ? { ...countMap, [point]: countMap[point] + 1 }
            : { ...countMap, [point]: 1 },
        {}
      );

    const celltypes = Object.keys(counts);

    return celltypes.length === 0
      ? ""
      : celltypes.reduce(
          (currMax, key) => (counts[key] > counts[currMax] ? key : currMax),
          Object.keys(counts)[0]
        );
  } else {
    const total = data
      .map(point => point[label["label"]])
      .reduce((currSum, point) => currSum + point, 0);

    const count = data.length;

    return total / count;
  }
};

const framePropsBase = {
  size: [500, 500],
  margin: { left: 25, bottom: 45, right: 25, top: 25 },

  xAccessor: "x",
  yAccessor: "y",
  canvasAreas: true,
  canvasPoints: true,

  axes: [
    { orient: "left", label: " " },
    { orient: "bottom", label: { name: " ", locationDistance: 55 } }
  ]
};

export default DensityPlots;
