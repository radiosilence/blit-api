import config from 'config';
import express from 'express';
import geoip from 'geoip-lite';
import useragent from 'express-useragent';
import { reqToIP } from '../utils';
import { ContentTypes } from '../constants';

const router = express.Router();

// Just returns some handy information.
router.get('/', (req, res) => {
  let ip = reqToIP(req);
  res.setHeader('Content-Type', ContentTypes.JSON);
  res.send({
    ip: ip,
    geo: geoip.lookup(ip),
    headers: req.headers,
    user: req.user || `${config.get('url')}/auth/facebook`,
    cookies: req.cookies
  });
});

// Returns analysed user-agent information.
router.get('/ua', (req, res) => {
  let ua = useragent.parse(req.headers['user-agent']);
  delete ua.geoIp;

  res.setHeader('Content-Type', ContentTypes.JSON);
  res.send(ua);
});

// A slow to load URL
router.get('/delay/:delay', (req, res) => {
  setTimeout(() => {
    res.send('OK');
  }, parseInt(req.params.delay));
});

export default router;