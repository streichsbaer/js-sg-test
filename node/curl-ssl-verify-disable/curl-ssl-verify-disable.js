// const { Curl, Easy, curly } = require('node-libcurl');
import { Curl, Easy, curly } from 'node-libcurl';

// CURL TEST
const curl = new Curl();

//ruleid: curl-ssl-verify-disable
curl.setOpt(Curl.option.SSL_VERIFYPEER, false);

//ruleid: curl-ssl-verify-disable
curl.setOpt('SSL_VERIFYPEER', 0);

//ok: curl-ssl-verify-disable
curl.setOpt(Curl.option.SSL_VERIFYPEER, true);

// EASY TEST
const handle = new Easy();

//ruleid: curl-ssl-verify-disable
handle.setOpt('SSL_VERIFYPEER', false);

//ok: curl-ssl-verify-disable 
handle.setOpt('SSL_VERIFYPEER', true);

// CURLY TEST
const url = "https://example.com"; 

//ruleid: curl-ssl-verify-disable
curly.get(url, {SSL_VERIFYPEER: false})

//ok: curl-ssl-verify-disable
curly.post(url, {postFields: JSON.stringify({ field:'value'})});

// node-curl test 
const curl = require('node-curl');

//ruleid: curl-ssl-verify-disable
curl(url, {SSL_VERIFYPEER: 0},
    function (err) {
        response.end(this.body);
});

//ok: curl-ssl-verify-disable 
curl(url, {SSL_VERIFYPEER: 1},
    function (err) {
        response.end(this.body);
});