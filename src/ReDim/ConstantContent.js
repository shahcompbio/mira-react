import React, { Component } from "react";
import { getColorScale } from "./colors";
import Grid from "@material-ui/core/Grid";
import CellAssignTable from "./CellAssignTable";
import ReDimPlot from "./ReDimPlot";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const reDimPlotWidthScale = 0.35;
const cellAssignWidthScale = 0.94;

const QUERY = gql`
  query($patientID: String!, $sampleID: String!) {
    existingCellTypes(patientID: $patientID, sampleID: $sampleID)

    cellAndMarkerGenesPair(patientID: $patientID) {
      cellType
      markerGenes
    }

    nonGeneCells(patientID: $patientID, sampleID: $sampleID) {
      name
      x
      y
      label
    }
  }
`;

class ConstantContent extends Component {
  render() {
    const {
      screenHeight,
      screenWidth,
      patientID,
      sampleID,
      onClick,
      label
    } = this.props;
    return (
      <Query
        query={QUERY}
        variables={{
          patientID,
          sampleID
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;
          const cellAssignColorScale = getColorScale(
            data.existingCellTypes,
            "categorical",
            null
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
                    highlighted={null}
                    labelTitle={label.title}
                    title={"Cell Types"}
                  />
                </Grid>
                <Grid item>
                  <img
                    style={{
                      marginTop: 100,
                      paddingLeft: 200
                    }}
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                    alt="LOADING"
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
                  highlighted={null}
                  labelTitle={label.title}
                  data={data.cellAndMarkerGenesPair}
                />
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default ConstantContent;
