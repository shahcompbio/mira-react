import React from "react";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { CircularProgress } from "@material-ui/core";

import XYFrame from "semiotic/lib/XYFrame";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";

import getColorScale from "../Dashboard/getColors";

const Correlation = ({ dashboardID, labels }) => {
  const [xLabel, yLabel] = labels;

  if (!xLabel["isNum"] && !yLabel["isNum"]) {
    return <HeatmapCorrelation dashboardID={dashboardID} labels={labels} />;
  } else if (xLabel["isNum"] && yLabel["isNum"]) {
    return <ScatterCorrelation dashboardID={dashboardID} labels={labels} />;
  } else {
    const [catLabel, numLabel] = !xLabel["isNum"]
      ? [xLabel, yLabel]
      : [yLabel, xLabel];

    return (
      <ViolinCorrelation
        dashboardID={dashboardID}
        catLabel={catLabel}
        numLabel={numLabel}
      />
    );
  }
};

const HeatmapCorrelation = ({ dashboardID, labels }) => {
  const QUERY = gql`
    query(
      $dashboardID: String!
      $labels: [AttributeInput!]!
      $colorLabel: AttributeInput!
    ) {
      correlation(dashboardID: $dashboardID, labels: $labels) {
        x
        y
        count
      }
      attributeCounts(dashboardID: $dashboardID, label: $colorLabel) {
        label
        value
      }
    }
  `;

  const { data, loading } = useQuery(QUERY, {
    variables: { dashboardID, labels, colorLabel: labels[1] }
  });

  if (loading) {
    return <CircularProgress />;
  }

  const { correlation, attributeCounts } = data;

  const colorData = attributeCounts.map(record => record["value"]);
  const colorScale = getColorScale(labels[1], colorData);

  return <OrdinalFrame {...getXYProps2(correlation, labels, colorScale)} />;
};

const getXYProps2 = (data, labels, colorScale) => ({
  data,
  size: [600, 570],
  margin: { left: 70, bottom: 70, right: 25, top: 70 },

  type: "bar",
  oAccessor: "x",
  rAccessor: "count",
  oLabel: true,
  projection: "horizontal",
  style: d => ({ fill: colorScale(d["y"]), stroke: "white" }),
  axes: [
    { orient: "left", label: labels[0]["label"], tickFormat: d => "" },
    {
      orient: "bottom",
      label: { name: "Counts", locationDistance: 55 }
    }
  ]
});

const ScatterCorrelation = ({ dashboardID, labels }) => {
  const QUERY = gql`
    query($dashboardID: String!, $labels: [AttributeInput!]!) {
      correlation(dashboardID: $dashboardID, labels: $labels) {
        x
        y
        count
      }
    }
  `;

  const { data, loading } = useQuery(QUERY, {
    variables: { dashboardID, labels }
  });

  if (loading) {
    return <CircularProgress />;
  }

  const { correlation } = data;

  return <XYFrame {...getXYProps(correlation, labels)} />;
};

const getXYProps = (data, labels) => {
  const filteredData = data.filter(point => point["count"] !== 0);
  const [maxValue, secondValue, ...restValues] = filteredData
    .map(datum => datum.count)
    .sort((a, b) => a - b)
    .reverse();

  return {
    points: data.filter(point => point["count"] !== 0),
    pointStyle: d => ({
      r: 5,
      fill: "#111111",
      fillOpacity: Math.min(1, d.count / secondValue)
    }),
    size: [600, 595],
    margin: { left: 70, bottom: 70, right: 25, top: 70 },
    xAccessor: "x",
    yAccessor: "y",
    axes: [
      { orient: "left", label: labels[1]["label"] },
      {
        orient: "bottom",
        label: { name: labels[0]["label"], locationDistance: 55 }
      }
    ]
  };
};

const ViolinCorrelation = ({ dashboardID, catLabel, numLabel }) => {
  const QUERY = gql`
    query($dashboardID: String!, $labels: [AttributeInput!]!) {
      correlation(dashboardID: $dashboardID, labels: $labels) {
        x
        y
        count
      }
    }
  `;

  const { data, loading } = useQuery(QUERY, {
    variables: { dashboardID, labels: [numLabel, catLabel] }
  });

  if (loading) {
    return <CircularProgress />;
  }

  const { correlation } = data;

  return <OrdinalFrame {...getOrdinalProps(correlation, catLabel, numLabel)} />;
};

const getOrdinalProps = (data, catLabel, numLabel) => ({
  data,
  size: [600, 1000],
  margin: { left: 70, bottom: 70, right: 25, top: 70 },

  type: "point",
  summaryType: {
    type: "ridgeline",
    useBins: false,
    binValue: b => b[0].count
  },
  projection: "horizontal",

  summaryStyle: {
    fill: "#000",
    fillOpacity: 0.2,
    stroke: "#ac58e5",
    strokeWidth: 0.5
  },
  style: d => ({
    r: 1,
    fill: "none"
  }),
  oAccessor: "y",
  oLabel: true,
  oPadding: 10,
  rAccessor: "x",
  axes: [
    { orient: "left", label: " ", tickFormat: d => "" },
    {
      orient: "bottom",
      label: { name: numLabel["label"], locationDistance: 55 }
    }
  ]
});

export default Correlation;
