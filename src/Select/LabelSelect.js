import React, { Component } from "react";

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
    width: 200,
    flexGrow: 1,
    height: 250
  },
  textField: { paddingLeft: "-15px", width: 200 },
  input: {
    display: "flex",
    padding: 5,
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

class LabelSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLastActionFocus: false
    };
  }
  componentDidMount() {
    this.props.onSelect(this.props.data[0]["labels"][0]);
  }

  render() {
    const { focus } = this.state;
    const { data, onSelect, classes, labelTitle } = this.props;

    const allOptions = data.reduce(
      (options, group) => [...options, ...group.labels],
      []
    );

    const handleChange = item => {
      if (item) {
        const result = allOptions.filter(
          datum => datum.title === item.label
        )[0];

        console.log(result.title);
        onSelect({ id: result.title, type: result.type, title: result.title });
      } else {
        onSelect(null);
      }
    };

    const groupOptions = data.map(group => ({
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
        onFocus={() => this.setState({ focus: true })}
        onBlur={() => this.setState({ focus: false })}
        blurInputOnSelect={true}
        options={groupOptions}
        TextFieldProps={{
          className: classes.textField,
          label: "Colour by:",
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
  }
}
const Option = props => (
  <MenuItem
    ref={props.innerRef}
    selected={props.isFocused}
    component="span"
    style={{
      fontWeight: props.isSelected ? 500 : 400,
      background: props.isSelected ? "#e8ecf1" : ""
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);
const DropdownIndicator = props => <ArrowDropDown />;
const Menu = props => (
  <Paper
    square
    className={props.selectProps.classes.paper}
    {...props.innerProps}
  >
    {props.children}
  </Paper>
);
const ValueContainer = props => (
  <div
    style={{ width: 200 }}
    className={props.selectProps.classes.valueContainer}
  >
    {props.children}
  </div>
);
const inputComponent = ({ inputRef, ...props }) => (
  <span ref={inputRef} {...props} />
);
const Control = props => {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props;
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
      width={"225px"}
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
