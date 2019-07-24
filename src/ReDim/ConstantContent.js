import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const QUERY = gql`
  query($patientID: String!, $sampleID: String!) {
    existingCellTypes(patientID: $patientID, sampleID: $sampleID) {
      cell
      count
    }

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
      screenWidth,
      patientID,
      sampleID,
      cellAssignWidthScale,
      ReDim,
      CellAssign,
      cellAssignColorScale,
      highlighted
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

          const existingCellType = data.existingCellTypes.map(
            element => element.cell
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
                  {ReDim(
                    data.nonGeneCells,
                    cellAssignColorScale(existingCellType),
                    "Cell Types",
                    highlighted
                  )}
                </Grid>
                <Grid item>
                  <img
                    style={{
                      marginTop: 100,
                      paddingLeft: 150
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
                {CellAssign(
                  data.cellAndMarkerGenesPair,
                  cellAssignColorScale(existingCellType),
                  highlighted,
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

export default ConstantContent;
