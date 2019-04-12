import React from "react";

import { OrdinalFrame, XYFrame } from "semiotic";

import { scalePow } from "d3-scale";
import { curveCardinal } from "d3-shape";

import { getColorGradient } from "./colors";

const AbundancePlot = ({ data, colorScale, hoverBehavior, label }) => {
  if (label.type === "categorical") {
    const frameProps = getFrameProps(data, colorScale, label.title);
    return <OrdinalFrame {...frameProps} customHoverBehavior={hoverBehavior} />;
  } else {
    const frameProps = getFramePropsLine(data, colorScale);
    return <XYFrame {...frameProps} customHoverBehavior={hoverBehavior} />;
  }
};

const getFramePropsLine = (data, colorScale) => ({
  lines: [{ coordinates: data }],

  size: [300, 300],
  margin: 70,

  xAccessor: "name",
  yAccessor: "count",
  lineType: { type: "line", interpolator: curveCardinal, y1: () => 0 },
  pointStyle: d => {
    return { fill: colorScale(d.name), stroke: "#c0c0c0", r: 4 };
  },
  lineStyle: (d, i) => ({
    stroke: "#c0c0c0",
    strokeWidth: 1,
    fill: "url(#grad1)",
    fillOpacity: 0.8
  }),
  axes: [
    { orient: "left", label: "# Cells" },
    {
      orient: "bottom",
      label: { name: "Expression Level", locationDistance: 55 }
    }
  ],
  showLinePoints: "top",

  hoverAnnotation: true,
  additionalDefs: getColorGradient(data.map(labelValue => labelValue.name)),
  tooltipContent: d => {
    return (
      <div className="tooltip-content">
        <p>ID: {d.name}</p>
        <p>Count: {d.count}</p>
      </div>
    );
  }
});

const getFrameProps = (data, colorScale, title) => {
  return {
    data: data,

    size: [300, 300],
    margin: 70,

    type: "bar",
    rAccessor: "count",
    rScaleType: scalePow().exponent(0.7),
    oAccessor: "name",
    axes: [{ orient: "left", label: " " }],
    style: d => ({ fill: colorScale(d.name), stroke: "white" }),

    title: `${title} Abundances`,
    hoverAnnotation: true,
    tooltipContent: ({ pieces }) => {
      return (
        <div className="tooltip-content">
          <p>ID: {pieces[0].name}</p>
          <p>Count: {pieces[0].count}</p>
        </div>
      );
    }
  };
};

export default AbundancePlot;
