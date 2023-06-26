var express = require('express');
const urllib = require('urllib');
// import urllib from 'urllib'
import { request } from 'urllib';
// const request = require('request');
const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var app = express();

// Tests should be in a async/await function
app.get('/', async function (req, res) {
  // ruleid:taint-backend-ssrf
  await urllib.request(req.query.foo, {
    method: 'GET',
    data: {
      'a': 'hello',
      'b': 'world',
    },
  });

  // Should be in a async/await function
  // ruleid:taint-backend-ssrf
  await request(req.params.bar, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    data: {
      a: 'hello',
      b: 'world',
    }
  });
});

app.get('/mitigation-1', async function(req, res) {
  const whitelist = ['google.com', 'guardrails.io'];
  let url = new URL(req.query.url);

  // Checks for valid domains to avoid possible whitelist bypass
  if (!isValidDomain(url.hostname)) {
      res.status(500).send("The URL specified is not allowed");
  }
  // Checking against whitelist
  // highlight-next-line
  if (!whitelist.includes(url.hostname)) {
      res.status(500).send("The URL specified is not allowed");
  }
  
  // ok: taint-backend-ssrf
  const { data, res } = await urllib.request(url.href);
})

app.get('/mitigation-2', async function(req, res) {
  const blacklist = ['127.0.0.1', '192.168.0.1', '0.0.0.0'];
  const blacklist_host = ['1234', '4567'];

  // Input in the form of http://192.168.0.1:1234
  let url = new URL(req.query.url);
  let hostname = url.hostname;
  let port = url.port;

  // Set to default port
  if (port == '') {
      if (url.protocol == "http:") {
          port = '80';
      } else if (url.protocol == "https:") {
          port = '443';
      }
  }

  // Checks for valid domains to avoid possible whitelist bypass
  if (!ip.Address4.isValid(hostname)) {
      res.status(500).send("The URL specified is not allowed");
  }

  // Checking against blacklist
  // highlight-next-line
  if (blacklist.includes(hostname)) {
      res.status(500).send("The URL specified is not allowed");
  }
  if (blacklist_host.includes(port)) {
      res.status(500).send("The URL specified is not allowed");
  }

  // ok: taint-backend-ssrf
  const { data, res } = await urllib.request(url.href);
})