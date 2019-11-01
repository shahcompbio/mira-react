import React from "react";

import Grid from "@material-ui/core/Grid";

import LabelSelect from "./LabelSelect";

import XYFrame from "semiotic/lib/XYFrame";
import getColorScale from "./getColors";

const ReDimChart = ({ data, label, onSelect, highlightedGroup }) => {
  const colorScale = getColorScale(label);

  const frameProps = {
    summaries: data,
    points: highlightedGroup
      ? data.filter(
          datum =>
            datum[highlightedGroup["label"]] === highlightedGroup["value"]
        )
      : [],

    size: [500, 500],
    margin: { left: 25, bottom: 70, right: 10, top: 0 },

    xAccessor: "x",
    yAccessor: "y",
    summaryType: {
      type: "hexbin",
      bins: 0.03,
      binValue: d => getMaxLabel(d, label["label"])
    },
    canvasAreas: true,
    summaryStyle: d => ({
      fill: d["value"] === "" ? "#FFFFFF" : colorScale(d["value"]),
      fillOpacity: 0.9
    }),
    canvasPoints: true,
    pointStyle: d => {
      return {
        r: 4,
        fill: colorScale ? colorScale(d[label["label"]]) : "black"
      };
    },

    axes: [
      { orient: "left", label: " " },
      { orient: "bottom", label: { name: " ", locationDistance: 55 } }
    ]
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <LabelSelect onSelect={onSelect} label={label} />
      </Grid>
      {colorScale ? (
        <Grid item>
          <XYFrame {...frameProps} />
        </Grid>
      ) : null}
    </Grid>
  );
};

const getMaxLabel = (data, label) => {
  if (label === "celltype") {
    const counts = data
      .map(point => point[label])
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
      .map(point => point[label])
      .reduce((currSum, point) => currSum + point, 0);
    const count = data.length;

    return total / count;
  }
};

export default ReDimChart;
