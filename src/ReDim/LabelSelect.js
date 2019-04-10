import React, { Component } from "react";

import Select from "react-select";
import { List } from "react-virtualized";

class LabelSelect extends Component {
  componentDidMount() {
    this.props.onSelect(this.props.data[0]);
  }

  render() {
    const { data, onSelect } = this.props;

    const handleChange = item => {
      onSelect({
        id: item.value,
        title: item.label
      });
    };
    const options = data.map(label => ({
      value: label.id,
      label: label.title
    }));

    return (
      <div style={{ width: "300px" }}>
        <span>
          Color By
          <Select
            defaultValue={options[0]}
            onChange={handleChange}
            options={options}
            components={{ MenuList }}
          />
        </span>
      </div>
    );
  }
}

const MenuList = props => {
  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => (
    <div key={key}>{props.children[index]}</div>
  );

  return (
    <List
      rowHeight={20}
      height={500}
      width={300}
      rowCount={props.options.length}
      rowRenderer={rowRenderer}
      style={{
        width: "100%",
        zIndex: 11
      }}
    />
  );
};
export default LabelSelect;
