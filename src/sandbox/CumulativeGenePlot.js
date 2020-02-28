import React, { useState } from "react";
import XYFrame from "semiotic/lib/XYFrame";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";

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

import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

import gql from "graphql-tag";

const CumulativeGenePlot = () => {
  const [genes, setGenes] = useState([]);
  const [highlightGene, setHighlightGene] = useState(null);
  const [highlightedGroup, setHighlightedGroup] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [label, setLabel] = useState({
    isNum: false,
    type: "CELL",
    label: "celltype"
  });

  return (
    <Paper
      style={{
        margin: "40px 40px",
        padding: "40px 20px"
      }}
    >
      <Grid container direction="column">
        <Grid item>
          <AnalysisSelect dashboard={dashboard} setDashboard={setDashboard} />
        </Grid>
        {dashboard ? (
          <Grid container direction="row">
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
                highlightedGroup={highlightedGroup}
              />
            </Grid>
            <Grid item>
              <ReDimChart
                labels={[label]}
                index={0}
                onSelect={label => setLabel(label)}
                onLegendHover={setHighlightedGroup}
                highlightedGroup={highlightedGroup}
                width={500}
                dashboardID={dashboard["id"]}
                dashboardType={dashboard["type"]}
              />
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );
};

const AnalysisSelect = ({ dashboard, setDashboard }) => {
  const QUERY = gql`
    query {
      dashboards {
        type
        id
      }
    }
  `;

  const useStyles = makeStyles({
    root: {
      paddingBottom: "25px"
    },
    inputRoot: {
      padding: "2px !important"
    }
  });

  const { data, loading } = useQuery(QUERY);
  const classes = useStyles();

  if (loading) {
    return <CircularProgress />;
  }

  const { dashboards } = data;

  return (
    <Autocomplete
      classes={classes}
      value={dashboard}
      options={dashboards}
      getOptionLabel={option => option["id"]}
      onChange={(_, value) => setDashboard(value)}
      renderInput={params => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          label={"Analyses"}
          fullWidth
        />
      )}
    />
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
  const colorScale = getGeneColorScale(maxValue);

  return (
    <Grid container direction="column">
      <Grid item>
        <XYFrame
          {...getFrameProps({
            data: density,
            colorScale
          })}
        />
      </Grid>
      <Grid item>
        <GeneLegend maxValue={maxValue} colorScale={colorScale} />
      </Grid>
    </Grid>
  );
};

const GeneLegend = ({ maxValue, colorScale }) => {
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
    ]
  };

  return <OrdinalFrame {...frameProps} />;
};

const GeneTable = ({ genes, highlightGene, setHighlightGene, dashboardID }) => {
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
      dashboardID: dashboardID,
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
      subheader={<ListSubheader component="div">Genes</ListSubheader>}
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
          selected={gene === highlightGene}
        >
          <ListItemText primary={gene} />
        </ListItem>
      ))}
      {invalid.map(gene => (
        <ListItem key={gene}>
          <ListItemText primary={gene} style={{ color: "red" }} />
        </ListItem>
      ))}
    </List>
  );
};

const GeneTextBox = ({
  genes,
  setGenes,
  highlightGene,
  setHighlightGene,
  dashboardID
}) => {
  const [text, setText] = useState("");

  return (
    <Grid container direction="column" alignItems="center">
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
        <Button
          style={{ marginTop: "10px" }}
          variant="outlined"
          onClick={() => setGenes(textToGenes(text))}
        >
          Submit
        </Button>
      </Grid>
      <Grid item>
        <GeneTable
          highlightGene={highlightGene}
          dashboardID={dashboardID}
          genes={genes}
          setHighlightGene={setHighlightGene}
        />
      </Grid>
    </Grid>
  );
};

// const genesToText = genes => {
//   if (genes.length === 0) {
//     return "";
//   }

//   const [firstGene, ...restGenes] = genes;

//   return restGenes.reduce((str, gene) => `${str},${gene}`, firstGene);
// };

const textToGenes = text => text.split(",").map(gene => gene.trim());

const getFrameProps = ({ data, colorScale }) => ({
  points: data,
  pointStyle: d => ({
    r: 2,
    fill: d["value"] === "" ? "#eee" : colorScale(d["value"])
  }),

  size: [500, 570],
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

export default CumulativeGenePlot;
