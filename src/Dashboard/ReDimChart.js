import React, { useEffect, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import LabelSelect from "./LabelSelect";

import XYFrame from "semiotic/lib/XYFrame";
import getColorScale from "./getColors";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useLocation } from "react-router";
import { useDashboardID } from "../utils/useDashboardInfo";
import Legend from "./Legend";

const QUERY = gql`
  query(
    $dashboardID: String!
    $highlightedGroup: AttributeInput
    $label: AttributeInput!
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
    attributeCounts(
      dashboardID: $dashboardID
      label: $label
      highlightedGroup: $highlightedGroup
    ) {
      label
      value
    }
  }
`;

const ReDimChart = ({
  labels,
  index,
  onSelect,
  onLegendHover,
  highlightedGroup,
  width
}) => {
  const location = useLocation();
  const dashboardID = useDashboardID(location);

  const { data, loading } = useQuery(QUERY, {
    variables: {
      dashboardID,
      label: labels[index],
      highlightedGroup
    }
  });

  // This is messy, but this is to store previous label state (and we only want that to update when loading is done)
  const prevLabelRef = useRef();
  const prevIDRef = useRef();
  useEffect(() => {
    if (!loading) {
      prevLabelRef.current = labels[index]["label"];
      prevIDRef.current = dashboardID;
    }
  }, [loading, labels[index]["label"]]);

  const prevLabel = prevLabelRef.current;
  const prevID = prevIDRef.current;

  // only want spinny loading if it's initial load (no previous data) for new data set OR this particular label has been changed

  if (
    (loading && prevID !== dashboardID) ||
    !data ||
    (loading && prevLabel !== labels[index]["label"])
  ) {
    return (
      <BaseChart onSelect={onSelect} label={labels[index]}>
        <CircularProgress />
      </BaseChart>
    );
  }

  const { density, attributeCounts } = data;

  const colorData = attributeCounts.map(record => record["value"]);
  const colorScale = getColorScale(labels[index], colorData);

  return (
    <BaseChart onSelect={onSelect} label={labels[index]}>
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: density,
            label: labels[index],
            highlightedGroup,
            colorScale,
            width
          })}
        />
      </Grid>
      <Grid item>
        <Legend
          data={colorData}
          colorScale={colorScale}
          width={500}
          label={labels[index]}
          onHover={onLegendHover}
        />
      </Grid>
    </BaseChart>
  );
};

const BaseChart = ({ children, onSelect, label }) => {
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <LabelSelect onSelect={onSelect} label={label} />
      </Grid>
      {children}
    </Grid>
  );
};

const getFrameProps = ({
  data,
  label,
  highlightedGroup,
  colorScale,
  width
}) => ({
  points: data,
  pointStyle: d => ({
    r: 2,
    fill: getColor(d, label, highlightedGroup, colorScale),
    fillOpacity:
      highlightedGroup && highlightedGroup["label"] === label["label"]
        ? Math.max(d["value"], 0.02)
        : 1
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

const getColor = (d, label, highlightedGroup, colorScale) => {
  if (!highlightedGroup) {
    // nothing is highlighted, return original color
    return colorScale(d["value"]);
  } else if (d["value"] === "") {
    // 0 if highlighted group doesn't overlap; so grey out

    return "#eee";
  } else if (highlightedGroup["label"] === label["label"]) {
    return colorScale(d["label"]);
  } else {
    return colorScale(d["value"]);
  }
};

export default ReDimChart;
