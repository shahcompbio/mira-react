import React from "react";

import { scalePoint, scaleSequential } from "d3-scale";
import { interpolateRainbow, interpolateYlGnBu } from "d3-scale-chromatic";

export const getColorScale = (data, type) => {
  const ordinalScale = getOrdinalScale(data);

  const toColorScale = scaleSequential(
    type === "categorical" ? interpolateRainbow : interpolateYlGnBu
  ).domain([0, 1]);

  return datum => toColorScale(ordinalScale(datum));
};

export const getColorGradient = data => {
  const ordinalScale = getOrdinalScale(data);

  const toColorScale = scaleSequential(interpolateYlGnBu).domain([0, 1]);

  const gradientStops = data.map(datum => {
    return (
      <stop
        offset={`${ordinalScale(datum) * 100}%`}
        style={{ stopColor: toColorScale(ordinalScale(datum)), stopOpacity: 1 }}
      />
    );
  });

  const linearGradients = [
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      {gradientStops}
    </linearGradient>
  ];

  return linearGradients;
};

const getOrdinalScale = data =>
  scalePoint()
    .domain(data)
    .range([0, 0.9]);
