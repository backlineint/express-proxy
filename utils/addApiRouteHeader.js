const addApiRouteHeader = (url, res) => {
  const apiRoutesHeader = res.getHeader('api-routes');
  const apiRoutes = typeof(apiRoutesHeader) === 'undefined' ? [] : apiRoutesHeader.split(',');
  apiRoutes.push(url);
  res.setHeader('api-routes', apiRoutes.join());
}

export default addApiRouteHeader;