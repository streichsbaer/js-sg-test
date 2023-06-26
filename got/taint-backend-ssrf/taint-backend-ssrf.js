var express = require('express');
const got = require('got');
import got2, { post, stream, extend, Options } from 'got';

const ip = require('ip-address');
import isValidDomain  from 'is-valid-domain';

var app = express()

// Tests should be in a await async function
app.get('/default-imports', async function (req, res) {
    // ruleid: taint-backend-ssrf
    const { headers } = await got(req.params.a,
        {
            headers: {
                foo: 'bar'
            }
        }
    ).json();

    const { headers2 } = await got(
        // ruleid: taint-backend-ssrf
        {
            url: req.params.b,
            headers: {
                foo: 'bar'
            }
        }
    ).json();

    // First test set
    const url = req.params.c;

    const options = {
        json: {
            documentName: 'Quick Start',
        },
    };

    // ruleid: taint-backend-ssrf
    const data = await got.post(url, options);

    // Second test set
    const options2 = {
        json: {
            documentName: 'Quick Start',
        },
    };

    // ruleid: taint-backend-ssrf
    const gotStream = got.stream.post(url, options2);

    // Third test set
    const options3 = {
        prefixUrl: req.params.d,
        headers: {
            Authorization: getTokenFromVault(),
        },
    };

    // ruleid: taint-backend-ssrf
    const client = got.extend(options3);

    // Fourth test set
    // ruleid: taint-backend-ssrf
    const req = got.stream({
        url: req.params.e,
        headers: headers,
        ecdhCurve: 'auto',
        timeout: 30000,
        ...(proxyArgIndex > -1 && { proxy: args[proxyArgIndex + 1] })
    })
});


app.get('/named-imports', async function (req, res) {
    // First test set
    const url = req.params.c;

    const options = {
        json: {
            documentName: 'Quick Start',
        },
    };

    // ruleid: taint-backend-ssrf
    const data = await post(url, options);

    // Second test set
    const options1 = {
        json: {
            documentName: 'Quick Start',
        },
    };

    // ruleid: taint-backend-ssrf
    const gotStream = stream.post(url, options1);

    // Third test set
    const options2 = {
        prefixUrl: req.params.d,
        headers: {
            Authorization: getTokenFromVault(),
        },
    };

    // ruleid: taint-backend-ssrf
    const client = extend(options2);


    // Fourth test set
    // ruleid: taint-backend-ssrf
    const req = stream({
        url: req.params.e,
        headers: headers,
        ecdhCurve: 'auto',
        timeout: 30000,
        ...(proxyArgIndex > -1 && { proxy: args[proxyArgIndex + 1] })
    })
});

app.get('/test01', async function (req, res) {
    const options = new got.Options({
        // ruleid: taint-backend-ssrf
        prefixUrl: req.query.url,
        headers: {
            foo: 'foo'
        }
    })
    const { headers } = await got('anything', undefined, options).json()
})

app.get('/test02', async function (req, res) {
    const options = new Options({
        // ruleid: taint-backend-ssrf
        url: req.query.url,
        headers: {
            foo: 'foo'
        }
    })
    const { headers } = await got2('anything', undefined, options).json()
})

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
    await got.get(url.href);
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
    await got.get(url.href)
})