import React, {Component} from "react";
import {Container, Header} from "semantic-ui-react";
import Select, {createFilter} from "react-select";
import {FixedSizeList as List} from "react-window";

class LabelSelect extends Component {
  componentDidMount() {
    this.props.onSelect(this.props.data[0]["labels"][0]);
  }

  render() {
    const {data, onSelect} = this.props;

    const allOptions = data.reduce(
      (options, group) => [...options, ...group.labels],
      []
    );

    const handleChange = item => {
      if (item) {
        const result = allOptions.filter(datum => datum.id === item.value)[0];
        onSelect(result);
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
    const customSelectStyles = {
      option: (styles, state) => ({
        ...styles,
        color: state.isSelected ? "#000" : styles.color,
        backgroundColor: state.isSelected ? "rgb(243, 246, 251)" : styles.color,
        borderBottom: "1px solid rgba(0, 0, 0, 0.125)",
        "&:hover": {
          color: "#000",
          backgroundColor: "#d2e0f7"
        }
      }),
      control: (styles, state) => ({
        ...styles,
        boxShadow: state.isFocused ? "0 0 0 0.2rem #f3f6fb" : 0,
        borderColor: state.isFocused ? "#c0dbe2" : "#CED4DA",
        "&:hover": {
          borderColor: state.isFocused ? "#c0dbe2" : "#CED4DA"
        }
      })
    };

    return (
      <Container style={{zIndex: "150"}}>
        <Header as="h4">Color By:</Header>
        <div style={{"z-index": "150", position: "relative"}}>
          <Select
            styles={customSelectStyles}
            defaultValue={groupOptions[0]["options"][0]}
            onChange={handleChange}
            options={groupOptions}
            components={{MenuList, Group}}
            isSearchable
            filterOption={createFilter({ignoreAccents: false})}
          />
        </div>
      </Container>
    );
  }
}

const groupBadgeStyles = {
  backgroundColor: "#bfbfbf",
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
const Group = ({label, options}) => (
  <div style={{background: "#efefef", padding: "8px", fontWeight: "bold"}}>
    <span>{label}</span>
    <span style={groupBadgeStyles}>{options.length}</span>
  </div>
);

const MenuList = ({children, maxHeight}) => {
  const height = 35;

  const options = Array.isArray(children)
    ? children.reduce(
        (options, child) => [...options, child, ...child.props.children],
        []
      )
    : [];
  return (
    <List height={maxHeight} itemCount={options.length} itemSize={height}>
      {({index, style}) => <div style={style}>{options[index]}</div>}
    </List>
  );
};

export default LabelSelect;
