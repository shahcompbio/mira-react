import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

const Legend = ({ label, data, colorScale, width, onHover }) => {
  const dataNames =
    label["label"] === "celltype" ? data : data.map(datum => datum["label"]);

  const frameProps = {
    data: dataNames.map(name => ({ type: "legend", name, value: 5 })),
    size: [width * 0.9, 15],
    type: "bar",
    projection: "horizontal",

    oAccessor: "type",
    rAccessor: "value",

    style: d => ({ fill: colorScale(d["data"].name), stroke: "white" }),

    pieceHoverAnnotation: true,
    tooltipContent: d => (
      <div className="tooltip-content">
        <p>{d.name}</p>
      </div>
    ),
    customHoverBehavior: d => {
      onHover(d ? { label: label["label"], value: d["name"] } : null);
    }
  };

  return <OrdinalFrame {...frameProps} />;
};

export default Legend;
