import React, { useState } from "react";
import XYFrame from "semiotic/lib/XYFrame";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/react-hooks";

import { getGeneColorScale } from "../Dashboard/getColors";

import gql from "graphql-tag";

const TEST_ID = "SPECTRUM-OV-002";

const QUERY_CUMULATIVE_GENES = gql`
  query($dashboardID: String!, $genes: [String!]!) {
    cumulativeGenes(dashboardID: $dashboardID, genes: $genes) {
      x
      y
      value
    }
  }
`;

const GeneTextBox = ({ setGenes }) => {
  const [text, setText] = useState("");
  return (
    <div>
      <TextField
        label="Input genes"
        multiline
        rows="4"
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <Button onClick={() => setGenes(textToGenes(text))}>Submit</Button>
    </div>
  );
};

const genesToText = genes => {
  if (genes.length === 0) {
    return "";
  }

  const [firstGene, ...restGenes] = genes;

  return restGenes.reduce((str, gene) => `${str},${gene}`, firstGene);
};

const textToGenes = text => text.split(",").map(gene => gene.trim());

const CumulativeGenePlot = () => {
  const [genes, setGenes] = useState([]);

  const { data, loading } = useQuery(QUERY_CUMULATIVE_GENES, {
    variables: {
      dashboardID: TEST_ID,
      genes: genes
    }
  });

  return (
    <Grid container direction="row">
      <Grid item>
        <GeneTextBox genes={genes} setGenes={setGenes} />
      </Grid>
      <Grid item>
        {loading ? (
          <CircularProgress />
        ) : (
          <XYFrame
            {...getFrameProps({
              data: data.cumulativeGenes,
              colorScale: getGeneColorScale(
                Math.max(...data.cumulativeGenes.map(bin => bin["value"]))
              )
            })}
          />
        )}
      </Grid>
    </Grid>
  );
};

const getFrameProps = ({ data, colorScale }) => ({
  points: data,
  pointStyle: d => ({
    r: 2,
    fill: colorScale(d["value"])
  }),

  size: [500, 500],
  margin: { left: 25, bottom: 45, right: 25, top: 0 },

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

export default CumulativeGenePlot;
