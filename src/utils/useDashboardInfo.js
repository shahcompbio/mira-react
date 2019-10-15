import { useLocation } from "react-router";

const useDashboardInfo = () => {
  let location = useLocation();
  const [dashboardID, type, ...root] = location.pathname.split("/").reverse();
  return [type, dashboardID];
};

export const useDashboardType = () => {
  return useDashboardInfo()[0];
};

export const useDashboardID = () => {
  return useDashboardInfo()[1];
};
