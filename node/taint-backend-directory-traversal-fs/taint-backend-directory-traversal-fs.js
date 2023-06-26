var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');

import { readFile } from 'node:fs/promises';

var config = require('../config');
var Promise = require('bluebird');
Promise.promisifyAll(fileSystem);

var express = require('express');
var app = express();
app.get('/non-promises-1', function (req, res) {
    var filePath = path.join(__dirname, '/' + req.query.load);
    var fixedPath = 'some_fixed_path';

    // ruleid:taint-backend-directory-traversal-fs
    var readStream = fileSystem.createReadStream(filePath);
    // ok:taint-backend-directory-traversal-fs
    var readFixedStream = fileSystem.createReadStream(fixedPath);

    // ruleid:taint-backend-directory-traversal-fs
    fileSystem.readFile(req.query.foo);
    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(fixedPath);

    // ruleid:taint-backend-directory-traversal-fs
    console.log(fileSystem.readFileSync(req.query.nar, 'utf8'));
    // ok:taint-backend-directory-traversal-fs
    console.log(fileSystem.readFileSync(fixedPath, 'utf8'));

    var foo = req.query.y;

    // ruleid:taint-backend-directory-traversal-fs
    fileSystem.readFile(foo);
    // ruleid:taint-backend-directory-traversal-fs
    fileSystem.readFile(foo + "bar");
    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(fixedPath);

    // todo: do I highlight this line?
    readStream.pipe(res);

    readFixedStream.pipe(res)
});

app.get('/non-promises-2', function (req, res) {
    var date = req.query.date;
    var fileName = config.dirName + '/' + date;
    var downloadFileName = 'log_' + fileName + '.txt';

    // ruleid: taint-backend-directory-traversal-fs
    fs.readFileAsync(fileName)
        .then(function (data) {
            res.download(fileName, downloadFileName);
        })
    
    var fixedPath = 'some_fixed_path';
    // ok:taint-backend-directory-traversal-fs 
    fs.readFileAsync(fixedPath)
        .then(function (data) {
            res.download(fileName, downloadFileName);
        })
})

app.get('/promises-1', function (req, res) {
    var filePath = path.join(__dirname, '/' + req.query.load);
    var fixedPath = 'some_fixed_path';

try {
    // ruleid:taint-backend-directory-traversal-fs 
    const contents = await readFile(filePath, { encoding: 'utf8' });
    // ok:taint-backend-directory-traversal-fs 
    const fixedContents = await readFile(fixedPath, { encoding: 'utf8' });

    console.log(contents);
    console.log(fixedContents)
} catch (err) {
    console.error(err.message);
}
});

app.get('/safe-1', function (req, res) {
    var userInput = path.join(__dirname, '/' + req.query.load);

    var filePath = path.normalize(userInput);
    if (filePath.startsWith('../')) {
        console.log('error');
    }

    // ok:taint-backend-directory-traversal-fs
    var readStream = fileSystem.createReadStream(filePath);

    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(filePath);

    // ok:taint-backend-directory-traversal-fs
    console.log(fileSystem.readFileSync(filePath, 'utf8'));

    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(filePath);
    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(filePath + "bar");
});

app.get('/safe-2', function (req, res) {
    var userInput = path.join(__dirname, '/' + req.query.load);

    var filePath = path.normalize(userInput).replace(/^(\.\.(\/|\\|$))+/, '');

    // ok:taint-backend-directory-traversal-fs
    var readStream = fileSystem.createReadStream(filePath);

    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(filePath);

    // ok:taint-backend-directory-traversal-fs
    console.log(fileSystem.readFileSync(filePath, 'utf8'));

    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(filePath);
    // ok:taint-backend-directory-traversal-fs
    fileSystem.readFile(filePath + "bar");
});

app.listen(8888);