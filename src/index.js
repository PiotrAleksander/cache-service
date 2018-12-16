import express from "express";
import expressRedisCache from "express-redis-cache";
import bodyParser from "body-parser";
import { asyncMiddleware, makeRequestToApi } from "./utils";

const config = require("../config.json");

const app = express();
const cache = expressRedisCache();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

config.routes.forEach(route => {
  const method = route.method.toLowerCase();
  app[method](
    route.route,
    require("./utils")[route.cacheNameSetter],
    cache.route({ ...(route.expiration && { expire: route.expiration }) }),
    asyncMiddleware(makeRequestToApi(route.requestTo, method, route.results))
  );
});

app.on("error", error => console.log(error));

app.listen(port, () => console.log(`App is listening on ${port}`));
