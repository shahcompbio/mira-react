import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReDimPlot from "./ReDimPlot";
import AbundancePlot from "./AbundancePlot";

import { getColorScale } from "./colors";
import Grid from "@material-ui/core/Grid";
import CellAssignTable from "./CellAssignTable";
import CellAssignData from "./CellAssignData";

const reDimPlotWidthScale = 0.35;
const abundancesPlotWidthScale = 0.25;
const abundancesPlotHeightScale = 0.7;

const PatientQuery = gql`
  query($patientID: String!, $label: String!, $labelType: String!) {
    cells(patientID: $patientID, label: $label) {
      name
      x
      y
      label
      celltype
      site
    }

    sites(patientID: $patientID)

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

const SampleQuery = gql`
  query(
    $patientID: String!
    $sampleID: String!
    $label: String!
    $labelType: String!
  ) {
    cells(patientID: $patientID, sampleID: $sampleID, label: $label) {
      name
      x
      y
      label
      celltype
    }

    existingCellTypes(patientID: $patientID, sampleID: $sampleID) {
      cell
      count
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
    cellAndMarkerGenesPair(patientID: $patientID) {
      cellType
      markerGenes
    }
  }
`;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: null
    };
  }

  render() {
    const {
      patientID,
      label,
      screenHeight,
      screenWidth,
      onClick,
      dashboard,
      sampleID
    } = this.props;

    const cellAssignColorScale = data =>
      data !== undefined ? getColorScale(data, "categorical", null) : null;

    const CellAssign = (data, colorScale, countData) => (
      <CellAssignTable
        onClick={onClick}
        colorScale={colorScale}
        highlighted={this.state.highlighted}
        labelTitle={label.title}
        data={data}
        countData={countData}
        hoverBehavior={hoverBehavior}
      />
    );

    const ReDim = (data, colorScale, title, existingCellType, sites) => (
      <ReDimPlot
        height={screenHeight}
        width={screenWidth * reDimPlotWidthScale}
        data={data}
        colorScale={colorScale}
        highlighted={this.state.highlighted}
        labelTitle={label.title}
        title={title}
        existingCells={existingCellType}
        allSites={sites}
      />
    );

    const hoverBehavior = d => {
      d
        ? d["__typename"] === "Categorical"
          ? d.hasOwnProperty("count")
            ? this.setState({ highlighted: cell => d.name === cell.site })
            : this.setState({
                highlighted: cell => d.name === cell.celltype
              })
          : this.setState({
              highlighted: cell => d.min <= cell.label && cell.label < d.max
            })
        : this.setState({
            highlighted: null
          });
    };

    return !patientID || !label ? null : dashboard ? (
      <Query
        query={PatientQuery}
        variables={{
          patientID,
          label: label.title,
          labelType: label.type
        }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <CellAssignData
                screenWidth={screenWidth}
                patientID={patientID}
                ReDim={ReDim}
                CellAssign={CellAssign}
                cellAssignColorScale={cellAssignColorScale}
                patientDashboard={true}
              />
            );
          if (error) return null;

          return (
            <Content
              data={data}
              label={label}
              onClick={onClick}
              screenHeight={screenHeight}
              screenWidth={screenWidth}
              ReDim={ReDim}
              cellAssignColorScale={cellAssignColorScale}
              hoverBehavior={hoverBehavior}
              CellAssign={CellAssign}
            />
          );
        }}
      </Query>
    ) : (
      <Query
        query={SampleQuery}
        variables={{
          patientID,
          sampleID,
          label: label.title,
          labelType: label.type
        }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <CellAssignData
                screenWidth={screenWidth}
                patientID={patientID}
                sampleID={sampleID}
                ReDim={ReDim}
                CellAssign={CellAssign}
                cellAssignColorScale={cellAssignColorScale}
                patientDashboard={false}
              />
            );
          if (error) return null;

          return (
            <Content
              data={data}
              label={label}
              screenHeight={screenHeight}
              screenWidth={screenWidth}
              ReDim={ReDim}
              cellAssignColorScale={cellAssignColorScale}
              hoverBehavior={hoverBehavior}
              CellAssign={CellAssign}
            />
          );
        }}
      </Query>
    );
  }
}

const Content = ({
  data,
  label,
  screenHeight,
  screenWidth,
  ReDim,
  cellAssignColorScale,
  hoverBehavior,
  CellAssign
}) => {
  const existingCellType = data.existingCellTypes.map(element => element.cell);

  const colorScale = getColorScale(
    label.title === "Site"
      ? data.colorLabelValues.map(labelValue => labelValue.name)
      : data.colorLabelValues.map(labelValue => labelValue.max),
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
            data.cells,
            cellAssignColorScale(existingCellType),
            "Cell Types",
            existingCellType
          )}
        </Grid>
        <Grid item style={{ marginTop: "40px", paddingLeft: "15px" }}>
          {ReDim(
            data.cells,
            colorScale,
            label.title === "Site" ? "Site" : label.title + " Expression",
            existingCellType,
            data.sites
          )}
        </Grid>
        <Grid item style={{ marginTop: "120px" }}>
          <AbundancePlot
            height={screenHeight * abundancesPlotHeightScale}
            width={screenWidth * abundancesPlotWidthScale}
            label={label}
            data={data.colorLabelValues}
            colorScale={colorScale}
            hoverBehavior={hoverBehavior}
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
          data.existingCellTypes
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
