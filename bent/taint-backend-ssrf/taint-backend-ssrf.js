var express = require('express');
const bent = require('bent');
const { buffer } = require('stream/consumers');
const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var app = express();

// Tests should be in a async/await function
app.get('/first-patterns', async function (req, res) {
    const getJSON = bent('json');
    const getBuffer = bent('buffer');

    // ruleid: taint-backend-ssrf
    let obj = await getJSON(req.query.a);

    // ruleid: taint-backend-ssrf
    let buffer = await getBuffer(req.params.b);

    const request = bent('POST');

    // ruleid: taint-backend-ssrf
    const response = request(req.params.c, { ok: true }, { 'content-type': 'application/jose+json' });

    const put = bent('PUT', 201, 'http://site.com');
    // ruleid: taint-backend-ssrf
    await put(req.params.f, Buffer.from('test'));
});

app.get('/second-patterns', async function (req, res) {
    // ruleid: taint-backend-ssrf
    const post = bent(req.query.d, 'POST', 'json', 200);
    const response = await post('cars/new', { name: 'bmw', wheels: 4 });

    const post2 = bent("https://some-site.com", 'POST', 'json', 200);
    // ok: taint-backend-ssrf
    const response2 = post2(req.query.e, { name: 'bmw', wheels: 4 });

    // ruleid: taint-backend-ssrf
    const put = bent(req.query.g, 'PUT', 201);
    await put('/upload', Buffer.from('test'));

    // todoruleid: taint-backend-ssrf
    const put2 = bent('PUT', 201, req.query.url)
    await put2('/upload', Buffer.from('test'))

    const put3 = bent('https://example.com', 'PUT', req.query.g)
    // ok: taint-backend-ssrf
    await put3(req.query.url, Buffer.from('test'))
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
    const get = bent(url.href, 'GET');
    await get();
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
    const get = bent(url.href, 'GET');
    await get();
})