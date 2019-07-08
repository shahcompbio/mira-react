import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReDimPlot from "./ReDimPlot";
import AbundancePlot from "./AbundancePlot";

import FacetController from "semiotic/lib/FacetController";

import { getColorScale } from "./colors";

const QUERY = gql`
  query(
    $patientID: String!
    $sampleID: String!
    $label: String!
    $labelType: String!
  ) {
    cells(
      patientID: $patientID
      sampleID: $sampleID
      label: $label
      labelType: $labelType
    ) {
      name
      x
      y
      label
    }

    colorLabelValues(
      patientID: $patientID
      sampleID: $sampleID
      label: $label
      labelType: $labelType
    ) {
      name
      count
      ... on Gene {
        min
        max
      }
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
      if (d["__typename"] === "Categorical") {
        this.setState({
          highlighted: cell => d.name === cell.label
        });
      } else {
        this.setState({
          highlighted: cell => d.min <= cell.label && cell.label < d.max
        });
      }
    } else {
      this.setState({
        highlighted: null
      });
    }
  };

  render() {
    const { patientID, sampleID, label } = this.props;

    return !sampleID || !label ? null : (
      <Query
        query={QUERY}
        variables={{
          patientID,
          sampleID,
          label: label.id,
          labelType: label.type
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;

          const colorScale = getColorScale(
            data.colorLabelValues.map(labelValue =>
              label.type === "categorical" ? labelValue.name : labelValue.max
            ),
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
  display: "flexwrap",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between"
};

export default Content;
