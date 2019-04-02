import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Scatterplot from "./Scatterplot";
import Donut from "./Donut";

import FacetController from "semiotic/lib/FacetController";

import { getColorScale } from "./colors";

const QUERY = gql`
  query($sampleID: String!) {
    cells(sampleID: $sampleID) {
      id
      x
      y
      cluster
      celltype
    }

    clusters(sampleID: $sampleID) {
      cluster
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
    console.log(this.state);
    return !sampleID ? null : (
      <Query query={QUERY} variables={{ sampleID }}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return null;

          const colorScale = getColorScale(
            data.clusters.map(cluster => cluster.cluster)
          );
          return (
            <FacetController>
              <Scatterplot
                data={data.cells}
                colorScale={colorScale}
                highlighted={this.state.highlighted}
              />
              <Donut
                data={data.clusters}
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
