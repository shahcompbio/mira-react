import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { scaleLinear, scalePoint, scaleSequential } from "d3-scale";
import {
  interpolateRainbow,
  interpolateYlGnBu,
  interpolateOrRd
} from "d3-scale-chromatic";

const CELLTYPES_QUERY = gql`
  query {
    celltypes(type: null, dashboardID: null) {
      name
    }
  }
`;

export const getCelltypeColors = () => {
  const { data, loading, error } = useQuery(CELLTYPES_QUERY);

  if (loading || error) return null;

  const { celltypes } = data;
  const names = celltypes.map(celltype => celltype["name"]);

  const ordinalScale = getOrdinalScale(names);
  const toColorScale = scaleSequential(interpolateRainbow).domain([0, 1]);
  return datum => toColorScale(ordinalScale(datum));
};

const getOrdinalScale = data =>
  scalePoint()
    .domain(data)
    .range([0, 0.9]);

export default label => {
  if (label["label"] === "celltype") {
    return getCelltypeColors();
  } else {
    const toColorScale = scaleSequential(interpolateOrRd).domain([0, 1]);
    return datum => toColorScale(datum);
  }
};
