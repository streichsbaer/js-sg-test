var request = require('request');
var use_key = 'some_key';
var process_lib = require('process');

module.exports = {

    'test1': function (callback) {
        // ruleid:accept-self-signed-cert 
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        request.get('https://example.com/key=' + use_key, function (err, response, body) {
            if (err) callback(err);

            var status = JSON.parse(body);
            callback(err, status);
        })
    },

    'test2': function (json, callback) {
        // ruleid:accept-self-signed-cert 
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        request.post({
            uri: 'https://example.com?key=' + use_key,
            json: json,
            method: 'POST'
        },
            function (err, response, body) {
                if (err) callback(err);

                callback(err, response);
            })

    },

    'test3': function (callback) {
        // ruleid:accept-self-signed-cert 
        process.env['NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE'] = '1';
        request.get('https://example.com?key=' + use_key, function (err, response, body) {
            if (err) callback(err);

            var status = JSON.parse(body);
            callback(err, status);
        })
    },

    'test4': function (json, callback) {
        // ruleid:accept-self-signed-cert
        process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = "1";
        request.post({
            uri: 'https://example.com?key=' + use_key,
            json: json,
            method: 'POST'
        },
            function (err, response, body) {
                if (err) callback(err);

                callback(err, response);
            })
    },

    'test5': function (callback) {
        // ruleid:accept-self-signed-cert 
        process_lib.env['NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE'] = '1';
        request.get('https://example.com?key=' + use_key, function (err, response, body) {
            if (err) callback(err);

            var status = JSON.parse(body);
            callback(err, status);
        })
    },

    'test6': function (callback) {
        // ok:accept-self-signed-cert 
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
        request.get('https://example.com/key=' + use_key, function (err, response, body) {
            if (err) callback(err);

            var status = JSON.parse(body);
            callback(err, status);
        })
    },

    'test7': function (json, callback) {
        // ok:accept-self-signed-cert 
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
        request.post({
            uri: 'https://example.com?key=' + use_key,
            json: json,
            method: 'POST'
        },
            function (err, response, body) {
                if (err) callback(err);

                callback(err, response);
            })
    }
}


