const useDashboardInfo = location => {
  const splitLocation = location.pathname.split("/").reverse();

  // Assumption based on root...
  // Best way is to replace based on REACT ROOT

  // eslint-disable-next-line
  const [dashboardID, type, ..._] =
    splitLocation.length < 3 ? ["", ...splitLocation] : splitLocation;
  return [type, dashboardID];
};

export const useDashboardType = location => {
  const dashboardType = useDashboardInfo(location)[0];
  return dashboardType === "" ? null : dashboardType;
};

export const useDashboardID = location => {
  return useDashboardInfo(location)[1];
};
