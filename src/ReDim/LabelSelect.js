import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class LabelSelect extends Component {
  componentDidMount() {
    this.props.onSelect(this.props.data[0]);
  }
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

    return (
      <Dropdown
        onChange={handleChange}
        placeholder="Color By..."
        selection
        options={options}
        defaultValue={options[0].value}
      />
    );
  }
}
export default LabelSelect;
