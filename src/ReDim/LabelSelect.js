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

export default LabelSelect;
