import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

const Donut = ({ data, colorScale }) => {
  const frameProps = getFrameProps(data, colorScale);
  return <OrdinalFrame {...frameProps} />;
};

const getFrameProps = (data, colorScale) => {
  return {
    data: data,

    size: [300, 300],
    margin: 70,

    type: { type: "bar", innerRadius: 50 },
    projection: "radial",
    dynamicColumnWidth: "count",

    oAccessor: "id",

    style: d => ({ fill: colorScale(d.id), stroke: "white" }),

    title: "Clusters",

    oLabel: true,
    hoverAnnotation: true,
    tooltipContent: ({ pieces }) => {
      return (
        <div className="tooltip-content">
          <p>ID: {pieces[0].id}</p>
          <p>Count: {pieces[0].count}</p>
        </div>
      );
    }
  };
};

export default Donut;
