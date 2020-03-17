import React, { useState, useEffect } from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

const Legend = ({
  label,
  data,
  colorScale,
  width,
  onHover,
  highlightedGroup
}) => {
  if (label["isNum"]) {
    const extent =
      highlightedGroup && label["label"] === highlightedGroup["label"]
        ? highlightedGroup["value"]
        : null;
    return (
      <NumericalLegend
        data={data}
        colorScale={colorScale}
        setExtent={e => (e ? onHover({ ...label, value: e }) : onHover(null))}
        extent={extent}
      />
    );
  } else {
    return (
      <CategoricalLegend
        data={data}
        colorScale={colorScale}
        onHover={onHover}
        width={width}
        label={label}
      />
    );
  }
};

const getMaxValue = data => {
  const binSize = data[1] - data[0];
  return data[data.length - 1] + binSize;
};

const NumericalLegend = ({ data, colorScale, extent, setExtent }) => {
  const maxValue = getMaxValue(data);
  const frameProps = {
    data: [maxValue],
    size: [500, 45],
    margin: { left: 25, bottom: 25, right: 25 },
    type: "bar",
    projection: "horizontal",
    style: () => ({
      fill: "url(#gradient)"
    }),
    additionalDefs: [
      <linearGradient key="gradient" x1="0" x2="1" y1="0" y2="0" id="gradient">
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map(percent => (
          <stop
            stopColor={colorScale(percent * maxValue)}
            offset={`${percent * 100}%`}
          />
        ))}
      </linearGradient>
    ],
    axes: [
      {
        orient: "bottom",
        ticks: 2,
        tickValues: [0, Math.round(maxValue * 100) / 100]
      }
    ],
    interaction: {
      columnsBrush: true,
      startEmpty: true,
      extent: { singleColumn: extent },
      end: e => setExtent(e)
    }
  };

  return <OrdinalFrame {...frameProps} />;
};

const CategoricalLegend = ({ data, colorScale, onHover, width, label }) => {
  const [dataClick, setDataClick] = useState(
    data.reduce(
      (dataClickMap, datum) => ({ ...dataClickMap, [datum]: false }),
      {}
    )
  );

  useEffect(() => {
    const clicked = data.filter(datum => dataClick[datum]);
    onHover(
      clicked.length === 0
        ? null
        : {
            ...label,
            value: clicked
          }
    );
  }, [dataClick]);

  const frameProps = {
    data: data.map((name, index) => ({
      type: "legend",
      name,
      colorName: data[index],
      value: 5
    })),
    size: [width * 0.9, 20],
    type: "bar",
    projection: "horizontal",

    oAccessor: "type",
    rAccessor: "value",

    style: d => ({
      fill: colorScale(d["data"].colorName),
      stroke: dataClick[d["name"]] ? "#33322f" : "white",
      strokeWidth: "1px"
    }),

    pieceHoverAnnotation: true,
    tooltipContent: d => (
      <div className="tooltip-content">
        <p>{d.name}</p>
      </div>
    ),
    customClickBehavior: d => {
      setDataClick({ ...dataClick, [d["name"]]: !dataClick[d["name"]] });
    }
  };

  return <OrdinalFrame {...frameProps} />;
};

export default Legend;
