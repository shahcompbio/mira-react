import React, { Component } from "react";

import Select from "react-select";
import { FixedSizeList as List } from "react-window";

class LabelSelect extends Component {
  componentDidMount() {
    this.props.onSelect(this.props.data[0]);
  }

  render() {
    const { data, onSelect } = this.props;

    const handleChange = item => {
      const result = data.filter(datum => datum.id === item.value)[0];
      onSelect(result);
    };

    const options = data.map(label => ({
      value: label.id,
      label: label.title
    }));

    const [cellType, clusterType, ...geneTypes] = options;

    const categoryGroup = [
      { value: "categories", label: "Cell Properties", type: "header" },
      cellType,
      clusterType
    ];
    const geneGroup = [
      { value: "genes", label: "Genes", type: "header" },
      ...geneTypes
    ];

    return (
      <div style={{ width: "300px" }}>
        <span>
          Color By
          <Select
            defaultValue={options[0]}
            onChange={handleChange}
            options={[...categoryGroup, ...geneGroup]}
            components={{ MenuList }}
            isOptionDisabled={option => option.hasOwnProperty("type")}
          />
        </span>
      </div>
    );
  }
}

class MenuList extends Component {
  render() {
    const height = 35;
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

const HeaderOption = ({ children, style }) => (
  <div style={style}>{children}</div>
);

export default LabelSelect;
