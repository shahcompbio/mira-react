import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

import Autocomplete from "react-autocomplete";
import { List, CellMeasurer, CellMeasurerCache } from "react-virtualized";

class LabelSelect extends Component {
  constructor() {
    super();

    this.state = {
      searchingFor: "",
      selection: ""
    };
  }
  componentDidMount() {
    this.props.onSelect(this.props.data[0]);
  }

  renderItem = item => {
    return <div>{item.title}</div>;
  };
  renderMenu = (items, searchingFor, autocompleteStyle) => {
    const rowRenderer = ({ key, index, parent, style }) => {
      const Item = items[index];
      const onMouseDown = e => {
        if (e.button === 0) {
          Item.props.onClick(e);
        }
      };
      return (
        <div key={key} style={style}>
          {Item}
        </div>
      );
    };

    return (
      <List
        rowHeight={20}
        height={500}
        rowCount={items.length}
        rowRenderer={rowRenderer}
        width={200}
        style={{
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid black",
          height: "auto",
          maxHeight: "500px",
          overflowY: "scroll",
          display: items.length ? "block" : "none"
        }}
      />
    );
  };

  render() {
    const { data, onSelect } = this.props;

    const handleChange = (e, { value }) => {
      const label = data.filter(label => label.id === value);
      return onSelect(label[0]);
    };

    const options = data.map(label => ({
      key: label.id,
      text: label.title,
      value: label.id
    }));
    console.log(data);
    return (
      <Autocomplete
        renderItem={this.renderItem}
        items={data}
        getItemValue={item => item.title}
        value={this.state.searchingFor}
        onChange={(e, value) => this.setState({ searchingFor: value })}
        onSelect={onSelect}
        renderMenu={this.renderMenu}
      />
      // <span>
      //   Color by &nbsp;
      //   <Dropdown
      //     onChange={handleChange}
      //     selection
      //     options={options}
      //     defaultValue={options[0].value}
      //   />
      // </span>
    );
  }
}
export default LabelSelect;
