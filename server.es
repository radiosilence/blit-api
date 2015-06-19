import express from 'express';
import config from 'config';
import geoip from 'geoip-lite';

const serverConfig = config.get('server');
const app = express();

const ContentTypes = {
  JSON: 'application/json'
};

const getIPFromReq = req => req.headers['x-real-ip']
  ? req.headers['x-real-ip']
  : req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(', ').pop()
    : req.ip;

app.get('/', (req, res) => {
  let ip = getIPFromReq(req);
  // ip = '37.252.230.59';
  res.setHeader('Content-Type', ContentTypes.JSON);
  res.send({
    ip: ip,
    geo: geoip.lookup(ip),
    headers: req.headers,
  });
});

app.listen(serverConfig.http.port);