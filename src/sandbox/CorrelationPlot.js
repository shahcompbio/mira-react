import React, { useState } from "react";
import ReDimChart from "../Dashboard/ReDimChart";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import Correlation from "./Correlation";
import { AnalysisSelect } from "./CumulativeGenePlot";

const CorrelationPlot = () => {
  const [dashboard, setDashboard] = useState(null);
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const [labels, setLabels] = useState([
    { isNum: false, type: "CELL", label: "celltype" },
    { isNum: false, type: "CELL", label: "celltype" }
  ]);

  return (
    <Paper
      style={{
        margin: "40px 40px",
        padding: "40px 20px"
      }}
    >
      <Grid container direction="column">
        <Grid item>
          <AnalysisSelect dashboard={dashboard} setDashboard={setDashboard} />
        </Grid>
        {dashboard ? (
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
                  dashboardID={dashboard["id"]}
                  dashboardType={dashboard["type"]}
                />
              </Grid>
            ))}

            <Grid item xs={4} style={{ minHeight: 500 }}>
              <Correlation
                dashboardID={dashboard["id"]}
                dashboardType={dashboard["type"]}
                labels={labels}
              />
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );
};

export default CorrelationPlot;
