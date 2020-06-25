import { scalePoint, scaleSequential, scaleOrdinal } from "d3-scale";
import {
  interpolateRainbow,
  interpolateViridis,
  interpolateOrRd,
  schemeCategory10,
} from "d3-scale-chromatic";

export const getCelltypeColors = (data) => {
  const ordinalScale = getOrdinalScale(data);
  const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
  return (datum) => toColorScale(ordinalScale(datum));
};

export const getGeneColorScale = (maxExpression) => {
  const toColorScale = scaleSequential(interpolateViridis).domain([
    0,
    maxExpression,
  ]);

  return (datum) => toColorScale(datum);
};

const getOrdinalScale = (data) =>
  scalePoint()
    .domain(data)
    .range([0, 0.9]);

export default (label, data) => {
  if (label["isNum"]) {
    // IS GENE
    const maxDataBucket = data[data.length - 1];
    return getGeneColorScale(maxDataBucket);
  } else {
    if (label["label"] === "cell_type") {
      return getCelltypeColors(data);
    } else {
      const toColorScale = scaleOrdinal(schemeCategory10).domain(data);
      return (datum) => toColorScale(datum);
    }
  }
};
