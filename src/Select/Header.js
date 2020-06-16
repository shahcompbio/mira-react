import React from "react";

import { Paper, Typography, Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: 80,
    padding: 15,
    background: "#f5f5f5"
  },
  title: {
    paddingTop: 15
  }
});
const Header = ({ id, title, setIsExpanded, isExpanded }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default Header;
