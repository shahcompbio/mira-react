import React, { useState } from "react";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import Title from "./Title";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const CustomExpansionPanel = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <ExpansionPanel expanded={isExpanded}>
      <ExpansionPanelSummary
        expandIcon={
          <ExpandMoreIcon onClick={() => setIsExpanded(!isExpanded)} />
        }
        aria-controls="panel1a-content"
      >
        <Title title={title} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
export default CustomExpansionPanel;
