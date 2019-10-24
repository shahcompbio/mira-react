import React from "react";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import Title from "./Title";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const CustomExpansionPanel = ({ title, children }) => (
  <ExpansionPanel defaultExpanded>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
    >
      <Title title={title} />
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
  </ExpansionPanel>
);
export default CustomExpansionPanel;
