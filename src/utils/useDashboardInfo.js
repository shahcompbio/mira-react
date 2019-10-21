import { useLocation } from "react-router";

const useDashboardInfo = () => {
  let location = useLocation();

  const splitLocation = location.pathname.split("/").reverse();

  // Assumption based on root...
  // Best way is to replace based on REACT ROOT

  const [dashboardID, type, ...root] =
    splitLocation.length < 3 ? ["", ...splitLocation] : splitLocation;
  return [type, dashboardID];
};

export const useDashboardType = () => {
  return useDashboardInfo()[0];
};

export const useDashboardID = () => {
  return useDashboardInfo()[1];
};
