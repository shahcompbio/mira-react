import React, { useRef, useEffect } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";

import {
  scaleLinear,
  scalePoint,
  scaleSequential,
  scaleOrdinal
} from "d3-scale";
import {
  interpolateRainbow,
  interpolateYlGnBu,
  interpolateOrRd
} from "d3-scale-chromatic";

import { legendColor } from "d3-svg-legend";
import { select } from "d3-selection";
import { getCelltypeColors } from "./getColors";

const QUERY = gql`
  query(
    $dashboardType: String!
    $dashboardID: String!
    $prop: DashboardAttributeInput!
  ) {
    dashboardAttributeValues(
      type: $dashboardType
      dashboardID: $dashboardID
      prop: $prop
    ) {
      label
    }
  }
`;

const Legend = ({ colorScale }) => {
  const d3Container = useRef(null);
  const [dashboardType, dashboardID] = [useDashboardType(), useDashboardID()];

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, dashboardID, props: labels }
  });
  useEffect(() => {
    const svg = select(d3Container.current);

    svg.append("g").attr("class", "legendSequential");

    var legendSequential = legendColor()
      .shapeWidth(30)
      .cells(10)
      .orient("horizontal")
      .scale(scaleSequential(interpolateRainbow).domain([0, 1]));

    svg.select(".legendSequential").call(legendSequential);
  }, [d3Container.current, data === undefined]);

  return <svg className="legend" width={400} height={50} ref={d3Container} />;
};

export default Legend;
