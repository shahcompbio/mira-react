import React from "react";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  title: {
    color: "#8a939a",
    fontWeight: "500",
    fontFamily: "Helvetica Neue"
  }
};

export default withStyles(styles)(({ classes, title }) => (
  <Typography variant="h6" className={classes.title}>
    {title}
  </Typography>
));
