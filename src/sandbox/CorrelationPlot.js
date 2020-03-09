import React, { useState } from "react";
import ReDimChart from "../Dashboard/ReDimChart";

import Grid from "@material-ui/core/Grid";

import Correlation from "./Correlation";

const TEST_DASHBOARDID = "SPECTRUM-OV-002";
const TEST_DASHBOARDTYPE = "patient";
const CorrelationPlot = () => {
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const [labels, setLabels] = useState([
    { isNum: true, type: "CELL", label: "Ovarian cancer cell probability" },
    { isNum: false, type: "CELL", label: "celltype" }
  ]);

  // TODO: add dropdown to select sample/patient
  return (
    <Grid container direction="row">
      {labels.map((label, index) => (
        <Grid
          key={`grid_redim_${index}`}
          item
          xs={4}
          style={{ minHeight: 500 }}
        >
          <ReDimChart
            key={`redim_${index}`}
            width={500}
            labels={labels}
            index={index}
            highlightedGroup={highlightedLabel}
            onLegendHover={setHighlightedLabel}
            onSelect={label =>
              setLabels(
                labels.map((oldLabel, oldLabelIndex) =>
                  oldLabelIndex === index ? label : oldLabel
                )
              )
            }
            dashboardID={TEST_DASHBOARDID}
            dashboardType={TEST_DASHBOARDTYPE}
          />
        </Grid>
      ))}

      <Grid item xs={4} style={{ minHeight: 500 }}>
        <Correlation
          dashboardID={TEST_DASHBOARDID}
          dashboardType={TEST_DASHBOARDTYPE}
          labels={labels}
        />
      </Grid>
    </Grid>
  );
};

export default CorrelationPlot;
