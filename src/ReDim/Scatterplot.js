import React from "react";

import XYFrame from "semiotic/lib/XYFrame";

const Scatterplot = ({ data, colorScale, highlighted }) => {
  const frameProps = getFrameProps(data, colorScale, highlighted);

  return <XYFrame {...frameProps} />;
};

const getFrameProps = (data, colorScale, highlighted) => ({
  points: data,

  size: [700, 500],
  margin: { left: 60, bottom: 90, right: 10, top: 40 },

  xAccessor: "x",
  yAccessor: "y",
  canvasPoints: true,
  pointStyle: d => ({
    r: 4,
    fill:
      !highlighted || highlighted === d.cluster
        ? colorScale(d.cluster)
        : "#808080",
    stroke:
      !highlighted || highlighted === d.cluster
        ? colorScale(d.cluster)
        : "#808080",
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
