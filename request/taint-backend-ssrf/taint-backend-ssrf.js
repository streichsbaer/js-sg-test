const request = require('request');
var express = require('express');

const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var app = express();

app.get('/', function (req, res) {
    // ruleid:taint-backend-ssrf
    request(req.query.name, function (error, response, body) {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    });

    // ruleid: taint-backend-ssrf
    request.get({
        url: req.query.name,
        agentOptions: {
            secureProtocol: 'SSLv3_method'
        }
    });

    const rand = Math.floor(Math.random()*100000000).toString()

    // ruleid: taint-backend-ssrf
    request({ method: 'PUT'
        , uri: req.query.test + rand
        , multipart:
        [ { 'content-type': 'application/json'
            ,  body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
            }
        , { body: 'I am an attachment' }
        ]
        }
    , function (error, response, body) {
        if(response.statusCode == 201){
            console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
        } else {
            console.log('error: '+ response.statusCode)
            console.log(body)
        }
        }
    )
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

    // pk: taint-backend-ssrf
    request.get(url.href);
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
    request.get(url.href);
})