import addApiRouteHeader from "./addApiRouteHeader";

// This function mainly exists to demonstrate the limitations of this approach
const cacheAwareFetch = function (url, res, init = {}) {
  addApiRouteHeader(url, res);

  return fetch(url, init);
};

export default cacheAwareFetch;