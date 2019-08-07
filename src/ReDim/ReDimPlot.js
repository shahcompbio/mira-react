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
  currTitle,
  existingCells
}) => {
  const getMostAbundant = (positions, title) => {
    if (title !== null) {
      if (title === "Cell Types") {
        const allExistingCells = existingCells.map(element => ({
          point: element,
          count: 0
        }));

        const allPoints = positions.map(point => point.celltype);

        allPoints.map(
          element => allExistingCells[existingCells.indexOf(element)].count++
        );

        let highestCount = 0;

        allExistingCells.filter(element =>
          element.count > highestCount
            ? (highestCount = element.count)
            : highestCount
        );

        for (let i = 0; i < allExistingCells.length; i++) {
          if (highestCount === 0) {
            return "empty";
          } else if (allExistingCells[i].count === highestCount) {
            return allExistingCells[i].point;
          }
        }
      }

      return (
        positions.map(element => element.label).reduce((a, b) => a + b, 0) /
        positions.length
      );
    }
  };

  const frameProps = getFrameProps(
    data,
    colorScale,
    highlighted,
    labelTitle,
    height,
    width,
    title,
    currTitle,
    getMostAbundant
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
  currTitle,
  getMostAbundant
) => ({
  summaries: data,

  points: data,

  size: [width, height],
  margin: { left: 25, bottom: 90, right: 10, top: 10 },

  summaryType: { type: "hexbin", bins: 0.04 },

  xAccessor: "x",
  yAccessor: "y",

  canvasPoints: true,

  canvasAreas: true,

  summaryStyle: d => {
    const mostAbundant = getMostAbundant(d.data, title);
    // const obj =
    //   currTitle === "Cell Types"
    //     ? { celltype: getMostAbundant(d.data, "Cell Types") }
    //     : { label: getMostAbundant(d.data, "Gene Expression") };
    return {
      fill: colorScale(mostAbundant),
      // stroke:
      //   highlighted === null || highlighted(obj)
      //     ? colorScale(mostAbundant)
      //     : null,
      // fillOpacity: highlighted === null || highlighted(obj) ? 0.8 : 0.01,
      strokeOpacity: 0.5,
      fillOpacity: 0.3
    };
  },

  pointStyle: d => {
    console.log("hi");
    return {
      r: 4,
      fill:
        highlighted !== null && highlighted(d)
          ? colorScale(title === "Cell Types" ? d.celltype : d.label)
          : null,
      stroke:
        highlighted !== null && highlighted(d)
          ? colorScale(title === "Cell Types" ? d.celltype : d.label)
          : null,
      //fillOpacity: highlighted === null || highlighted(d) ? 0.8 : 0.01,
      strokeOpacity: 0.8
    };
  },
  axes: [
    { orient: "left", label: " " },
    { orient: "bottom", label: { name: " ", locationDistance: 55 } }
  ]
  // hoverAnnotation: true,

  // tooltipContent: d => {
  //   return (
  //     <div className="tooltip-content">
  //       <p>
  //         {title === "Cell Types" ? "Cell Type" : labelTitle}:{" "}
  //         {title === "Cell Types" ? d.celltype : d.label}
  //       </p>
  //     </div>
  //   );
  // }
});

export default ReDimPlot;
