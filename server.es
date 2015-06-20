import config from 'config';
import express from 'express';
import geoip from 'geoip-lite';
import useragent from 'express-useragent';

const serverConfig = config.get('server');
const app = express();

// Constants for Content-Type headers.
const ContentTypes = {
  JSON: 'application/json'
};

// Takes the IP, checks X-Real-IP > X-Forwarded-For > request IP
const reqToIP = req => req.headers['x-real-ip']
  ? req.headers['x-real-ip']
  : req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(', ').pop()
    : req.ip;

// The only endpoint so far. Just returns some handy information.
app.get('/', (req, res) => {
  let ip = reqToIP(req);
  res.setHeader('Content-Type', ContentTypes.JSON);
  res.send({
    ip: ip,
    geo: geoip.lookup(ip),
    headers: req.headers,
    ua: useragent.parse(req.headers['user-agent'])
  });
});

// Start her up.
app.listen(serverConfig.http.port);