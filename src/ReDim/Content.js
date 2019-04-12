import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReDimPlot from "./ReDimPlot";
import AbundancePlot from "./AbundancePlot";

import FacetController from "semiotic/lib/FacetController";

import { getColorScale } from "./colors";

const QUERY = gql`
  query($sampleID: String!, $label: String!, $labelType: String!) {
    cells(sampleID: $sampleID, label: $label, labelType: $labelType) {
      name
      x
      y
      label
    }

    colorLabelValues(
      sampleID: $sampleID
      label: $label
      labelType: $labelType
    ) {
      name
      count
    }
  }
`;

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: null
    };
  }

  hoverBehavior = d => {
    if (d) {
      this.setState({
        highlighted: d.hasOwnProperty("pieces") ? d.pieces[0].data.name : d.name
      });
    } else {
      this.setState({
        highlighted: null
      });
    }
  };

  render() {
    const { sampleID, label } = this.props;

    return !sampleID || !label ? null : (
      <Query
        query={QUERY}
        variables={{ sampleID, label: label.id, labelType: label.type }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;

          const colorScale = getColorScale(
            data.colorLabelValues.map(labelValue => labelValue.name),
            label.type
          );

          return (
            <div style={DivStyles}>
              <FacetController>
                <ReDimPlot
                  data={data.cells}
                  colorScale={colorScale}
                  highlighted={this.state.highlighted}
                  labelTitle={label.title}
                />
                <AbundancePlot
                  label={label}
                  data={data.colorLabelValues}
                  colorScale={colorScale}
                  hoverBehavior={this.hoverBehavior}
                />
              </FacetController>
            </div>
          );
        }}
      </Query>
    );
  }
}

const DivStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between"
};

export default Content;
