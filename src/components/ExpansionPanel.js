import React from "react";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import Title from "./Title";
import { makeStyles } from "@material-ui/core/styles";

import { IconButton, Grid, Tooltip } from "@material-ui/core";

import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  expansionPanel: {
    marginLeft: 15,
    marginRight: 15,
    background: "white",
    boxShadow:
      "0 2px 0 rgba(90,97,105,.11), 0 4px 8px rgba(90,97,105,.12), 0 10px 10px rgba(90,97,105,.06), 0 7px 70px rgba(90,97,105,.1)"
  },
  title: { width: "50%" }
});
const CustomExpansionPanel = ({
  title,
  children,
  isExpanded,
  setIsExpanded,
  displayFlag
}) => {
  const classes = useStyles();

  return (
    <ExpansionPanel className={classes.expansionPanel} expanded={isExpanded}>
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        style={{ minHeight: 0 }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Title title={title} className={classes.title} />
          </Grid>
          {displayFlag && (
            <Grid item>
              <Grid container direction="row" justify="flex-end">
                <Tooltip title={isExpanded ? "Close" : "Expand"}>
                  <IconButton onClick={setIsExpanded}>
                    {isExpanded ? (
                      <ExpandMoreIcon fontSize="large" />
                    ) : (
                      <KeyboardArrowUpIcon fontSize="large" />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          )}
        </Grid>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
export default CustomExpansionPanel;
