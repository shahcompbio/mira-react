import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

import { scalePow } from "d3-scale";

const Donut = ({ data, colorScale, hoverBehavior, title }) => {
  const frameProps = getFrameProps(data, colorScale, title);
  return <OrdinalFrame {...frameProps} customHoverBehavior={hoverBehavior} />;
};

const getFrameProps = (data, colorScale, title) => {
  return {
    data: data,

    size: [300, 300],
    margin: 70,

    // type: { type: "bar", innerRadius: 50 },
    // projection: "radial",
    // dynamicColumnWidth: "count",

    type: "bar",
    rAccessor: "count",
    rScaleType: scalePow().exponent(0.7),
    oAccessor: "name",
    axes: [{ orient: "left", label: "Count" }],
    style: d => ({ fill: colorScale(d.name), stroke: "white" }),

    title: title,
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

export default Donut;
