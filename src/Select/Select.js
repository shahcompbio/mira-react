import React from "react";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";

import capitalizeString from "../utils/capitalizeString";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  form: { paddingRight: "25px" },
  select: {},
  input: { width: "200px", paddingBottom: "10px" }
});

const Select = ({ classes, label, name, data, value, onChange }) => (
  <FormControl className={classes.form}>
    <TextField
      select
      label={label}
      variant="outlined"
      margin="normal"
      InputLabelProps={{
        shrink: true
      }}
      inputProps={{ name: name, id: `${name}_select` }}
      input={
        <Input name={name} id={`${name}_select`} className={classes.input} />
      }
      name={name}
      value={value}
      onChange={event => onChange(event.target.value)}
    >
      {[
        <MenuItem value={null} key={`${name}_select_null`}>
          <i>None</i>
        </MenuItem>,
        ...data.map(option => (
          <MenuItem value={option} key={`${name}_select_${option}`}>
            {capitalizeString(option)}
          </MenuItem>
        ))
      ]}
    </TextField>
  </FormControl>
);

export default withStyles(styles)(Select);
