import { scalePoint, scaleSequential } from "d3-scale";
import { interpolateRainbow } from "d3-scale-chromatic";

const COLORS = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075"
];

export const getColorScale = data => {
  const ordinalScale = scalePoint()
    .domain(data)
    .range([0, 0.8]);

  const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
  return datum => toColorScale(ordinalScale(datum));
};
