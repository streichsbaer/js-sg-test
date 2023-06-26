var express = require('express');
const superagent = require('superagent');
import { get } from 'superagent';
const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var app = express();

app.get('/', function (req, res) {
   // ruleid: taint-backend-ssrf
   superagent.post(req.params.lmao)
      .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
      .set('X-API-Key', 'foobar')
      .set('accept', 'json')
      .end((err, res) => {
         console.log(res);
      });

   // ruleid: taint-backend-ssrf
   get(req.query.host)
      .then(res => {
         // res.body, res.headers, res.status
         console.log(res.body);
      })
      .catch(err => {
         // err.message, err.response
         console.log(err.message);
      });
});

app.get('/mitigation-1', function(req, res) {
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
   superagent.get(url.href).end((err, res) => {
       console.log(res);
   });
})

app.get('/mitigation-2', function(req, res) {
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
   superagent.get(url.href).end((err, res) => {
       console.log(res);
   });
})