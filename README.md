# Coinfalcon [![Build Status](https://secure.travis-ci.org/DeviaVir/coinfalcon-node.png?branch=master)](https://travis-ci.org/DeviaVir/coinfalcon-node.svg?branch=master) 

With this Node module you can plug into the no-fees and fast [Coinfalcon](https://coinfalcon.com/).

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Example request](#example-requests)

## Installation

    npm install coinfalcon --save

## Getting Started

First you need to sign-up for a [Coinfalcon](https://coinfalcon.com/sign_up) account and obtain your unique **API Key** and **API Secret**. You will find both under [API](https://coinfalcon.com/settings/applications). Once you have set up your account, you can start using Coinfalcon's API client in your applications. You can find all API calls and parameters on [Coinfalcon's API documentation page](https://docs.coinfalcon.com/).

## Example usage

npm i --save coinfalcon

`client.js`:
```
const client = require('coinfalcon')

const coinfalconClient = new client.Client('KEY', 'SECRET');

coinfalconClient.get('markets/BTC-EUR/trades').then(res => {
  console.log('fetched!', res);
}).catch(err => {
  console.log('Whoops, something went wrong!', err);
});

coinfalconClient.get('user/orders', {'market': 'BTC-EUR'}).then(res => {
  console.log('fetched!', res);
}).catch(err => {
  console.log('Whoops, something went wrong!', err);
});
```

`node client.js` 
