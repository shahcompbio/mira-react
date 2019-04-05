import { scalePoint, scaleSequential } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";

export const getColorScale = data => {
  const ordinalScale = scalePoint()
    .domain(data)
    .range([0, 0.8]);

  const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
  return datum => toColorScale(ordinalScale(datum));
};
