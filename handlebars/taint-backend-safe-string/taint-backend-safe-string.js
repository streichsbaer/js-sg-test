import * as hdb from 'handlebars';
import * as DOMPurify from 'isomorphic-dompurify';


const express = require("express");
const HandleBars = require('handlebars');
const dpf = require('isomorphic-dompurify');
const XSS = require('xss')

const app = express();

app.get("/test1", function(req, res) {
    // ruleid: taint-backend-safe-string
    let v1 = new HandleBars.SafeString(req.body.untrustValue)
    // ruleid: taint-backend-safe-string
    let v2 = new hdb.SafeString(req.body.untrustValue)
    let v3 = hdb.escapeExpression(req.body.untrustValue)
    // ok: taint-backend-safe-string
    let v4 = new hdb.SafeString(v3)
    // ok: taint-backend-safe-string
    let v6 = new HandleBars.SafeString(dpf.sanitize(req.body.untrustValue))
    // ok: taint-backend-safe-string
    let v7 = new HandleBars.SafeString(DOMPurify.sanitize(req.body.untrustValue))
    // ok: taint-backend-safe-string
    let v8 = new HandleBars.SafeString(XSS(req.body.untrustValue))
})