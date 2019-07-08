import React, { Component } from "react";
import Select, { createFilter } from "react-select";
import { FixedSizeList as List } from "react-window";

class LabelSelect extends Component {
  componentDidMount() {
    this.props.onSelect(this.props.data[0]["labels"][0]);
  }

  render() {
    const { data, onSelect } = this.props;

    const allOptions = data.reduce(
      (options, group) => [...options, ...group.labels],
      []
    );

    const handleChange = item => {
      const result = allOptions.filter(datum => datum.id === item.value)[0];
      alert(result);
      onSelect(result);
    };

    const groupOptions = data.map(group => ({
      label: group.title,
      options: group.labels.map(label => ({
        value: label.id,
        label: label.title
      }))
    }));

    return (
      <div style={{ width: "600px" }}>
        <span>
          Color By
          <Select
            defaultValue={groupOptions[0]["options"][0]}
            onChange={handleChange}
            options={groupOptions}
            components={{ MenuList, Group }}
            filterOption={createFilter({ ignoreAccents: false })}
          />
        </span>
      </div>
    );
  }
}

const Group = ({ label }) => (
  <div style={{ background: "#e0e0e0", padding: "8px" }}>{label}</div>
);

const MenuList = ({ children, maxHeight }) => {
  const height = 35;

  const options = Array.isArray(children)
    ? children.reduce(
        (options, child) => [...options, child, ...child.props.children],
        []
      )
    : [];
  return (
    <List height={maxHeight} itemCount={options.length} itemSize={height}>
      {({ index, style }) => <div style={style}>{options[index]}</div>}
    </List>
  );
};

export default LabelSelect;
