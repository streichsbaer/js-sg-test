const express = require('express');

import xss from 'xss';
const xss2 = require('xss');
import * as xss3 from 'xss';

const DOMPurify = require('isomorphic-dompurify');
import Domp2 from 'isomorphic-dompurify';
import * as Domp3 from 'isomorphic-dompurify';
import { sanitize } from 'isomorphic-dompurify';

const san_html = require('sanitize-html');
import san_html2 from 'sanitize-html';
import * as san_html3 from 'sanitize-html';

const app = express();

app.get('/xss1', function (req, res) {
    let name = req.query.name;
    // ruleid: taint-backend-xss-response
    res.send('Hello ' + name);
    // ruleid: taint-backend-xss-response
    res.write(name);
});

app.get('/xss2', function (req, response) {
    let name = req.query.name;
    // ruleid: taint-backend-xss-response
    response.write('Hello ' + name);
    // ruleid: taint-backend-xss-response
    response.send(`Hello ${name}`);
});

app.get('/xss_mitigration', function(req, res) {
    let name = req.query.name;
    let name1 = xss(name);
    let name2 = xss2(name);
    let name3 = xss3(name);
    // ok: taint-backend-xss-response
    res.write('Hello ' + name1);
    // ok: taint-backend-xss-response
    res.write('Hello ' + name2);
    // ok: taint-backend-xss-response
    res.write('Hello ' + name3);
})

app.get('/xss_mitigration2', function(req, response) {
    let name = req.query.name;
    let name1 = Domp2.sanitize(name);
    let name2 = DOMPurify.sanitize(name);
    let name3 = Domp3.sanitize(name);
    let name4 = sanitize(name);
    // ok: taint-backend-xss-response
    response.send('Hello ' + name1);
    // ok: taint-backend-xss-response
    response.write('Hello ' + name2);
    // ok: taint-backend-xss-response
    response.send('Hello ' + name3);
    // ok: taint-backend-xss-response
    response.write('Hello ' + name4);
})

app.get('/xss_mitigration3', function(req, res) {
    let name = req.query.name;
    let name1 = san_html(name);
    let name2 = san_html2(name);
    let name3 = san_html3(name);
    // ok: taint-backend-xss-response
    res.send('Hello ' + name1);
    // ok: taint-backend-xss-response
    res.write('Hello ' + name2);
    // ok: taint-backend-xss-response
    res.send('Hello ' + name3);
})

app.listen(8000);