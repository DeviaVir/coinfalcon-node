import crypto from 'crypto';
import https from '../libs/https';

export default class Client {
  constructor (key, secret, version = 'v1') {
    this.version = version;
    this.key = key;
    this.secret = secret;
  }

  get (...args) {
    return this.request(...['get'].concat(...args));
  }

  post (...args) {
    return this.request(...['post'].concat(...args));
  }

  put (...args) {
    return this.request(...['patch'].concat(...args));
  }

  patch (...args) {
    return this.request(...['patch'].concat(...args));
  }

  delete (...args) {
    return this.request(...['delete'].concat(...args));
  }

  signature (...args) {
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(`${args[0]}|/api/${this.version}/${args[1]}|` + (args[2] ? `${JSON.stringify(args[2])}` : '{}'));
    return hmac.digest('hex');
  }

  request (...args) {
    const method = String(args[0]).toUpperCase();
    const requestPath = (Client.requestHasBody(method) ? args.slice(1, -1) : args.slice(1)).join('/');
    const body = (Client.requestHasBody(method) ? args.slice(-1)[0] : null);

    const req = {
      'hostname': 'coinfalcon.com',
      'headers': {
        'Content-Type': 'application/json; charset=utf-8'
      },
      'path': '/api/' + this.version + '/' + requestPath,
      'port': 443,
      'method': method,
      'body': body
    };

    if (this.version === 'v1' && requestPath.indexOf('markets/') === 0) {
      // public request
    } else {
      const signature = this.signature(method, requestPath, body);
      let timestamp = Date.now().toString();
      timestamp = timestamp.substring(0, timestamp.length - 3);

      req.headers['CF-API-KEY'] = this.key;
      req.headers['CF-API-SECRET'] = this.secret;
      req.headers['CF-API-TIMESTAMP'] = parseInt(timestamp, 10);
      req.headers['CF-API-SIGNATURE'] = signature;
    }

    return https.request(req);
  }

  static requestHasBody (method) {
    return method === 'POST' || method === 'PATCH';
  }
}
