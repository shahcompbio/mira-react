import React, { useEffect, useRef } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import getColorScale from "./getColors";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useLocation } from "react-router";
import { useDashboardID } from "../utils/useDashboardInfo";

const QUERY = gql`
  query(
    $dashboardID: String!
    $highlightedGroup: AttributeInput
    $label: AttributeInput!
  ) {
    attributeCounts(
      dashboardID: $dashboardID
      label: $label
      highlightedGroup: $highlightedGroup
    ) {
      label
      value
      count
    }
  }
`;

const AttributeCountPlot = ({ labels, index, highlightedGroup, width }) => {
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
    return <CircularProgress />;
  }

  const { attributeCounts } = data;

  const colorData = attributeCounts.map(record => record["value"]);
  const colorScale = getColorScale(labels[index], colorData);

  return (
    <OrdinalFrame
      {...getFrameProps({
        data: attributeCounts,
        label: labels[index],
        colorScale,
        width
      })}
    />
  );
};

const getFrameProps = ({ data, label, colorScale }) => ({
  data: getDataNames(data, label),
  size: [400, 250],
  margin: { left: 25, bottom: 45, right: 85, top: 40 },

  type: "bar",

  oAccessor: "value",
  rAccessor: "count",
  style: d => ({ fill: colorScale(d["data"].value), stroke: "white" }),
  axes: [
    {
      orient: "right",
      label: "Count"
    }
  ],
  title: label["label"],
  pieceHoverAnnotation: true,
  tooltipContent: d => (
    <div className="tooltip-content">
      <p>{d.name}</p>
      <p>{d.count}</p>
    </div>
  )
});

const getDataNames = (data, label) => {
  if (label["isNum"]) {
    const binSize = data[1]["value"] - data[0]["value"];
    return data.map(datum => ({
      ...datum,
      name: `${datum["value"].toString()} - ${(
        datum["value"] + binSize
      ).toString()}`
    }));
  }
  return data.map(datum => ({ ...datum, name: datum.value }));
};

export default AttributeCountPlot;
