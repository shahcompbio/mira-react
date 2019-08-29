import React from "react";

import { scaleLinear, scalePoint, scaleSequential } from "d3-scale";
import {
  interpolateRainbow,
  interpolateYlGnBu,
  interpolateSinebow
} from "d3-scale-chromatic";

export const getColorScale = (data, type, title) => {
  if (type.toLowerCase() === "categorical") {
    if (title === "Site") {
      const ordinalScale = getOrdinalScale(data);
      const toColorScale = scaleSequential(interpolateSinebow).domain([0, 1]);
      return datum => toColorScale(ordinalScale(datum));
    }
    const ordinalScale = getOrdinalScale(data);
    const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
    return datum => toColorScale(ordinalScale(datum));
  } else {
    const lastItem = data[data.length - 1];
    const linearScale = scaleLinear()
      .domain([data[0], lastItem])
      .range([0, 1]);
    const toColorScale = scaleSequential(interpolateYlGnBu).domain([0, 1]);
    return datum => toColorScale(1 - linearScale(datum));
  }

  // return datum => toColorScale(ordinalScale(datum));
};

export const getColorGradient = data => {
  const lastItem = data[data.length - 1];
  const linearScale = scaleLinear()
    .domain([data[0], lastItem])
    .range([0, 1]);
  const toColorScale = scaleSequential(interpolateYlGnBu).domain([0, 1]);

  const gradientStops = data.map(datum => {
    return (
      <stop
        offset={`${linearScale(datum) * 100}%`}
        style={{
          stopColor: toColorScale(1 - linearScale(datum)),
          stopOpacity: 1
        }}
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
