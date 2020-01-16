import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import XYFrame from "semiotic/lib/XYFrame";
import getColorScale from "../Dashboard/getColors";

import Legend from "../Dashboard/Legend";

const TEST_ID = "SPECTRUM-OV-014_CD45P";
const TEST_TYPE = "patient";

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
      values {
        label
        value
      }
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
      props: [{ label: "celltype", type: "CELL" }],
      label: { label: "celltype", type: "CELL" }
    }
  });

  if (loading) {
    return null;
  }

  const width = 500;
  const { cells, celltypes, dashboardAttributeValues } = data;
  const cellProps = cells.map(cell => {
    const cellProps = cell["values"].reduce(
      (props, value) => ({ ...props, [value["label"]]: value["value"] }),
      {}
    );

    return { ...cell, ...cellProps };
  });

  const colorData = celltypes.map(celltype => celltype["name"]);

  const colorScale = getColorScale(
    { label: "celltype", type: "CELL" },
    colorData
  );

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: cellProps,
            label: { label: "celltype", type: "CELL" },
            highlightedGroup: highlightedLabel,
            colorScale,
            width
          })}
        />
      </Grid>
      <Grid item>
        <Legend
          data={colorData}
          colorScale={colorScale}
          width={width}
          label={{ label: "celltype", type: "CELL" }}
          onHover={group => setHighlightedLabel(group)}
        />
      </Grid>
    </Grid>
  );
};

const isInRange = (point, min) =>
  min <= point && point < min + (min < 1 ? 0.1 : 1);

const getFrameProps = ({
  data,
  label,
  highlightedGroup,
  colorScale,
  width
}) => ({
  summaries: data,
  points: highlightedGroup
    ? data.filter(datum =>
        highlightedGroup["label"] === "celltype"
          ? datum[highlightedGroup["label"]] === highlightedGroup["value"]
          : isInRange(
              datum[highlightedGroup["label"]],
              highlightedGroup["value"]
            )
      )
    : [],

  size: [width, 500],
  margin: { left: 25, bottom: 45, right: 25, top: 0 },

  xAccessor: "x",
  yAccessor: "y",
  summaryType: {
    type: "hexbin",
    bins: 0.03,
    binValue: d => getMaxLabel(d, label)
  },
  canvasAreas: true,
  summaryStyle: d => ({
    fill: d["value"] === "" ? "#FFFFFF" : colorScale(d["value"]),
    fillOpacity: 0.3
  }),
  canvasPoints: true,
  pointStyle: d => {
    return {
      r: 4,
      fill: colorScale(d[label["label"]]),
      stroke: "#eee",
      strokeWidth: 1
    };
  },

  axes: [
    { orient: "left", label: " " },
    { orient: "bottom", label: { name: " ", locationDistance: 55 } }
  ]
});

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

export default DensityPlots;
