import React from "react";

import XYFrame from "semiotic/lib/XYFrame";

const ReDimPlot = ({
  data,
  colorScale,
  highlighted,
  labelTitle,
  height,
  width,
  title,
  currTitle
}) => {
  const frameProps = getFrameProps(
    data,
    colorScale,
    highlighted,
    labelTitle,
    height,
    width,
    title,
    currTitle
  );
  return (
    <div>
      <center>
        <h3>
          {title} {title === labelTitle ? " Expression" : ""}
        </h3>
      </center>
      <XYFrame {...frameProps} />{" "}
    </div>
  );
};

const getFrameProps = (
  data,
  colorScale,
  highlighted,
  labelTitle,
  height,
  width,
  title,
  currTitle
) => ({
  points: data,

  size: [width, height],
  margin: { left: 25, bottom: 90, right: 10, top: 10 },

  xAccessor: "x",
  yAccessor: "y",
  canvasPoints: true,
  pointStyle: d => ({
    r: 4,
    fill: colorScale(title === "Cell Types" ? d.celltype : d.label),
    stroke:
      highlighted === null || highlighted(d)
        ? colorScale((currTitle = "Cell Type" ? d.celltype : d.label))
        : "#c7c7c7",
    fillOpacity: highlighted === null || highlighted(d) ? 0.8 : 0.01,
    strokeOpacity: 0.8
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
          {title === "Cell Types" ? "Cell Type" : labelTitle}:{" "}
          {title === "Cell Types" ? d.celltype : d.label}
        </p>
      </div>
    );
  }
});

export default ReDimPlot;
