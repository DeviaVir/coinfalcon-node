Node.js module for Coinfalcon.com API
===========

[![Build Status](https://secure.travis-ci.org/DeviaVir/coinfalcon-node.png?branch=master)](https://travis-ci.org/DeviaVir/coinfalcon-node.svg?branch=master)

# Warning: this is currently a work in progress and not working yet.

Follow https://github.com/carlos8f/zenbot/issues/756 for up-to-date status.

# Coinfalcon

With this Node module you can plug into the no-fees and fast [Coinfalcon](https://coinfalcon.com/).

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Example request](#example-requests)

## Installation

    npm install coinfalcon --save

## Getting Started

First you need to sign-up for a [Coinfalcon](https://coinfalcon.com/sign_up) account and obtain your unique **API Key** and **API Secret**. You will find both under [API](https://coinfalcon.com/settings/applications). Once you have set up your account, you can start using Coinfalcon's API client in your applications.

## Example requests

```
import { Client } from 'coinfalcon'

const coinfalconClient = new Client('KEY', 'SECRET');
coinfalconClient.get('markets/BTC-EUR/trades').then(res => {
  console.log('fetched!', res);
}).catch(err => {
  console.log('Whoops, something went wrong!', err);
});
```

```
import { Client } from 'coinfalcon'

const coinfalconClient = new Client('KEY', 'SECRET');
coinfalconClient.get('user/orders', {'market': 'BTC-EUR'}).then(res => {
  console.log('fetched!', res);
}).catch(err => {
  console.log('Whoops, something went wrong!', err);
});
```
