import React from "react";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import capitalizeString from "../utils/capitalizeString";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "200px",
    paddingRight: "25px"
  },
  inputRoot: {
    padding: "2px !important"
  }
});

const Select = ({ label, data, value, onChange }) => {
  const classes = useStyles();
  return (
    <Autocomplete
      classes={classes}
      value={value}
      options={data}
      getOptionLabel={option => capitalizeString(option)}
      onChange={(_, value) => onChange(value)}
      renderInput={params => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          label={label}
          fullWidth
        />
      )}
    />
  );
};

export default Select;
