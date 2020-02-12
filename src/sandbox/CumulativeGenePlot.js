import React, { useState } from "react";
import XYFrame from "semiotic/lib/XYFrame";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/react-hooks";

import Correlation from "./Correlation";
import gql from "graphql-tag";

const TEST_DASHBOARDID = "SPECTRUM-OV-014_CD45P";
const TEST_DASHBOARDTYPE = "patient";

const TEST_ID = "SPECTRUM-OV-014_CD45P";
const TEST_LABEL = { label: "celltype", type: "CELL" };
const GENES = ["CD2", "CD4", "VIM", "CAV1", "PTPRC"];

const QUERY_CUMULATIVE_GENES = gql`
  query($dashboardID: String!, $genes: [String!]!) {
    cumulativeGenes(dashboardID: $dashboardID, genes: $genes) {
      x
      y
      value
    }
  }
`;

const getCumulativeGenes = (ID, GENES) => {
  const { data, loading } = useQuery(QUERY_CUMULATIVE_GENES, {
    variables: {
      dashboardID: ID,
      genes: GENES
    }
  });

  if (loading && !data) {
    return null;
  }
  // console.log(data);
  return data.cumulativeGenes;
};

const SamplePatientDropdown = () => {};

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
  // TODO: add drop down to select sample/patient
  // TODO: add text box that parses and stores labels, then pass to query that will give you density plot, then parse results into plot
  const [genes, setGenes] = useState([]);

  const data = getCumulativeGenes(TEST_ID, GENES);

  const density = data;
  const colorScale = datum => "#FFFFFF";

  return (
    <Grid container direction="row">
      <Grid item>
        <GeneTextBox genes={genes} setGenes={setGenes} />
      </Grid>
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: density,
            colorScale
          })}
        />
      </Grid>
    </Grid>
  );
};

const getFrameProps = ({ data, label, highlightedGroup, colorScale }) => ({
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
