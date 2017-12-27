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

  signature (timestamp, method, requestPath, bodyConst) {
    let body = {};
    if (bodyConst) body = bodyConst;
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(`${timestamp}|${method}|/api/${this.version}/${requestPath}` + (method !== 'GET' ? `|${JSON.stringify(body)}` : ''));
    return hmac.digest('hex');
  }

  serialize (obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  request (...args) {
    const method = String(args[0]).toUpperCase();
    const requestPath = (Client.requestHasBody(method) ?  args[1]: [args[1], this.serialize(args[2])].join('?'));
    const body = (Client.requestHasBody(method) ? args.slice(-1)[0] : null);

    const req = {
      'hostname': 'coinfalcon.com',
      'headers': {
        'Content-Type': 'application/json; charset=utf-8'
      },
      'path': '/api/' + this.version + '/' + requestPath,
      'port': 443,
      'method': method,
      'body': JSON.stringify(body)
    };

    if (this.version === 'v1' && requestPath.indexOf('markets/') === 0) {
      // public request
    } else {
      let timestamp = Date.now().toString();
      timestamp = parseInt(timestamp.substring(0, timestamp.length - 3), 10);
      const signature = this.signature(timestamp, method, requestPath, body);

      req.headers['CF-API-KEY'] = this.key;
      req.headers['CF-API-TIMESTAMP'] = timestamp;
      req.headers['CF-API-SIGNATURE'] = signature;
    }

    return https.request(req);
  }

  static requestHasBody (method) {
    return method === 'POST' || method === 'PATCH';
  }
}
