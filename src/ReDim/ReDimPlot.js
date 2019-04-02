import React from "react";

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
      id
      count
    }
  }
`;

const ReDimPlot = ({ sampleID }) =>
  !sampleID ? null : (
    <Query query={QUERY} variables={{ sampleID }}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return null;

        const colorScale = getColorScale(
          data.clusters.map(cluster => cluster.id)
        );
        return (
          <FacetController>
            <Scatterplot data={data.cells} colorScale={colorScale} />
            <Donut data={data.clusters} colorScale={colorScale} />
          </FacetController>
        );
      }}
    </Query>
  );

export default ReDimPlot;
