import React from "react";

import XYFrame from "semiotic/lib/XYFrame";

const ReDimPlot = ({ data, colorScale, highlighted, labelTitle }) => {
  const frameProps = getFrameProps(data, colorScale, highlighted, labelTitle);
  return <XYFrame {...frameProps} />;
};

const getFrameProps = (data, colorScale, highlighted, labelTitle) => ({
  points: data,

  size: [700, 500],
  margin: { left: 60, bottom: 90, right: 10, top: 40 },

  xAccessor: "x",
  yAccessor: "y",
  canvasPoints: true,
  pointStyle: d => ({
    r: 4,
    fill: colorScale(d.label),
    stroke:
      highlighted === null || highlighted(d) ? colorScale(d.label) : "#c7c7c7",
    fillOpacity: highlighted === null || highlighted(d) ? 0.8 : 0.01
  }),
  axes: [
    { orient: "left", label: " " },
    { orient: "bottom", label: { name: " ", locationDistance: 55 } }
  ],
  hoverAnnotation: true,

  tooltipContent: d => {
    return (
      <div className="tooltip-content">
        <p>
          {labelTitle}: {d.label}
        </p>
      </div>
    );
  }
});

export default ReDimPlot;
