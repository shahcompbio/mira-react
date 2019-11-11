import React, { useEffect, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import LabelSelect from "./LabelSelect";

import XYFrame from "semiotic/lib/XYFrame";
import getColorScale from "./getColors";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";
import Legend from "./Legend";

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

const QUERY_OTHER = gql`
  query(
    $dashboardType: String!
    $dashboardID: String!
    $props: [DashboardAttributeInput!]!
    $label: DashboardAttributeInput!
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
    dashboardAttributeValues(
      type: $dashboardType
      dashboardID: $dashboardID
      prop: $label
    ) {
      label
    }
  }
`;

const getQuery = label =>
  label["label"] === "celltype" ? QUERY_CELLTYPES : QUERY_OTHER;

const ReDimChart = ({
  labels,
  index,
  onSelect,
  onLegendHover,
  highlightedGroup,
  width
}) => {
  const location = useLocation();
  const [dashboardType, dashboardID] = [
    useDashboardType(location),
    useDashboardID(location)
  ];
  const { data, loading } = useQuery(getQuery(labels[index]), {
    variables: {
      dashboardType,
      dashboardID,
      props: labels,
      label: labels[index]
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

  const { cells, celltypes, dashboardAttributeValues } = data;
  const cellProps = cells.map(cell => {
    const cellProps = cell["values"].reduce(
      (props, value) => ({ ...props, [value["label"]]: value["value"] }),
      {}
    );

    return { ...cell, ...cellProps };
  });

  const colorData = celltypes
    ? celltypes.map(celltype => celltype["name"])
    : dashboardAttributeValues;

  const colorScale = getColorScale(labels[index], colorData);
  return (
    <BaseChart onSelect={onSelect} label={labels[index]}>
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: cellProps,
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
          width={width}
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
    binValue: d => getMaxLabel(d, label["label"])
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
