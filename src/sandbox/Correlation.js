import React from "react";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { CircularProgress } from "@material-ui/core";

import XYFrame from "semiotic/lib/XYFrame";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";

import { curveCatmullRom } from "d3";

// TODO: complete
const Correlation = ({ dashboardID, dashboardType, labels }) => {
  const [xLabel, yLabel] = labels;

  if (!xLabel["isNum"] && !yLabel["isNum"]) {
    return "Not supported";
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

const ScatterCorrelation = ({ dashboardID, labels }) => {
  const QUERY = gql`
    query($dashboardID: String!, $labels: [AttributeInput!]!) {
      correlation(dashboardID: $dashboardID, labels: $labels) {
        x
        y
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

const getXYProps = (data, labels) => ({
  summaries: [{ coordinates: data }],
  summaryType: { type: "trendline" },
  summaryStyle: { fill: "none", stroke: "#ac58e5", strokeWidth: 2 },
  pointStyle: d => ({
    r: 2,
    fill: "#111111"
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
  ],

  showSummaryPoints: true,
  canvasPoints: true
});

const ViolinCorrelation = ({ dashboardID, catLabel, numLabel }) => {
  const QUERY = gql`
    query($dashboardID: String!, $labels: [AttributeInput!]!) {
      correlation(dashboardID: $dashboardID, labels: $labels) {
        x
        y
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
    type: "ridgeline"
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
