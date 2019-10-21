import React from "react";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  title: {
    color: "#8a939a",
    fontSize: "25px",
    fontWeight: "500",
    paddingBottom: "20px"
  }
};

export default withStyles(styles)(({ classes, title }) => (
  <Typography variant="h4" className={classes.title}>
    {title}
  </Typography>
));
