import React, { useState } from "react";

import ReDimChart from "./ReDimChart";

import Grid from "@material-ui/core/Grid";

import CellAssignTable from "./CellAssignTable";

const Dashboard = () => {
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const [labels, setLabels] = useState([
    { label: "celltype", type: "CELL" },
    { label: "celltype", type: "CELL" }
  ]);
  return (
    <Grid container direction="column">
      <Grid container direction="row">
        {labels.map((label, index) => (
          <Grid key={`grid_redim_${index}`} item>
            <ReDimChart
              key={`redim_${index}`}
              labels={labels}
              index={index}
              highlightedGroup={highlightedLabel}
              onSelect={label =>
                setLabels(
                  labels.map((oldLabel, oldLabelIndex) =>
                    oldLabelIndex === index ? label : oldLabel
                  )
                )
              }
            />
          </Grid>
        ))}
      </Grid>
      <Grid item>
        <CellAssignTable
          selectedGene={labels[1]["label"]}
          setSelectedGene={label =>
            setLabels([labels[0], { label, type: "GENE" }])
          }
          setSelectedCelltype={celltype =>
            setHighlightedLabel({ label: "celltype", value: celltype })
          }
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
