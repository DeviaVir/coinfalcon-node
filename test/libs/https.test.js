import tape from 'tape'
import path from 'path'
import tapeNock from 'tape-nock'
import sinon from 'sinon'
import { https } from '../../src/index'
const test = tapeNock(tape, {
  fixtures: path.join(__dirname, 'fixtures')
});

test('https - make get call', (t) => {
  test.nock('https://coinfalcon.com').get('/api').reply(200, {'body': true});
  return https.request({
    'hostname': 'coinfalcon.com',
    'port': 443,
    'path': '/api',
    'method': 'get'
  }).then(response => {
    t.deepEqual(response, { 'body': true }, 'should return body: true');
    t.end();
  });
});

test('https - make get call with custom header', (t) => {
  test.nock('https://coinfalcon.com', {
    'reqheaders': {
      'x-custom': 'value'
    }
  }).get('/api').reply(200, {'body': true});
  return https.request({
    'hostname': 'coinfalcon.com',
    'port': 443,
    'path': '/api',
    'method': 'get',
    'headers': {
      'x-custom': 'value'
    }
  }).then(response => {
    t.deepEqual(response, { 'body': true }, 'should return body: true');
    t.end();
  });
});

test('https - make invalid post call', (t) => {
  test.nock('https://coinfalcon.com', {
    'reqheaders': {}
  }).post('/api/v1/markets', { 'market': 'btc' }).reply(400, {
    'error': 'token is invalid'
  });

  return https.request({
    'hostname': 'coinfalcon.com',
    'port': 443,
    'path': '/api/v1/markets',
    'method': 'post',
    'body': { 'market': 'btc' }
  }).catch(err => {
    t.equal(err.message, 'token is invalid', 'should return error nicely');
    t.end();
  });
});
