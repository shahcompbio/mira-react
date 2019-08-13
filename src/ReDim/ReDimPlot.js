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
  existingCells
}) => {
  const highlightedCells = data.filter(
    element => highlighted !== null && highlighted(element) === true
  );

  const getMostAbundant = positions => {
    if (title === "Cell Types") {
      const allExistingCells = existingCells.map(element => ({
        point: element,
        count: 0
      }));

      positions
        .map(point => point.celltype)
        .map(
          element => allExistingCells[existingCells.indexOf(element)].count++
        );

      let highestCount = 0;
      let highestName = "";

      for (let i = 0; i < allExistingCells.length; i++) {
        if (allExistingCells[i].count > highestCount) {
          highestCount = allExistingCells[i].count;
          highestName = allExistingCells[i].point;
        }
      }

      return highestName;
    }

    return (
      positions.map(element => element.label).reduce((a, b) => a + b, 0) /
      positions.length
    );
  };

  const frameProps = getFrameProps(
    data,
    colorScale,
    labelTitle,
    height,
    width,
    title,
    getMostAbundant,
    highlightedCells
  );

  return (
    <div>
      <center>
        <h3>
          {title} {title === labelTitle ? " Expression" : ""}
        </h3>
      </center>
      <XYFrame {...frameProps} />
    </div>
  );
};

const getFrameProps = (
  data,
  colorScale,
  labelTitle,
  height,
  width,
  title,
  getMostAbundant,
  highlightedCells
) => ({
  summaries: data,

  points: highlightedCells,

  size: [width, height],
  margin: { left: 25, bottom: 90, right: 10, top: 10 },

  summaryType: {
    type: "hexbin",
    bins: 0.04
  },

  xAccessor: "x",
  yAccessor: "y",

  canvasPoints: true,

  canvasAreas: true,

  summaryStyle: d => ({
    fill: colorScale(getMostAbundant(d.data)),
    fillOpacity: 0.3
  }),

  pointStyle: d => ({
    r: 4,
    fill: colorScale(title === "Cell Types" ? d.celltype : d.label)
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
