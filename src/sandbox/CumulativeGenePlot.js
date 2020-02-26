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

import ReDimChart from "../Dashboard/ReDimChart";

import gql from "graphql-tag";

const TEST_ID = "SPECTRUM-OV-002";
const TEST_TYPE = "patient";

const CumulativeGenePlot = () => {
  const [genes, setGenes] = useState([]);
  const [highlightGene, setHighlightGene] = useState(null);

  return (
    <Paper
      style={{
        margin: "40px 40px",
        padding: "40px 20px"
      }}
    >
      <Grid container direction="row">
        <Grid item>
          <GeneTextBox
            genes={genes}
            setGenes={setGenes}
            setHighlightGene={setHighlightGene}
          />
        </Grid>
        <Grid item>
          <GenePlot
            dashboardID={TEST_ID}
            genes={highlightGene ? [highlightGene] : genes}
          />
        </Grid>
        <Grid item>
          <ReDimChart
            labels={[{ isNum: false, type: "CELL", label: "celltype" }]}
            index={0}
            onSelect={() => null}
            onLegendHover={() => null}
            highlightedGroup={null}
            width={500}
            dashboardID={TEST_ID}
            dashboardType={TEST_TYPE}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const GenePlot = ({ dashboardID, genes }) => {
  const QUERY = gql`
  query($dashboardID: String!, $genes: [String!]!) {
    cumulativeGenes(dashboardID: $dashboardID, genes: $genes) {
      x
      y
      value
    }
  }
  `;

  const { data, loading } = useQuery(QUERY, {
    variables: {
      dashboardID: dashboardID,
      genes: genes
    }
  });

  if (loading && !data) {
    return <CircularProgress />;
  }

  const density = data.cumulativeGenes;
  const colorScale = getGeneColorScale(
    Math.max(...density.map(bin => bin["value"]))
  );

  return (
    <XYFrame
      {...getFrameProps({
        data: density,
        colorScale
      })}
    />
  );
};

const GeneTable = ({ genes, setHighlightGene }) => {
  const QUERY = gql`
  query($dashboardID: String!, $genes: [String!]!) {
    verifyGenes(dashboardID: $dashboardID, genes: $genes) {
      valid
      invalid
    }
  }
`;

  const { data, loading } = useQuery(QUERY, {
    variables: {
      dashboardID: TEST_ID,
      genes: genes
    }
  });

  if (loading) {
    return <CircularProgress />;
  }

  const { valid, invalid } = data.verifyGenes;

  return (
    <List
      dense={true}
      subheader={<ListSubheader component="div">Valid Genes</ListSubheader>}
    >
      {valid.map(gene => (
        <ListItem
          key={gene}
          onMouseEnter={() => {
            setHighlightGene(gene);
          }}
          onMouseLeave={() => {
            setHighlightGene(null);
          }}
        >
          <ListItemText primary={gene} />
        </ListItem>
      ))}
      {invalid.map(gene => (
        <ListItem key={gene}>
          <ListItemText primary={gene} />
        </ListItem>
      ))}
    </List>
  );
};

const GeneTextBox = ({ genes, setGenes, setHighlightGene }) => {
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
      <Grid item>
        <GeneTable genes={genes} setHighlightGene={setHighlightGene} />
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
