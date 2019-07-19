import React from "react";

import XYFrame from "semiotic/lib/XYFrame";

const ReDimPlot = ({
  data,
  colorScale,
  highlighted,
  labelTitle,
  height,
  width,
  title
}) => {
  const frameProps = getFrameProps(
    data,
    colorScale,
    highlighted,
    labelTitle,
    height,
    width
  );
  return (
    <div>
      <h3>
        <center>{title}</center>
      </h3>
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
  width
) => ({
  points: data,

  size: [width, height],
  margin: { left: 25, bottom: 90, right: 10, top: 10 },

  xAccessor: "x",
  yAccessor: "y",
  canvasPoints: true,
  pointStyle: d => ({
    r: 4,
    fill: colorScale(d.label),
    stroke:
      labelTitle !== "Cell Type" && typeof d.label === "string"
        ? colorScale(d.label)
        : highlighted === null || highlighted(d)
        ? colorScale(d.label)
        : "#c7c7c7",
    fillOpacity:
      labelTitle !== "Cell Type" && typeof d.label === "string"
        ? 0.8
        : highlighted === null || highlighted(d)
        ? 0.8
        : 0.01
  }),
  axes: [
    { orient: "left", label: " " },
    { orient: "bottom", label: { name: " ", locationDistance: 55 } }
  ],
  hoverAnnotation: true,

  tooltipContent: d => {
    console.log(labelTitle);
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
