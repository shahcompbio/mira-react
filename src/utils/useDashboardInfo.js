const useDashboardInfo = location => {
  const splitLocation = location.pathname.split("/").reverse();

  // Assumption based on root...
  // Best way is to replace based on REACT ROOT

  const [dashboardID, type, ...root] =
    splitLocation.length < 3 ? ["", ...splitLocation] : splitLocation;
  return [type, dashboardID];
};

export const useDashboardType = location => {
  return useDashboardInfo(location)[0];
};

export const useDashboardID = location => {
  return useDashboardInfo(location)[1];
};
