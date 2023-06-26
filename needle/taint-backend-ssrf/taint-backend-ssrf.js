var express = require('express');
var needle = require('needle');

const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var app = express();

app.get('/', function (req, res) {
    // ruleid: taint-backend-ssrf
    needle('get', req.params.foo).then(res => {
        console.log(res.body);
    })
        .catch(err => {
            console.error(err);
        });

    // ruleid: taint-backend-ssrf
    needle.get(req.query.abc, function (error, response) {
        if (!error && response.statusCode == 200)
            console.log(response.body);
    });


    // ruleid: taint-backend-ssrf
    needle.post(req.query.bcd)
        .pipe(out)
        .on('finish', () => {
            console.log('pipe done');
        });

    // ruleid: taint-backend-ssrf
    needle.request('get', req.body.haha, params, { json: true }, function (err, resp) {
        if (resp.statusCode == 200) console.log('It worked!');
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
    needle.get(url.href);
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
    needle.get(url.href);
})