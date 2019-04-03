import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Scatterplot from "./Scatterplot";
import Donut from "./Donut";

import FacetController from "semiotic/lib/FacetController";

import { getColorScale } from "./colors";

const QUERY = gql`
  query($sampleID: String!, $label: String!) {
    cells(sampleID: $sampleID, label: $label) {
      id
      x
      y
      label
    }

    colorLabelValues(sampleID: $sampleID, label: $label) {
      id
      count
    }
  }
`;

class ReDimPlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: null
    };
  }

  hoverBehavior = d => {
    if (d) {
      this.setState({
        highlighted: d.column.name
      });
    } else {
      this.setState({
        highlighted: null
      });
    }
  };

  render() {
    const { sampleID } = this.props;
    //console.log(this.state);
    return !sampleID ? null : (
      <Query query={QUERY} variables={{ sampleID, label: "cell_type" }}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;

          const colorScale = getColorScale(
            data.colorLabelValues.map(labelValue => labelValue.id)
          );
          return (
            <FacetController>
              <Scatterplot
                data={data.cells}
                colorScale={colorScale}
                highlighted={this.state.highlighted}
              />
              <Donut
                data={data.colorLabelValues}
                colorScale={colorScale}
                hoverBehavior={this.hoverBehavior}
              />
            </FacetController>
          );
        }}
      </Query>
    );
  }
}

export default ReDimPlot;
