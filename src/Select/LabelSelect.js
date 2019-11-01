import React, { useEffect, useState } from "react";

import Select, { createFilter } from "react-select";
import { FixedSizeList as List } from "react-window";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

import { withStyles } from "@material-ui/styles";

const groupBadgeStyles = {
  backgroundColor: "#CCCCCC",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  float: "right",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center"
};

const styles = {
  root: {
    width: 220,
    flexGrow: 1,
    height: 250
  },
  textField: { paddingLeft: "-15px", width: 220 },
  input: {
    display: "flex",
    height: "auto"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    marginTop: "-4px"
  },
  singleValue: {
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0
  }
};

const LabelSelect = ({ data, onSelect, classes, labelTitle }) => {
  const [focus, setFocus] = useState(false);

  useEffect(
    () =>
      onSelect(data.length === 1 ? data[0]["labels"][0] : data[1]["labels"][0]),
    []
  );

  const allOptions = data.reduce(
    (options, group) => [...options, ...group.labels],
    []
  );

  const handleChange = item => {
    if (item) {
      const result = allOptions.filter(datum => datum.title === item.label)[0];

      onSelect({ id: result.title, type: result.type, title: result.title });
    } else {
      onSelect(null);
    }
  };

    label: group.title,
    options: group.labels.map(label => ({
      value: label.id,
      label: label.title
    }))
  }));

  return (
    <Select
      classes={classes}
      value={focus ? "" : labelTitle}
      onChange={handleChange}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      blurInputOnSelect={true}
      options={groupOptions}
      TextFieldProps={{
        className: classes.textField,
        label: "Colour by:",
        variant: "outlined",
        margin: "normal",
        InputLabelProps: {
          shrink: true,
          className: classes.textFieldLabel,
          htmlFor: "react-select-single"
        },
        placeholder: "Colour by"
      }}
      components={{
        Control,
        MenuList,
        Group,
        ValueContainer,
        Menu,
        Option,
        DropdownIndicator,
        IndicatorSeparator
      }}
      isSearchable
      filterOption={createFilter({ ignoreAccents: false })}
    />
  );
};

const Option = ({ innerRef, isFocused, isSelected, innerProps, children }) => (
  <MenuItem
    ref={innerRef}
    selected={isFocused}
    component="span"
    style={{
      fontWeight: isSelected ? 500 : 400,
      background: isSelected ? "#e8ecf1" : ""
    }}
    {...innerProps}
  >
    {children}
  </MenuItem>
);
const DropdownIndicator = props => <ArrowDropDown />;
const Menu = ({ selectProps, children, innerProps }) => (
  <Paper square className={selectProps.classes.paper} {...innerProps}>
    {children}
  </Paper>
);
const ValueContainer = ({ selectProps, children }) => (
  <div style={{ width: 200 }} className={selectProps.classes.valueContainer}>
    {children}
  </div>
);
const inputComponent = ({ inputRef, ...props }) => (
  <span ref={inputRef} {...props} />
);
const Control = ({
  children,
  innerProps,
  innerRef,
  selectProps: { classes, TextFieldProps }
}) => {
  return (
    <FormControl
      style={{
        width: 200,
        paddingLeft: 15,
        paddingRight: 15,
        display: "flex",
        flexWrap: "wrap"
      }}
    >
      <TextField
        InputProps={{
          inputComponent,
          inputProps: {
            className: classes.input,
            ref: innerRef,
            children,
            ...innerProps
          }
        }}
        {...TextFieldProps}
      />
    </FormControl>
  );
};
const Group = ({ label, options }) => (
  <div
    style={{
      background: "#8799af",
      padding: "14px",
      fontWeight: "bold",
      margin: "0px 0px !important"
    }}
  >
    <Typography component="span">{label}</Typography>
    <span style={groupBadgeStyles}>{options.length}</span>
  </div>
);
const IndicatorSeparator = () => null;
const MenuList = ({ children, maxHeight }) => {
  const height = 48;

  const options = Array.isArray(children)
    ? children.reduce(
        (options, child) => [...options, child, ...child.props.children],
        []
      )
    : [];
  return (
    <List
      height={maxHeight + 300}
      width={"220px"}
      itemCount={options.length}
      itemSize={height}
    >
      {({ index, style }) => {
        return (
          <ListItem style={{ ...style, padding: "0px", margin: 0 }} key={index}>
            <ListItemText primary={options[index]} />
          </ListItem>
        );
      }}
    </List>
  );
};

export default withStyles(styles)(LabelSelect);
