import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import XYFrame from "semiotic/lib/XYFrame";
import getColorScale from "../Dashboard/getColors";

import Legend from "../Dashboard/Legend";

const TEST_ID = "SPECTRUM-OV-014_CD45P";
const TEST_TYPE = "patient";
const TEST_LABEL = { label: "celltype", type: "CELL" };

const QUERY_CELLTYPES = gql`
  query(
    $dashboardType: String!
    $dashboardID: String!
    $highlightedGroup: String
  ) {
    celltypes(type: $dashboardType, dashboardID: $dashboardID) {
      name
    }
    density2(type: $dashboardType, dashboardID: $dashboardID) {
      x
      y
      values {
        celltype
        count
        proportion
      }
    }
    density3(
      type: $dashboardType
      dashboardID: $dashboardID
      highlightedGroup: $highlightedGroup
    ) {
      x
      y
      values {
        label
        value
      }
    }
  }
`;

const DensityPlots = () => {
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const { data, loading } = useQuery(QUERY_CELLTYPES, {
    variables: {
      dashboardType: TEST_TYPE,
      dashboardID: TEST_ID,
      highlightedGroup: !highlightedLabel
        ? highlightedLabel
        : highlightedLabel["value"]
    }
  });

  if (loading && !data) {
    return null;
  }

  const { celltypes, density2, density3 } = data;

  const colorData = celltypes.map(celltype => celltype["name"]);

  const colorScale = getColorScale(TEST_LABEL, colorData);

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <Legend
          data={colorData}
          colorScale={colorScale}
          width={500}
          label={TEST_LABEL}
          onHover={group => setHighlightedLabel(group)}
        />
      </Grid>
      <Grid container direction="row" alignItems="center" justify="center">
        {/* <Grid item>
          <PureScatterplot
            data={cells}
            label={TEST_LABEL}
            highlightedGroup={highlightedLabel}
            colorScale={colorScale}
          />
        </Grid>
        <Grid item>
          <DensityScatterplot
            data={cells}
            label={TEST_LABEL}
            highlightedGroup={highlightedLabel}
            colorScale={colorScale}
          />
        </Grid> */}
        {/* {density.map(bin => (
          <Grid item>
            <Bleck
              data={bin["bin"]}
              size={bin["size"]}
              label={TEST_LABEL}
              highlightedGroup={highlightedLabel}
              colorScale={colorScale}
            />
          </Grid>
        ))} */}
        <Grid item>
          <Bleck
            data={density2}
            size={80}
            label={TEST_LABEL}
            highlightedGroup={highlightedLabel}
            colorScale={colorScale}
          />
        </Grid>
        <Grid item>
          <Bleck2
            data={density3}
            size={80}
            label={TEST_LABEL}
            highlightedGroup={highlightedLabel}
            colorScale={colorScale}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const PureScatterplot = ({ data, highlightedGroup, colorScale, label }) => (
  <XYFrame
    {...{
      ...framePropsBase,
      points: data,

      canvasPoints: true,
      pointStyle: d => {
        return {
          r: 4,
          fill:
            !highlightedGroup || d[label["label"]] === highlightedGroup["value"]
              ? colorScale(d[label["label"]])
              : "#333333",
          stroke: "#eee",
          strokeWidth: 1
        };
      }
    }}
  />
);

const DensityScatterplot = ({ data, label, highlightedGroup, colorScale }) => (
  <XYFrame
    {...{
      ...framePropsBase,
      summaries: data,
      points: highlightedGroup
        ? data.filter(
            datum =>
              datum[highlightedGroup["label"]] === highlightedGroup["value"]
          )
        : [],

      canvasPoints: true,
      summaryType: {
        type: "hexbin",
        bins: 0.03,
        binValue: d => getMaxLabel(d, label)
      },
      summaryStyle: d => ({
        fill: d["value"] === "" ? "#FFFFFF" : colorScale(d["value"]),
        fillOpacity: 0.3
      }),
      pointStyle: d => {
        return {
          r: 4,
          fill: colorScale(d[label["label"]]),
          stroke: "#eee",
          strokeWidth: 1
        };
      }
    }}
  />
);

const Bleck = ({ data, highlightedGroup, colorScale, size }) => (
  <XYFrame
    {...{
      ...framePropsBase,
      points: data,
      pointStyle: d => {
        return {
          r: { 50: 4, 60: 3, 70: 2.5, 80: 2, 90: 2, 100: 1.5 }[size],
          fill: highlightedGroup
            ? getHighlightedColor(
                highlightedGroup["value"],
                d["values"],
                colorScale
              )
            : colorScale(d["values"][0]["celltype"]),
          fillOpacity: highlightedGroup
            ? getHighlightedOpacity(
                highlightedGroup["value"],
                d["values"],
                colorScale
              )
            : 1
        };
      }
    }}
  />
);

const Bleck2 = ({ data, highlightedGroup, colorScale, size }) => {
  const getHighlightedOpacity = (celltype, values, colorScale) => {
    const filteredValues = values.filter(
      record => record["label"] === celltype
    );
    console.log(filteredValues);
    if (filteredValues.length === 0) {
      return 0;
    } else {
      return filteredValues[0]["value"];
    }
  };

  const getHighlightedColor = (celltype, values, colorScale) => {
    const filteredValues = values.filter(
      record => record["label"] === celltype
    );

    if (filteredValues.length === 0) {
      return "#ccc";
    } else {
      return colorScale(filteredValues[0]["label"]);
    }
  };
  return (
    <XYFrame
      {...{
        ...framePropsBase,
        points: data,
        pointStyle: d => {
          return {
            r: { 50: 4, 60: 3, 70: 2.5, 80: 2, 90: 2, 100: 1.5 }[size],
            fill: highlightedGroup
              ? getHighlightedColor(
                  highlightedGroup["value"],
                  d["values"],
                  colorScale
                )
              : colorScale(d["values"][0]["label"]),
            fillOpacity: highlightedGroup
              ? getHighlightedOpacity(
                  highlightedGroup["value"],
                  d["values"],
                  colorScale
                )
              : 1
          };
        }
      }}
    />
  );
};

const getHighlightedOpacity = (celltype, values, colorScale) => {
  const filteredValues = values.filter(
    record => record["celltype"] === celltype
  );

  if (filteredValues.length === 0) {
    return 0;
  } else {
    return filteredValues[0]["proportion"];
  }
};

const getHighlightedColor = (celltype, values, colorScale) => {
  const filteredValues = values.filter(
    record => record["celltype"] === celltype
  );

  if (filteredValues.length === 0) {
    return "#ccc";
  } else {
    return colorScale(filteredValues[0]["celltype"]);
  }
};

const getMaxLabel = (data, label) => {
  if (label["label"] === "celltype" || label["type"] === "SAMPLE") {
    const counts = data
      .map(point => point[label["label"]])
      .reduce(
        (countMap, point) =>
          countMap.hasOwnProperty(point)
            ? { ...countMap, [point]: countMap[point] + 1 }
            : { ...countMap, [point]: 1 },
        {}
      );

    const celltypes = Object.keys(counts);

    return celltypes.length === 0
      ? ""
      : celltypes.reduce(
          (currMax, key) => (counts[key] > counts[currMax] ? key : currMax),
          Object.keys(counts)[0]
        );
  } else {
    const total = data
      .map(point => point[label["label"]])
      .reduce((currSum, point) => currSum + point, 0);

    const count = data.length;

    return total / count;
  }
};

const framePropsBase = {
  size: [500, 500],
  margin: { left: 25, bottom: 45, right: 25, top: 25 },

  xAccessor: "x",
  yAccessor: "y",
  canvasPoints: true, // TODO wanted to turn this off to see transitions; but they're weird...

  axes: [
    { orient: "left", label: " ", tickFormat: d => "" },
    {
      orient: "bottom",
      label: { name: " ", locationDistance: 55 },
      tickFormat: d => ""
    }
  ]
};

export default DensityPlots;
