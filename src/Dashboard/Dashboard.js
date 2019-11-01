import React, { useState } from "react";

import ReDimChart from "./ReDimChart";

import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";
import CellAssignTable from "./CellAssignTable";

const QUERY = gql`
  query(
    $dashboardType: String!
    $dashboardID: String!
    $props: [DashboardAttributeInput!]!
  ) {
    cells(type: $dashboardType, dashboardID: $dashboardID, props: $props) {
      name
      x
      y
      celltype
      values {
        label
        value
      }
    }
  }
`;

const Dashboard = () => {
  const [dashboardType, dashboardID] = [useDashboardType(), useDashboardID()];

  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const [labels, setLabels] = useState([
    { label: "celltype", type: "CELL" },
    { label: "celltype", type: "CELL" }
  ]);
  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, dashboardID, props: labels }
  });

  if (!data && (loading || error)) {
    return (
      <DashboardBase>
        <CircularProgress />
      </DashboardBase>
    );
  }

  const { cells } = data;
  const cellProps = cells.map(cell => {
    const cellProps = cell["values"].reduce(
      (props, value) => ({ ...props, [value["label"]]: value["value"] }),
      {}
    );

    return { ...cell, ...cellProps };
  });

  return (
    <DashboardBase
      selectedGene={labels[1]["label"]}
      setSelectedGene={label => setLabels([labels[0], { label, type: "GENE" }])}
      setSelectedCelltype={celltype =>
        setHighlightedLabel({ label: "celltype", value: celltype })
      }
    >
      <Grid container direction="row">
        <Grid item>
          <ReDimChart
            data={cellProps}
            label={labels[0]}
            highlightedGroup={highlightedLabel}
            onSelect={label => setLabels([label, labels[1]])}
          />
        </Grid>
        <Grid item>
          <ReDimChart
            data={cellProps}
            label={labels[1]}
            highlightedGroup={highlightedLabel}
            onSelect={label => setLabels([labels[0], label])}
          />
        </Grid>
      </Grid>
    </DashboardBase>
  );
};

const DashboardBase = ({
  children,
  selectedGene,
  setSelectedGene,
  setSelectedCelltype
}) => (
  <Grid container direction="column">
    <Grid item>{children}</Grid>
    <Grid item>
      <CellAssignTable
        selectedGene={selectedGene}
        setSelectedGene={setSelectedGene}
        setSelectedCelltype={setSelectedCelltype}
      />
    </Grid>
  </Grid>
);

export default Dashboard;
