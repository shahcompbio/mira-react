import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReDimPlot from "./ReDimPlot";
import AbundancePlot from "./AbundancePlot";
import CellAssignTable from "./CellAssignTable";

import { getColorScale } from "./colors";
import Grid from "@material-ui/core/Grid";
import CellAssignData from "./CellAssignData";

const reDimPlotWidthScale = 0.35;
const abundancesPlotWidthScale = 0.25;
const abundancesPlotHeightScale = 0.7;
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
    existingCellTypes(patientID: $patientID, sampleID: $sampleID) {
      cell
      count
    }

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

    const ReDim = (data, colorScale, title, highlight) => {
      return (
        <ReDimPlot
          height={screenHeight}
          width={screenWidth * reDimPlotWidthScale}
          data={data}
          colorScale={colorScale}
          highlighted={highlight}
          labelTitle={label.title}
          title={title}
        />
      );
    };

    const CellAssign = (data, colorScale, highlight, countData) => {
      return (
        <CellAssignTable
          onClick={onClick}
          colorScale={colorScale}
          highlighted={highlight}
          labelTitle={label.title}
          data={data}
          countData={countData}
        />
      );
    };

    const cellAssignColorScale = data =>
      getColorScale(data, "categorical", null);

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
          if (loading)
            return (
              <CellAssignData
                screenHeight={screenHeight}
                screenWidth={screenWidth}
                onClick={onClick}
                label={label}
                patientID={patientID}
                sampleID={sampleID}
                reDimPlotWidthScale={reDimPlotWidthScale}
                cellAssignWidthScale={cellAssignWidthScale}
                ReDim={ReDim}
                CellAssign={CellAssign}
                cellAssignColorScale={cellAssignColorScale}
                highlighted={this.state.highlighted}
              />
            );
          if (error) return null;

          const existingCellType = data.existingCellTypes.map(
            element => element.cell
          );
          const colorScale = getColorScale(
            data.colorLabelValues.map(labelValue =>
              label.type === "categorical" ? labelValue.name : labelValue.max
            ),
            label.type,
            label.title
          );

          return (
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              spacing={2}
              style={{
                flexWrap: "nowrap",
                whiteSpace: "nowrap"
              }}
            >
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
                <Grid item style={{ marginTop: "40px", paddingLeft: "40px" }}>
                  {ReDim(
                    data.nonGeneCells,
                    cellAssignColorScale(existingCellType),
                    "Cell Types",
                    this.state.highlighted
                  )}
                </Grid>
                <Grid item style={{ marginTop: "40px", paddingLeft: "15px" }}>
                  {ReDim(
                    data.cells,
                    colorScale,
                    label.title === "Cluster"
                      ? "Clusters"
                      : label.title + " Expression",
                    this.state.highlighted
                  )}
                </Grid>
                <Grid item style={{ marginTop: "120px" }}>
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
                  paddingLeft: screenWidth / 13.5,
                  paddingBottom: 30
                }}
              >
                {CellAssign(
                  data.cellAndMarkerGenesPair,
                  cellAssignColorScale(existingCellType),
                  this.state.highlighted,
                  data.existingCellTypes
                )}
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default Content;
