import React, { useState } from "react";
import XYFrame from "semiotic/lib/XYFrame";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/react-hooks";

import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { getGeneColorScale } from "../Dashboard/getColors";

import gql from "graphql-tag";

const TEST_ID = "SPECTRUM-OV-002";

const QUERY_CUMULATIVE_GENES = gql`
  query($dashboardID: String!, $genes: [String!]!, $genes2: [String!]!) {
    cumulativeGenes(dashboardID: $dashboardID, genes: $genes) {
      x
      y
      value
    }
    geneStats(dashboardID: $dashboardID, genes: $genes2) {
      name
      stat
    }
  }
`;

const CumulativeGenePlot = () => {
  const [genes, setGenes] = useState([]);
  const [highlightGene, setHighlightGene] = useState(null);
  const { data, loading } = useQuery(QUERY_CUMULATIVE_GENES, {
    variables: {
      dashboardID: TEST_ID,
      genes: highlightGene ? [highlightGene] : genes,
      genes2: genes
    }
  });

  if (loading && !data) {
    return (
      <BaseChart genes={genes} setGenes={setGenes}>
        <Grid item>
          <CircularProgress />
        </Grid>
      </BaseChart>
    );
  }

  const density = data.cumulativeGenes;
  const colorScale = getGeneColorScale(
    Math.max(...density.map(bin => bin["value"]))
  );

  return (
    <BaseChart genes={genes} setGenes={setGenes}>
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: density,
            colorScale
          })}
        />
      </Grid>
      <Grid item>
        <GeneTable genes={data.geneStats} setHighlightGene={setHighlightGene} />
      </Grid>
    </BaseChart>
  );
};

const GeneTable = ({ genes, setHighlightGene }) => (
  <List
    dense={true}
    subheader={<ListSubheader component="div">Valid Genes</ListSubheader>}
  >
    {genes.map(gene => (
      <ListItem
        key={gene["name"]}
        onMouseEnter={() => {
          setHighlightGene(gene["name"]);
        }}
        onMouseLeave={() => {
          setHighlightGene(null);
        }}
      >
        <ListItemText primary={gene["name"]} />
      </ListItem>
    ))}
  </List>
);

const BaseChart = ({ genes, setGenes, children }) => (
  <Paper
    style={{
      margin: "40px 40px",
      padding: "40px 20px"
    }}
  >
    <Grid container direction="row">
      <Grid item>
        <GeneTextBox genes={genes} setGenes={setGenes} />
      </Grid>
      {children}
    </Grid>
  </Paper>
);

const GeneTextBox = ({ setGenes }) => {
  const [text, setText] = useState("");
  return (
    <Grid container direction="column">
      <Grid item>
        <TextField
          label="Input genes"
          multiline
          variant="outlined"
          rows="4"
          value={text}
          onChange={event => setText(event.target.value)}
        />
      </Grid>
      <Grid item>
        <Button onClick={() => setGenes(textToGenes(text))}>Submit</Button>
      </Grid>
    </Grid>
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
