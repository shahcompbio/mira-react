import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReDimPlot from "./ReDimPlot";
import AbundancePlot from "./AbundancePlot";
import CellAssignTable from "./CellAssignTable";

import FacetController from "semiotic/lib/FacetController";

import { getColorScale } from "./colors";
import Grid from "@material-ui/core/Grid";

const reDimPlotWidthScale = 0.37;
const abundancesPlotWidthScale = 0.2;
const abundancesPlotHeightScale = 0.6;
const cellAssignWidthScale = 0.94;

const QUERY = gql`
  query(
    $patientID: String!
    $sampleID: String!
    $label: String!
    $labelType: String!
  ) {
    cells(
      patientID: $patientID
      sampleID: $sampleID
      label: $label
      labelType: $labelType
    ) {
      name
      x
      y
      label
    }

    nonGeneCells(patientID: $patientID, sampleID: $sampleID) {
      name
      x
      y
      label
    }

    colorLabelValues(
      patientID: $patientID
      sampleID: $sampleID
      label: $label
      labelType: $labelType
    ) {
      name
      count
      ... on Gene {
        min
        max
      }
    }
    existingCellTypes(patientID: $patientID, sampleID: $sampleID)

    cellAndMarkerGenesPair(patientID: $patientID) {
      cellType
      markerGenes
    }
  }
`;

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: null
    };
  }

  hoverBehavior = d => {
    if (d) {
      if (d["__typename"] === "Categorical") {
        this.setState({
          highlighted: cell => d.name === cell.label
        });
      } else {
        this.setState({
          highlighted: cell => d.min <= cell.label && cell.label < d.max
        });
      }
    } else {
      this.setState({
        highlighted: null
      });
    }
  };

  render() {
    const {
      patientID,
      sampleID,
      label,
      screenHeight,
      screenWidth,
      onClick
    } = this.props;

    return !sampleID || !label ? null : (
      <Query
        query={QUERY}
        variables={{
          patientID,
          sampleID,
          label: label.id,
          labelType: label.type
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;

          const colorScale = getColorScale(
            data.colorLabelValues.map(labelValue =>
              label.type === "categorical" ? labelValue.name : labelValue.max
            ),
            label.type
          );

          const cellAssignColorScale = getColorScale(
            data.existingCellTypes,
            "categorical"
          );

          return (
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              spacing={2}
              style={{
                flexWrap: "nowrap",
                whiteSpace: "nowrap"
              }}
            >
              <FacetController>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                  style={{
                    flexWrap: "nowrap",
                    whiteSpace: "nowrap"
                  }}
                >
                  <Grid item style={{ marginTop: "40px", paddingLeft: "65px" }}>
                    <ReDimPlot
                      height={screenHeight}
                      width={screenWidth * reDimPlotWidthScale}
                      data={data.nonGeneCells}
                      colorScale={cellAssignColorScale}
                      highlighted={this.state.highlighted}
                      labelTitle={label.title}
                      title={"Cell Types"}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: "40px", paddingLeft: "15px" }}>
                    <ReDimPlot
                      height={screenHeight}
                      width={screenWidth * reDimPlotWidthScale}
                      data={data.cells}
                      colorScale={colorScale}
                      highlighted={this.state.highlighted}
                      labelTitle={label.title}
                      title={
                        label.title === "Cluster"
                          ? "Clusters"
                          : label.title + " Expression"
                      }
                    />
                  </Grid>
                  <Grid item style={{ marginTop: "180px" }}>
                    <AbundancePlot
                      height={screenHeight * abundancesPlotHeightScale}
                      width={screenWidth * abundancesPlotWidthScale}
                      label={label}
                      data={data.colorLabelValues}
                      colorScale={colorScale}
                      hoverBehavior={this.hoverBehavior}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  style={{
                    width: screenWidth * cellAssignWidthScale,
                    paddingLeft: screenWidth / 13.5
                  }}
                >
                  <CellAssignTable
                    onClick={onClick}
                    colorScale={cellAssignColorScale}
                    highlighted={this.state.highlighted}
                    labelTitle={label.title}
                    data={data.cellAndMarkerGenesPair}
                  />
                </Grid>
              </FacetController>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default Content;
