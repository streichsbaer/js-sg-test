var express = require('express');
var net = require('node:net');
import { connect, createConnection, connect, Socket } from 'net';

const http = require('node:http');
const https = require('https');
import { request, get } from 'https';

const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var app = express();

app.get('/net-modules-first-imports', function (req, res) {
    var client1 = new net.Socket();
    // ruleid: taint-backend-ssrf
    client1.connect(1337, req.body.host, function () {
        console.log('Connected');
        client1.write('Hello, server! Love, Client.');
    });

    // ruleid: taint-backend-ssrf
    const client2 = net.createConnection({ host: req.params.host, port: 8124 }, () => {
        console.log('connected to server!');
        client2.write('world!\r\n');
    });

    // ruleid: taint-backend-ssrf
    const client3 = net.connect({ port: 8124, host: req.query.host }, () => {
        console.log('connected to server!');
        client3.write('world!\r\n');
    });

    // ruleid: taint-backend-ssrf
    const client4 = net.connect(8124, req.query.host, () => {
        console.log('connected to server!');
        client4.write('world!\r\n');
    });

});

app.get('/net-modules-second-imports', function (req, res) {
    var client1 = new Socket();
    // ruleid: taint-backend-ssrf
    client1.connect(1337, req.body.host, function () {
        console.log('Connected');
        client1.write('Hello, server! Love, Client.');
    });

    // ruleid: taint-backend-ssrf
    const client2 = createConnection({ host: req.params.host, port: 8124 }, () => {
        console.log('connected to server!');
        client2.write('world!\r\n');
    });

    // ruleid: taint-backend-ssrf
    const client3 = connect({ port: 8124, host: req.query.host }, () => {
        console.log('connected to server!');
        client3.write('world!\r\n');
    });

    // ruleid: taint-backend-ssrf
    const client4 = connect(8124, req.query.host, () => {
        console.log('connected to server!');
        client4.write('world!\r\n');
    });

});

app.get('/http-modules-first-imports', function (req, res) {
    const options = {
        hostname: req.params.host,
        port: 443,
        path: '/',
        method: 'GET',
    };
    // ruleid: taint-backend-ssrf
    const http_req = http.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    // ruleid: taint-backend-ssrf
    const https_req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    // ruleid: taint-backend-ssrf
    http.get(req.query.host, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });

    // ruleid: taint-backend-ssrf
    https.get(req.query.host, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });
});

app.get('/http-modules-second-imports', function (req, res) {
    const options = {
        hostname: req.params.host,
        port: 443,
        path: '/',
        method: 'GET',
    };
    // ruleid: taint-backend-ssrf
    const http_req = request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    // ruleid: taint-backend-ssrf
    get(req.query.host, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
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
    http.get(url.href, (res) => {
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
    http.get(url.href, (res) => {
        console.log(res);
    });
})