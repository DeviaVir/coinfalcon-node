import crypto from 'crypto';
var http_request = require('request');

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
    console.log('payload')
    if (args[1] == 'GET') {
      var payload = `${args[0]}|${args[1]}|/api/${this.version}/${args[2]}`
      hmac.update(`${args[0]}|${args[1]}|/api/${this.version}/${args[2]}`);
    }
    else {
      var payload = `${args[0]}|${args[1]}|/api/${this.version}/${args[2]}|${JSON.stringify(args[3])}`
      hmac.update(`${args[0]}|${args[1]}|/api/${this.version}/${args[2]}|${JSON.stringify(args[3])}`);
    }
    console.log(payload)
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
    console.log(args[0]);
    console.log([args[1], this.serialize(args[2])].join('/'));
    const method = String(args[0]).toUpperCase();
    const requestPath = (Client.requestHasBody(method) ?  args[1]: [args[1], this.serialize(args[2])].join('?'));
    const body = (Client.requestHasBody(method) ? args.slice(-2)[0] : null);

    console.log('requestpath is ');
    console.log(requestPath);

    const req = {
      'headers': {
        'Content-Type': 'application/json; charset=utf-8'
      },
      'url': 'http://localhost:3000/api/' + this.version + '/' + requestPath,
      'method': method,
      // 'body': body
      'json': true,
      'body': body
    };

    if (this.version === 'v1' && requestPath.indexOf('markets/') === 0) {
      // public request
    } else {
      let timestamp = Date.now().toString();
      timestamp = timestamp.substring(0, timestamp.length - 3);
      const signature = this.signature(timestamp, method, requestPath, body);


      req.headers['CF-API-KEY'] = this.key;
      req.headers['CF-API-SECRET'] = this.secret;
      req.headers['CF-API-TIMESTAMP'] = parseInt(timestamp, 10);
      req.headers['CF-API-SIGNATURE'] = signature;
    }
    var callback = args[args.length - 1];
    console.log(req);
    return http_request(req, function (err, res, body) {
      // Connection header by default is keep-alive,
      // we have to manualle end the socket
      callback(err, res, body);
    });
    //return http_request(req);
  }

  static requestHasBody (method) {
    return method === 'POST' || method === 'PATCH';
  }
}
