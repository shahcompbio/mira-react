import React from "react";
import Grid from "@material-ui/core/Grid";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const PatientQuery = gql`
  query($patientID: String!) {
    existingCellTypes(patientID: $patientID) {
      cell
      count
    }

    cellAndMarkerGenesPair(patientID: $patientID) {
      cellType
      markerGenes
    }

    cells(patientID: $patientID) {
      x
      y
      celltype
    }
  }
`;

const SampleQuery = gql`
  query($patientID: String!, $sampleID: String) {
    existingCellTypes(patientID: $patientID, sampleID: $sampleID) {
      cell
      count
    }

    cellAndMarkerGenesPair(patientID: $patientID) {
      cellType
      markerGenes
    }

    cells(patientID: $patientID, sampleID: $sampleID) {
      x
      y
      celltype
    }
  }
`;

const CellAssignData = ({
  screenWidth,
  patientID,
  sampleID,
  ReDim,
  CellAssign,
  cellAssignColorScale,
  highlighted,
  patientDashboard
}) => {
  const loadingGif = () => (
    <img
      style={{
        marginLeft: screenWidth / 3
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
      alt="LOADING"
    />
  );

  return patientDashboard ? (
    <Query
      query={PatientQuery}
      variables={{
        patientID
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <Grid item> {loadingGif} </Grid>;
        if (error) return null;

        return (
          <CellAssignContent
            ReDim={ReDim}
            cellAssignColorScale={cellAssignColorScale}
            highlighted={highlighted}
            screenWidth={screenWidth}
            CellAssign={CellAssign}
            data={data}
          />
        );
      }}
    </Query>
  ) : (
    <Query
      query={SampleQuery}
      variables={{
        patientID,
        sampleID
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <Grid item>{loadingGif}</Grid>;
        if (error) return null;
        return (
          <CellAssignContent
            ReDim={ReDim}
            cellAssignColorScale={cellAssignColorScale}
            data={data}
            highlighted={highlighted}
            screenWidth={screenWidth}
            CellAssign={CellAssign}
          />
        );
      }}
    </Query>
  );
};

const CellAssignContent = ({
  ReDim,
  cellAssignColorScale,
  data,
  highlighted,
  screenWidth,
  CellAssign
}) => {
  const existingCellType = data.existingCellTypes.map(element => element.cell);

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
            data.cells,
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
};

export default CellAssignData;
