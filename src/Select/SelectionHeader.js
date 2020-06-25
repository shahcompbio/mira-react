import React, { useState } from "react";

import { Tab, Tabs } from "@material-ui/core";

import Header from "./Header";
import { makeStyles } from "@material-ui/core/styles";

import { useQuery } from "@apollo/react-hooks";
import { useLocation } from "react-router";
import { useDashboardType } from "../utils/useDashboardInfo";

import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  tabPanel: {
    marginTop: -55,
    padding: "25px",
    background: "none",
  },
  dashboardRoot: {
    width: "100%",
    height: 100,
    padding: 15,
    background: "blue",
  },
  selectionRoot: {
    width: "100%",
    height: 100,
    padding: 15,
    background: "#94bcb3",
  },
  expandIcon: {
    marginTop: 10,
    opacity: "80%",
    marginRight: "10vw",
  },
  tabs: {
    marginRight: 25,
    background: "white",
    borderRadius: "5px 5px 0px 0px",
  },
});
const QUERY = gql`
  query {
    dashboardTypes
  }
`;
const SelectionHeader = ({ title, id, setIsExpanded, isExpanded }) => {
  const classes = useStyles();
  const location = useLocation();
  const dashboardType = useDashboardType(location);
  let history = useHistory();

  const [tabIndex, setTabIndex] = useState(
    dashboardType ? ["patient", "cohort"].indexOf(dashboardType) : 0
  );

  const onDashboardTypeChange = (type) => {
    const typeConvert = type ? type : "";
    history.push(`/${typeConvert}`);
  };

  const { data, loading, error } = useQuery(QUERY);

  if (loading || error) {
    return null;
  }
  const { dashboardTypes } = data;
  return (
    <div>
      <Header
        title={"Dashboard Selection"}
        isExpanded={isExpanded}
        setIsExpanded={() => setIsExpanded(!isExpanded)}
        id="selectionRoot"
      />
      <Tabs
        value={tabIndex}
        indicatorColor="primary"
        textColor="black"
        onChange={(e, index) => {
          setTabIndex(index);
          onDashboardTypeChange(dashboardTypes[index]);
        }}
        className={classes.tabPanel}
      >
        {dashboardTypes.map((tabHeader) => {
          return <Tab label={tabHeader} className={classes.tabs} />;
        })}
      </Tabs>
    </div>
  );
};

export default SelectionHeader;
