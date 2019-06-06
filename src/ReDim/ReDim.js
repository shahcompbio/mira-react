import React from "react";

import Grid from "@material-ui/core/Grid";
import Content from "./Content";

const ReDim = ({patientID, sampleID, screenHeight, screenWidth, label}) => {
  return !label ? null : (
    <div style={DivStyles}>
      <Grid item>
        <Content
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          patientID={patientID}
          sampleID={sampleID}
          label={label}
        />
      </Grid>{" "}
    </div>
  );
};
const DivStyles = {
  width: "70%",
  display: "flex",
  flexDirection: "row"
};

export default ReDim;
