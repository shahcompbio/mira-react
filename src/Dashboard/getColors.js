import { scalePoint, scaleSequential, scaleOrdinal } from "d3-scale";
import {
  interpolateRainbow,
  interpolateYlGnBu,
  interpolateOrRd,
  schemeCategory10
} from "d3-scale-chromatic";

export const getCelltypeColors = data => {
  const ordinalScale = getOrdinalScale(data);
  const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
  return datum => toColorScale(ordinalScale(datum));
};

const getOrdinalScale = data =>
  scalePoint()
    .domain(data)
    .range([0, 0.9]);

export default (label, data) => {
  if (label["label"] === "celltype") {
    return getCelltypeColors(data);
  } else if (label["type"] === "CELL") {
    const toColorScale = scaleSequential(interpolateOrRd).domain([-0.2, 1]);
    return datum => toColorScale(datum);
  } else if (label["type"] === "SAMPLE") {
    const toColorScale = scaleOrdinal(schemeCategory10).domain(
      data.map(datum => datum["label"])
    );
    return datum => toColorScale(datum);
  } else {
    const maxDataBucket = data[data.length - 1];
    const toColorScale = scaleSequential(interpolateYlGnBu).domain([
      maxDataBucket["label"],
      0
    ]);

    return datum => toColorScale(datum);
  }
};
