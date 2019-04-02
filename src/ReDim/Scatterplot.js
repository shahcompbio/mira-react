import React from "react";

import XYFrame from "semiotic/lib/XYFrame";

const Scatterplot = ({ data, colorScale }) => {
  const frameProps = getFrameProps(data, colorScale);

  return <XYFrame {...frameProps} />;
};

const getFrameProps = (data, colorScale) => ({
  points: data,

  size: [700, 500],
  margin: { left: 60, bottom: 90, right: 10, top: 40 },

  xAccessor: "x",
  yAccessor: "y",

  pointStyle: d => ({
    r: 3,
    fill: colorScale(d.cluster),
    stroke: colorScale(d.cluster),
    fillOpacity: 0.8
  }),
  axes: [
    { orient: "left", label: "y" },
    { orient: "bottom", label: { name: "x", locationDistance: 55 } }
  ],
  hoverAnnotation: true,

  tooltipContent: d => {
    return (
      <div className="tooltip-content">
        <p>Cluster: {d.cluster}</p>
      </div>
    );
  }
});

export default Scatterplot;
