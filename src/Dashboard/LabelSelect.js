import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { FixedSizeList } from "react-window";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

// import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";

const QUERY = gql`
  query($dashboardType: String!, $dashboardID: String!) {
    dashboardCellAttributes(type: $dashboardType, dashboardID: $dashboardID) {
      type
      label
    }
  }
`;

function renderRow(props) {
  const { data, index, style } = props;

  return React.cloneElement(data[index], {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      display: "block",
      ...style
    }
  });
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const smUp = useMediaQuery(theme => theme.breakpoints.up("sm"));
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = smUp ? 36 : 48;

  const outerElementType = React.useMemo(() => {
    return React.forwardRef((props2, ref2) => (
      <div ref={ref2} {...props2} {...other} />
    ));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref}>
      <FixedSizeList
        style={{
          padding: 0,
          height: Math.min(8, itemCount) * itemSize,
          maxHeight: "auto"
        }}
        itemData={children}
        height={250}
        width="100%"
        outerElementType={outerElementType}
        innerElementType="ul"
        itemSize={itemSize}
        overscanCount={5}
        itemCount={itemCount}
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});

const useStyles = makeStyles({
  listbox: {
    "& ul": {
      padding: 0,
      margin: 0
    }
  }
});

export default function Virtualize({ onSelect, label }) {
  const classes = useStyles();
  const location = useLocation();
  const [dashboardType, dashboardID] = [
    useDashboardType(location),
    useDashboardID(location)
  ];
  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, dashboardID, props: [] }
  });

  if (!data && (loading || error)) {
    return <CircularProgress />;
  }

  const labels = data["dashboardCellAttributes"];

  return (
    <Autocomplete
      disableListWrap
      classes={classes}
      defaultValue={labels[0]}
      value={label}
      ListboxComponent={ListboxComponent}
      options={labels}
      getOptionLabel={option => option["label"]}
      disableClearable={true}
      onChange={(event, value) => {
        onSelect({ label: value["label"], type: value["type"] });
      }}
      renderInput={params => (
        <TextField
          {...params}
          style={{ width: "300px", paddingBottom: "10px" }}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          label="10,000 options"
          fullWidth
        />
      )}
    />
  );
}
