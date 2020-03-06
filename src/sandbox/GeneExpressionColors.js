import React, { useState } from "react";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import { AnalysisSelect, GeneTextBox } from "./CumulativeGenePlot";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import XYFrame from "semiotic/lib/XYFrame";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";

import { getGeneColorScale } from "../Dashboard/getColors";
import { scaleSequential, scaleLinear } from "d3-scale";
import { interpolateInferno, interpolateViridis } from "d3-scale-chromatic";
import { interpolateHcl, rgb } from "d3";

const GeneExpressionColors = () => {
  const [genes, setGenes] = useState([]);
  const [highlightGene, setHighlightGene] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  return (
    <Paper
      style={{
        margin: "40px 40px",
        padding: "40px 20px"
      }}
    >
      <Grid item>
        <AnalysisSelect dashboard={dashboard} setDashboard={setDashboard} />
      </Grid>
      {dashboard ? (
        <Grid container direction="row" style={{ flexWrap: "nowrap" }}>
          <Grid item>
            <GeneTextBox
              genes={genes}
              setGenes={setGenes}
              highlightGene={highlightGene}
              setHighlightGene={setHighlightGene}
              dashboardID={dashboard["id"]}
            />
          </Grid>
          <Grid item>
            <GenePlot
              dashboardID={dashboard["id"]}
              genes={highlightGene ? [highlightGene] : genes}
            />
          </Grid>
        </Grid>
      ) : null}
    </Paper>
  );
};

const GenePlot = ({ dashboardID, genes, highlightedGroup }) => {
  const QUERY = gql`
    query(
      $dashboardID: String!
      $genes: [String!]!
      $highlightedGroup: AttributeInput
    ) {
      cumulativeGenes(
        dashboardID: $dashboardID
        genes: $genes
        highlightedGroup: $highlightedGroup
      ) {
        x
        y
        value
      }
    }
  `;

  const { data, loading } = useQuery(QUERY, {
    variables: {
      dashboardID: dashboardID,
      genes: genes,
      highlightedGroup
    }
  });

  if (loading && !data) {
    return <CircularProgress />;
  }

  const density = data.cumulativeGenes;
  const maxValue = Math.max(...density.map(bin => bin["value"]));
  const colorScale1 = datum =>
    scaleSequential(interpolateViridis).domain([0, maxValue])(datum);
  const colorScale1Grey = datum => (datum === 0 ? "#ccc" : colorScale1(datum));

  const colorScale2 = datum =>
    scaleSequential(interpolateInferno).domain([
      maxValue * -0.2,
      maxValue * 1.1
    ])(datum);

  const colorScale2Grey = datum => (datum === 0 ? "#ccc" : colorScale2(datum));

  const colorScale3 = datum =>
    scaleSequential(interpolateHcl)
      .domain([0, maxValue])
      .range([rgb("#153ed4"), rgb("#ff661f")])(datum);

  const colorScale3Grey = datum => (datum === 0 ? "#ccc" : colorScale3(datum));

  return (
    <Grid container direction="column">
      <Grid container direction="row">
        <Grid item>
          <OnePlot
            index={0}
            data={density}
            colorScale={colorScale1}
            maxValue={maxValue}
          />
        </Grid>
        <Grid item>
          <OnePlot
            index={0}
            data={density}
            colorScale={colorScale1Grey}
            maxValue={maxValue}
          />
        </Grid>
        <Grid item style={{ backgroundColor: "#555" }}>
          <OnePlot
            index={0}
            data={density}
            colorScale={colorScale1}
            maxValue={maxValue}
          />
        </Grid>
        <Grid container direction="row">
          <Grid item>
            <OnePlot
              index={1}
              data={density}
              colorScale={colorScale2}
              maxValue={maxValue}
            />
          </Grid>
          <Grid item>
            <OnePlot
              index={1}
              data={density}
              colorScale={colorScale2Grey}
              maxValue={maxValue}
            />
          </Grid>
          <Grid item style={{ backgroundColor: "#555" }}>
            <OnePlot
              index={1}
              data={density}
              colorScale={colorScale2}
              maxValue={maxValue}
            />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item>
            <OnePlot
              index={2}
              data={density}
              colorScale={colorScale3}
              maxValue={maxValue}
            />
          </Grid>
          <Grid item>
            <OnePlot
              index={2}
              data={density}
              colorScale={colorScale3Grey}
              maxValue={maxValue}
            />
          </Grid>
          <Grid item style={{ backgroundColor: "#555" }}>
            <OnePlot
              index={2}
              data={density}
              colorScale={colorScale3}
              maxValue={maxValue}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const OnePlot = ({ index, data, colorScale, maxValue }) => (
  <Grid container direction="column">
    <Grid item>
      <XYFrame
        {...getFrameProps({
          data,
          colorScale
        })}
      />
    </Grid>
    <Grid item>
      <GeneLegend index={index} maxValue={maxValue} colorScale={colorScale} />
    </Grid>
  </Grid>
);

const GeneLegend = ({ index, maxValue, colorScale }) => {
  const frameProps = {
    data: [maxValue],
    size: [450, 45],
    margin: { left: 25, bottom: 25, right: 25 },
    type: "bar",
    projection: "horizontal",

    style: () => ({
      fill: `url(#gradient_${index})`
    }),
    additionalDefs: [
      <linearGradient
        key={`gradient_${index}`}
        x1="0"
        x2="1"
        y1="0"
        y2="0"
        id={`gradient_${index}`}
      >
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
    ]
  };

  return <OrdinalFrame {...frameProps} />;
};

const getFrameProps = ({ data, colorScale }) => ({
  points: data,
  pointStyle: d => ({
    r: 2,
    fill: d["value"] === "" ? "#eee" : colorScale(d["value"])
  }),

  size: [450, 570],
  margin: { left: 25, bottom: 45, right: 25, top: 70 },

  xAccessor: "x",
  yAccessor: "y",

  // canvasPoints: true,

  axes: [
    { orient: "left", label: " ", tickFormat: d => "" },
    {
      orient: "bottom",
      label: { name: " ", locationDistance: 55 },
      tickFormat: d => ""
    }
  ]
});

export default GeneExpressionColors;
