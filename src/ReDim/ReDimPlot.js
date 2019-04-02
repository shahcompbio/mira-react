import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import XYFrame from "semiotic/lib/XYFrame";

const QUERY = gql`
  query($sampleID: String!) {
    cells(sampleID: $sampleID) {
      id
      x
      y
      cluster
      celltype
    }
  }
`;

const ReDimPlot = ({ sampleID }) =>
  !sampleID ? null : (
    <Query query={QUERY} variables={{ sampleID }}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return null;

        const frameProps = getFrameProps(data.cells);
        return <XYFrame {...frameProps} />;
      }}
    </Query>
  );

const getFrameProps = cells => ({
  points: cells,

  size: [700, 500],
  margin: { left: 60, bottom: 90, right: 10, top: 40 },

  xAccessor: "x",
  yAccessor: "y",

  pointStyle: d => ({
    r: 3,
    fill: "#bee3df",
    stroke: "#9fd0cb"
  }),
  axes: [
    { orient: "left", label: "y" },
    { orient: "bottom", label: { name: "x", locationDistance: 55 } }
  ],
  legend: {
    legendGroups: [
      {
        styleFn: d => ({ fill: d.color, stroke: "black" }),
        items: [
          { label: "Test", color: "red" },
          { label: "Test 2", color: "blue" }
        ]
      }
    ]
  }
});

export default ReDimPlot;
