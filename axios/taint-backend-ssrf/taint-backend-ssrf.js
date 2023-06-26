const axios = require('axios');
// import axios from 'axios';

import { post } from 'axios';
import request from 'axios';
const ip = require('ip-address');
const isValidDomain = require('is-valid-domain');

var express = require('express');

var app = express();

app.get('/default-export', function (req, res) {
    // ruleid: taint-backend-ssrf
    axios.get(req.body.bar)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

    // ruleid: taint-backend-ssrf
    axios.request({
        url: req.body.foo,
        method: 'get',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        params: {
            ID: 12345
        },
    })

    // ruleid: taint-backend-ssrf
    axios({
        method: 'post',
        url: req.cookies.abc,
        data: {
            firstName: 'Fred',
            lastName: 'Flintstone'
        }
    });

    // ruleid: taint-backend-ssrf
    axios({
        method: 'get',
        url: req.query.abc,
        responseType: 'stream'
    })
        .then(function (response) {
            response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
        });
});


app.get('/named-export', function (req, res) {
    // ruleid: taint-backend-ssrf
    post(req.params.lmao, {
        firstName: 'Fred',
        lastName: 'Flintstone'
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

    // ruleid: taint-backend-ssrf
    request({
        url: req.body.foo,
        method: 'get',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        params: {
            ID: 12345
        },
    })
});


app.get('/instance-methods', function (req, res) {
    const client = axios.create({
        headers: {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ConsistencyLevel: 'eventual',
        },
    });

    const searchParams = appNamePrefixes
        .map((name) => `"displayName:${name}"`)
        .join(' OR ');

    const remove = (id) =>
        client.delete(
            // ruleid: taint-backend-ssrf
            req.body.id
        );

    const list = () =>
        // ruleid: taint-backend-ssrf
        client.get(req.params.haha,
            {
                params: {
                    $select: 'id',
                    $search: searchParams,
                    $count: 'true',
                    $top: '999',
                },
            }
        );

    const instance = axios.create({
        // ruleid: taint-backend-ssrf
        baseURL: req.params.baseurl,
    });

    // Make a GET request using the instance
    instance.get('users')
        .then(response => {
            // Handle the response data
            console.log(response.data);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
});

app.get('/test01', function (req, res) {
    let instance = axios.create({
        // ruleid: taint-backend-ssrf
        baseURL: req.query.url,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    instance.get('/').then(function (res) {
        console.log(res.data)
    })
})

app.get('/test02', function (req, res) {
    let instance = axios.create({
        headers: { 'X-Custom-Header': 'foobar' }
    })
    // ruleid: taint-backend-ssrf
    instance.get(req.query.url).then(function (res) {
        console.log(res.data)
    })
})

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
    axios.get(url.href)
        .then(function (response) {
            res.send(response);
        })
        .catch(function (error) {
            res.send(error);
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
    axios.get(url.href)
        .then(function (response) {
            res.send(response);
        })
        .catch(function (error) {
            res.send(error);
        });
})