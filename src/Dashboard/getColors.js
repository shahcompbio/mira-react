import { scalePoint, scaleSequential, scaleOrdinal } from "d3-scale";
import {
  interpolateRainbow,
  interpolateViridis,
  interpolateOrRd,
  schemeCategory10
} from "d3-scale-chromatic";

export const getCelltypeColors = data => {
  const ordinalScale = getOrdinalScale(data);
  const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
  return datum => toColorScale(ordinalScale(datum));
};

export const getGeneColorScale = maxExpression => {
  const toColorScale = scaleSequential(interpolateViridis).domain([
    0,
    maxExpression
  ]);

  return datum => toColorScale(datum);
};

const getOrdinalScale = data =>
  scalePoint()
    .domain(data)
    .range([0, 0.9]);

export default (label, data) => {
  if (label["isNum"]) {
    if (label["type"] === "CELL") {
      const toColorScale = scaleSequential(interpolateOrRd).domain([-0.2, 1]);
      return datum => toColorScale(datum);
    } else {
      // IS GENE
      const maxDataBucket = data[data.length - 1];

      return getGeneColorScale(maxDataBucket);
    }
  } else {
    if (label["type"] === "CELL") {
      return getCelltypeColors(data);
    } else {
      // IS SAMPLE
      const toColorScale = scaleOrdinal(schemeCategory10).domain(data);
      return datum => toColorScale(datum);
    }
  }
};
