import test from 'tape'
import sinon from 'sinon'
import { Client, https } from '../../src/index'

const coinfalconClient = new Client('CUSTOM_KEY', 'CUSTOM_SECRET');
const coinfalconClientv2 = new Client('CUSTOM_KEY', 'CUSTOM_SECRET', 'v2');

test('new client v1 - constructor - key/secret', (t) => {
  t.equal(coinfalconClient.key, 'CUSTOM_KEY');
  t.equal(coinfalconClient.secret, 'CUSTOM_SECRET');
  t.equal(coinfalconClient.version, 'v1');
  t.end();
});

test('new client v2 - constructor - version', (t) => {
  t.equal(coinfalconClientv2.version, 'v2');
  t.end();
});

let requestStub;
test('new client - request stubbing', (t) => {
  requestStub = sinon.stub(coinfalconClient, 'request');
  requestStub.returns(Promise.resolve());
  t.end();
});

test('new client - get', (t) => {
  requestStub.resetHistory();
  return coinfalconClient.get('resource_path').then(() => {
    t.equal(coinfalconClient.request.callCount, 1, 'should be called one time');
    t.equal(coinfalconClient.request.getCall(0).args[0], 'get', 'first argument should be get');
    t.equal(coinfalconClient.request.getCall(0).args[1], 'resource_path', 'second argument should be resource path');
    t.end();
  });
});

test('new client - post', (t) => {
  requestStub.resetHistory();
  return coinfalconClient.post('resource_path', { 'body': true }).then(() => {
    t.equal(coinfalconClient.request.callCount, 1, 'should be called one time');
    t.equal(coinfalconClient.request.getCall(0).args[0], 'post', 'first argument should be post');
    t.equal(coinfalconClient.request.getCall(0).args[1], 'resource_path', 'second argument should be resource path');
    t.deepEqual(coinfalconClient.request.getCall(0).args[2], { 'body': true }, 'third argument should be body');
    t.end();
  });
});

test('new client - request restore', (t) => {
  requestStub.restore();
  t.end();
});

let httpsrequest;
test('new client - https stub', (t) => {
  httpsrequest = sinon.stub(https, 'request');
  httpsrequest.returns(Promise.resolve());
  t.end();
});

test('new client - request - hostname', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.callCount, 1, 'should be called one time');
    t.equal(httpsrequest.getCall(0).args[0].hostname, 'coinfalcon.com', 'hostname should be coinfalcon.com');
    t.end();
  });
});

test('new client - request - header token', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.getCall(0).args[0].headers['CF-API-KEY'], 'CUSTOM_KEY', 'headers.CF-API-KEY should include key');
    t.end();
  });
});

test('new client - request - header content-type', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.getCall(0).args[0].headers['Content-Type'], 'application/json; charset=utf-8', 'headers.Content-Type should include JSON');
    t.end();
  });
});

test('new client - request - path', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.getCall(0).args[0].path, '/api/v1/resource_path', 'path should be set to resource_path with version including format');
    t.end();
  });
});

test('new client - request - path post', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('post', 'resource_path', {}).then(() => {
    t.equal(httpsrequest.getCall(0).args[0].path, '/api/v1/resource_path', 'path should be set to resource_path with version including format');
    t.end();
  });
});

test('new client - request - port', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.getCall(0).args[0].port, 443, 'port should always be set to SSL');
    t.end();
  });
});

test('new client - request - method', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.getCall(0).args[0].method, 'GET', 'should be uppercase');
    t.end();
  });
});

test('new client - request - method post', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('post', 'resource_path', {}).then(() => {
    t.equal(httpsrequest.getCall(0).args[0].method, 'POST', 'should be uppercase');
    t.end();
  });
});

test('new client - request - body', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('get', 'resource_path').then(() => {
    t.equal(httpsrequest.getCall(0).args[0].body, null);
    t.end();
  });
});

test('new client - request - body on post', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('post', 'resource_path', { 'body': true }).then(() => {
    t.deepEqual(httpsrequest.getCall(0).args[0].body, { 'body' : true });
    t.end();
  });
});

test('new client - request - body on patch', (t) => {
  httpsrequest.resetHistory();
  return coinfalconClient.request('patch', 'resource_path', { 'body': true }).then(() => {
    t.deepEqual(httpsrequest.getCall(0).args[0].body, { 'body' : true });
    t.end();
  });
});

test('new client - https restore', (t) => {
  httpsrequest.restore();
  t.end();
});

test('client - requestHasBody - POST', (t) => {
  t.equal(Client.requestHasBody('POST'), true);
  t.end();
});

test('client - requestHasBody - PATCH', (t) => {
  t.equal(Client.requestHasBody('PATCH'), true);
  t.end();
});

test('client - requestHasBody - GET', (t) => {
  t.equal(Client.requestHasBody('GET'), false);
  t.end();
});

test('client - requestHasBody - DELETE', (t) => {
  t.equal(Client.requestHasBody('DELETE'), false);
  t.end();
});
