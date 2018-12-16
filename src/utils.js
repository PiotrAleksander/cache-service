import axios from "axios";
export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const setCacheName = (req, res, next) => {
  const cacheName = {
    ...req.query,
    ...req.body
  };
  res.express_redis_cache_name = JSON.stringify(cacheName);
  next();
};

export const makeRequestToApi = (url, method, results) => (req, res) => {
  console.log(url, req.originalUrl, method, results);
  return axios[method](`${url}${req.originalUrl}`, req.body, {
    headers: req.headers
  })
    .then(response => {
      console.log(response.data);
      return res.send(results ? response.data[results] : response.data);
    })
    .catch(error => console.log(error));
};
