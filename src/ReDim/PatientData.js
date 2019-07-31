import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReDimPlot from "./ReDimPlot";
import AbundancePlot from "./AbundancePlot";

import { getColorScale } from "./colors";
import Grid from "@material-ui/core/Grid";
import CellAssignTable from "./CellAssignTable";
import PatientCellAssignData from "./PatientCellAssignData";

const reDimPlotWidthScale = 0.35;
const abundancesPlotWidthScale = 0.25;
const abundancesPlotHeightScale = 0.7;

const QUERY = gql`
  query($patientID: String!, $label: String!, $labelType: String!) {
    patientCells(patientID: $patientID, label: $label) {
      name
      x
      y
      label
      celltype
      site
    }

    existingCellTypes(patientID: $patientID) {
      cell
      count
    }

    colorLabelValues(
      patientID: $patientID
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
      highlighted: null,
      currTitle: undefined
    };
  }

  hoverBehavior = d => {
    if (d) {
      if (d["__typename"] === "Categorical") {
        this.setState({
          highlighted: cell => d.name === cell.celltype,
          currTitle: "Cell Types"
        });
      } else {
        this.setState({
          highlighted: cell => d.min <= cell.label && cell.label < d.max,
          currTitle: this.props.label.title + " Expression"
        });
      }
    } else {
      this.setState({
        highlighted: null
      });
    }
  };

  render() {
    const { patientID, label, screenHeight, screenWidth, onClick } = this.props;

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
          currTitle={this.state.currTitle}
        />
      );
    };

    const cellAssignColorScale = data =>
      getColorScale(data, "categorical", null);

    const CellAssign = (data, colorScale, highlight, countData) => {
      return (
        <CellAssignTable
          onClick={onClick}
          colorScale={colorScale}
          highlighted={highlight}
          labelTitle={label.title}
          data={data}
          countData={countData}
          hoverBehavior={this.hoverBehavior}
        />
      );
    };
    return !patientID || !label ? null : (
      <Query
        query={QUERY}
        variables={{
          patientID,
          label: label.id,
          labelType: label.type
        }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <PatientCellAssignData
                screenHeight={screenHeight}
                screenWidth={screenWidth}
                onClick={onClick}
                patientID={patientID}
                reDimPlotWidthScale={reDimPlotWidthScale}
                ReDim={ReDim}
                sampleID={undefined}
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
                    data.patientCells,
                    cellAssignColorScale(existingCellType),
                    "Cell Types",
                    this.state.highlighted
                  )}
                </Grid>
                <Grid item style={{ marginTop: "40px", paddingLeft: "15px" }}>
                  {ReDim(
                    data.patientCells,
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
                  marginLeft: -20,
                  width: screenWidth,
                  paddingBottom: 30
                }}
              >
                <CellAssignTable
                  onClick={onClick}
                  colorScale={cellAssignColorScale(existingCellType)}
                  highlighted={this.state.highlighted}
                  labelTitle={label.title}
                  data={data.cellAndMarkerGenesPair}
                  countData={data.existingCellTypes}
                  hoverBehavior={this.hoverBehavior}
                />
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default Content;
