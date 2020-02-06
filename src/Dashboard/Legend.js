import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

const Legend = ({ label, data, colorScale, width, onHover }) => {
  const dataNames = getDataNames(data, label);
  const frameProps = {
    data: dataNames.map((name, index) => ({
      type: "legend",
      name,
      colorName: data[index],
      value: 5
    })),
    size: [width * 0.9, 15],
    type: "bar",
    projection: "horizontal",

    oAccessor: "type",
    rAccessor: "value",

    style: d => ({ fill: colorScale(d["data"].colorName), stroke: "white" }),

    pieceHoverAnnotation: true,
    tooltipContent: d => (
      <div className="tooltip-content">
        <p>{d.name}</p>
      </div>
    ),
    customHoverBehavior: d => {
      onHover(d ? { ...label, value: d["name"] } : null);
    }
  };

  return <OrdinalFrame {...frameProps} />;
};

const getDataNames = (data, label) => {
  if (label["isNum"]) {
    const binSize = data[1] - data[0];
    return data.map(
      datum => `${datum.toString()} - ${(datum + binSize).toString()}`
    );
  }
  return data;
};

export default Legend;
