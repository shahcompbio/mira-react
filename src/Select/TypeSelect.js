import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const QUERY = gql`
  query {
    dashboards {
      type
      dashboards {
        id
        samples
      }
    }
  }
`;
const TypesTable = ({ dashboards }) =>
  dashboards[0]["dashboards"].map(dashboard => <p>{dashboard["id"]}</p>);

const TypeSelect = () => {
  const { loading, error, data } = useQuery(QUERY);

  if (loading || error) return null;
  else {
    const { dashboards } = data;
    console.log(dashboards);
    return (
      <Paper>
        <Tabs value={0} indicatorColor="primary" textColor="primary" centered>
          {dashboards.map(dashboard => (
            <Tab
              key={`dashboard_${dashboard["type"]}`}
              label={dashboard["type"]}
            />
          ))}
        </Tabs>
        {/* Will need to account for non-sample dashboards */}
        <TypesTable dashboards={dashboards} />
      </Paper>
    );
  }
};

export default TypeSelect;
