import React, { useState } from "react";
import SelectionPanel from "./SelectionPanel";
import ExpansionPanel from "../components/ExpansionPanel";
import SelectionHeader from "./SelectionHeader";

const DashboardSelection = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <SelectionHeader
        title={"Dashboard Selection"}
        isExpanded={isExpanded}
        setIsExpanded={() => setIsExpanded(!isExpanded)}
      />
      <div style={{ marginTop: -25, marginLeft: 10, marginRight: 10 }}>
        <ExpansionPanel
          isExpanded={isExpanded}
          title={isExpanded ? "" : title}
          setIsExpanded={() => setIsExpanded(!isExpanded)}
          displayFlag={isExpanded ? false : true}
        >
          <SelectionPanel
            setIsExpanded={() => setIsExpanded(!isExpanded)}
            isExpanded={isExpanded}
          />
        </ExpansionPanel>
      </div>
    </div>
  );
};
export default DashboardSelection;
