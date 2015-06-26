
// Takes the IP, checks X-Real-IP > X-Forwarded-For > request IP
export var reqToIP = req => req.headers['x-real-ip']
  ? req.headers['x-real-ip']
  : req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(', ').pop()
    : req.ip;

