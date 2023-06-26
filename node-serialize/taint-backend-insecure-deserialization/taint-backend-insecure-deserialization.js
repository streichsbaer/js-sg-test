// https://github.com/returntocorp/semgrep-rules/blob/develop/contrib/nodejsscan/eval_deserialize.js
var express = require('express');
var cookieParser = require('cookie-parser');
var escape = require('escape-html');
const serialize2 = require('node-serialize')
import serialize from 'node-serialize';
import { unserialize } from 'node-serialize';


var app = express();
app.use(cookieParser())

app.get('/', function (req, res) {
    if (req.cookies.profile) {
        var str = new Buffer(req.cookies.profile, 'base64').toString();
        // ruleid: taint-backend-insecure-deserialization
        var obj = unserialize(str);
        // ruleid: taint-backend-insecure-deserialization
        serialize2.unserialize(str);
        // ruleid: taint-backend-insecure-deserialization
        serialize.unserialize(str)
        if (obj.username) {
            res.send("Hello " + escape(obj.username));
        }
    } else {
        res.cookie('profile', "eyJ1c2VybmFtZSI6ImFqaW4iLCJjb3VudHJ5IjoiaW5kaWEiLCJjaXR5IjoiYmFuZ2Fsb3JlIn0=", {
            maxAge: 900000,
            httpOnly: true
        });
    }
    res.send("Hello World");
});
app.listen(3000);
