import React from "react";

import { OrdinalFrame, XYFrame } from "semiotic";

import { scalePow } from "d3-scale";
import { curveCardinal } from "d3-shape";

import { getColorGradient } from "./colors";

const AbundancePlot = ({ data, colorScale, hoverBehavior, label }) => {
  const frameProps = getFrameProps(data, colorScale, label, hoverBehavior);

  return label.type === "categorical" ? (
    <OrdinalFrame {...frameProps} />
  ) : (
    <XYFrame {...frameProps} />
  );
};

const getFrameProps = (data, colorScale, label, hoverBehavior) => {
  const defaultFrameProps = {
    size: [300, 300],
    margin: 70,

    hoverAnnotation: true,

    title: `${label.title} Abundances`
  };

  const tooltipContent = d => (
    <div className="tooltip-content">
      <p>
        <b>{d.name}</b>
      </p>
      <p>{d.count} cells</p>
    </div>
  );

  const additionalFrameProps =
    label.type === "categorical"
      ? getFramePropsBar(data, colorScale, tooltipContent, hoverBehavior)
      : getFramePropsLine(data, colorScale, tooltipContent, hoverBehavior);

  return { ...defaultFrameProps, ...additionalFrameProps };
};

const getFramePropsLine = (
  data,
  colorScale,
  tooltipContent,
  hoverBehavior
) => ({
  lines: [{ coordinates: data }],

  xAccessor: "min",
  yAccessor: "count",
  yScaleType: scalePow().exponent(0.5),
  lineType: { type: "line", interpolator: curveCardinal, y1: () => 0 },
  pointStyle: d => {
    return { fill: colorScale(d.min), r: 1 };
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
      label: { name: "Log Count", locationDistance: 55 }
    }
  ],
  showLinePoints: "top",

  additionalDefs: getColorGradient(data.map(d => d.min)),
  tooltipContent,
  customHoverBehavior: hoverBehavior
});

const getFramePropsBar = (data, colorScale, tooltipContent, hoverBehavior) => ({
  data: data,

  type: "bar",
  rAccessor: "count",
  rScaleType: scalePow().exponent(0.7),
  oAccessor: "name",
  axes: [{ orient: "left", label: "# Cells" }],
  style: d => ({ fill: colorScale(d.name), stroke: "white" }),

  tooltipContent: ({ pieces }) => tooltipContent(pieces[0]),
  customHoverBehavior: d => hoverBehavior(d ? d.pieces[0].data : d)
});

export default AbundancePlot;
