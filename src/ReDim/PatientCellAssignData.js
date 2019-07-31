import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const QUERY = gql`
  query($patientID: String!) {
    existingCellTypes(patientID: $patientID) {
      cell
      count
    }

    cellAndMarkerGenesPair(patientID: $patientID) {
      cellType
      markerGenes
    }

    nonGeneCells(patientID: $patientID) {
      x
      y
      celltype
    }
  }
`;

class ConstantContent extends Component {
  render() {
    const {
      screenWidth,
      patientID,
      ReDim,
      CellAssign,
      cellAssignColorScale,
      highlighted
    } = this.props;

    return (
      <Query
        query={QUERY}
        variables={{
          patientID
        }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Grid item>
                <img
                  style={{
                    marginLeft: screenWidth / 3
                  }}
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                  alt="LOADING"
                />
              </Grid>
            );
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
                      paddingTop: 100,
                      marginLeft: screenWidth / 7.8
                    }}
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
                    alt="LOADING"
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
