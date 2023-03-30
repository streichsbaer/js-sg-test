// Check that both module systems work and all the permatations:
// CJS ///////////////////////////////////////////
//const express = require("express");

// const util = require('util');
// const util = require('node:util');
// const { promisify } = require('util');
// const { promisify } = require('node:util');
// const { promisify: promisifyAlias } = require('util');
// const { promisify: promisifyAlias } = require('node:util');

// const cp = require('child_process');
// const cp = require('node:child_process');
// const { exec, execFile, fork, spawn, execSync, execFileSync, spawnSync } = require('child_process');
// const { exec, execFile, fork, spawn, execSync, execFileSync, spawnSync } = require('node:child_process');
// const {
//   exec: execAlias,
//   execFile: execFileAlias,
//   fork: forkAlias,
//   spawn: spawnAlias,
//   execSync: execSyncAlias,
//   execFileSync: execFileSyncAlias,
//   spawnSync: spawnSyncAlias
// } = require('child_process');
// const {
//   exec: execAlias,
//   execFile: execFileAlias,
//   fork: forkAlias,
//   spawn: spawnAlias,
//   execSync: execSyncAlias,
//   execFileSync: execFileSyncAlias,
//   spawnSync: spawnSyncAlias
// } = require('node:child_process');

// ESM ////////////////////////////////////////////
import express from 'express';

// import util from 'util';
import util from 'node:util';
// import * as util from 'util';
// import * as util from 'node:util';
// import { promisify } from 'util';
// import { promisify } from 'node:util';
// import { promisify as promisifyAlias } from 'util';
import { promisify as promisifyAlias } from 'node:util';

// import cp from 'child_process';
import cp from 'node:child_process';
// import * as cp from 'child_process';
// import * as cp from 'node:child_process';
// import { exec, execFile, fork, spawn, execSync, execFileSync, spawnSync } from 'child_process';
import { exec, execFile, fork, spawn, execSync, execFileSync, spawnSync } from 'node:child_process';
// import {
//   exec as execAlias,
//   execFile as execFileAlias,
//   fork as forkAlias,
//   spawn as spawnAlias,
//   execSync as execSyncAlias,
//   execFileSync as execFileSyncAlias,
//   spawnSync as spawnSyncAlias
// } from 'child_process';
import {
  exec as execAlias,
  execFile as execFileAlias,
  fork as forkAlias,
  spawn as spawnAlias,
  execSync as execSyncAlias,
  execFileSync as execFileSyncAlias,
  spawnSync as spawnSyncAlias
} from 'node:child_process';

const app = express();
const url = require('url');
// Inspiration for the following tests: https://github.com/github/codeql/blob/ad8d9c5b916a98e783b3eeb6e282ae04282d4903/javascript/ql/test/query-tests/Security/CWE-094/CodeInjection/express.js#L24-L30
app.get('/other/path0', async (req, res) => {
  try {
    const taint = req.param("wobble");
    // ruleid: taint-backend-dynamic-child-process
    cp.execFileSync('node', ['-e', taint]);
    // ok: taint-backend-dynamic-child-process
    cp.execFileSync('node', ['-e', `console.log(${JSON.stringify(taint)})`]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Inspiration for the following tests: https://github.com/github/codeql/blob/ad8d9c5b916a98e783b3eeb6e282ae04282d4903/javascript/ql/test/query-tests/Security/CWE-829/insecure-download.js#L33-L42
app.get('/other/path1', async (req, res) => {
  try {
    const url = req.url // "http://example.org/unsafe.APK";
    // ruleid: taint-backend-dynamic-child-process
    cp.exec('curl ' + url, function () {});
    // ruleid: taint-backend-dynamic-child-process
    cp.execFile('curl', [url], function () {});

    // Promisified versions:
    const execPromise0 = util.promisify(execAlias);
    const execPromise1 = util.promisify(exec);
    const execPromise2 = util.promisify(cp.exec);
    const execPromise3 = promisify(execAlias);
    const execPromise4 = promisify(cp.exec);
    const execPromise5 = promisify(exec);
    const execPromise6 = promisifyAlias(execAlias);
    const execPromise7 = promisifyAlias(exec);
    const execPromise8 = promisifyAlias(cp.exec);
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise0('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise1('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise2('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.

    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise3('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise4('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise5('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.

    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise6('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise7('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
    // ruleid: taint-backend-dynamic-child-process
    const { stdout, stderr } = await execPromise8('curl ' + url);
    // This is where you usually subscribe to events on stdout and stderr.
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Inspiration for the following tests: https://github.com/github/codeql/blob/ad8d9c5b916a98e783b3eeb6e282ae04282d4903/javascript/ql/test/query-tests/Security/CWE-078/CommandInjection/exec-sh.js
app.get('/other/path2', async (req, res) => {
  try {
    const command = url.parse(req.url, true).query.path;
    const shell = process.platform === 'win32' ? { cmd: 'cmd', arg: '/C' } : { cmd: 'sh', arg: '-c' };
    // ruleid: taint-backend-dynamic-child-process
    const proc = cp.spawn(shell.cmd, [shell.arg, command], {})
    // Set-up proc handlers.
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Inspiration for the following tests: https://github.com/github/codeql/blob/ad8d9c5b916a98e783b3eeb6e282ae04282d4903/javascript/ql/test/query-tests/Security/CWE-078/CommandInjection/form-parsers.js#L20-L61
const Busboy = require('busboy');
const formidable = require('formidable');
const multiparty = require('multiparty');
app.get('/other/path3', async (req, res) => {
  try {
    // busboy
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      // ruleid: taint-backend-dynamic-child-process
      exec("touch " + filename);
    });
    req.pipe(busboy);

    // formidable
    const form0 = formidable({ multiples: true }); 
    form0.parse(req, (err, fields, files) => {
      // todoruleid: taint-backend-dynamic-child-process
      exec("touch " + fields.name);
    });

    const form1 = new formidable.IncomingForm();
    form1.parse(req, (err, fields, files) => {
      // todoruleid: taint-backend-dynamic-child-process
      exec("touch " + fields.name);
    });

    // multiparty
    //   parse a file upload
    const form2 = new multiparty.Form();

    form2.parse(req, function (err, fields, files) {
      // todoruleid: taint-backend-dynamic-child-process
      exec("touch " + fields.name);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Inspiration for the following tests: https://github.com/github/codeql/blob/ad8d9c5b916a98e783b3eeb6e282ae04282d4903/javascript/ql/test/query-tests/Security/CWE-022/TaintedPath/TaintedPath.js#L209-L215
app.get('/other/path4', async (req, res) => {
  try {
    // todook: taint-backend-dynamic-child-process
    let path = url.parse(req.url, true).query.path;
    // ruleid: taint-backend-dynamic-child-process
    cp.execSync('foobar', { cwd: path });
    // ruleid: taint-backend-dynamic-child-process
    cp.execFileSync('foobar', ['args'], { cwd: path });
    // ruleid: taint-backend-dynamic-child-process
    cp.execFileSync('foobar', { cwd: path });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Inspiration for the following tests: https://github.com/github/codeql/blob/ad8d9c5b916a98e783b3eeb6e282ae04282d4903/javascript/ql/test/query-tests/Security/CWE-078/CommandInjection/child_process-test.js
app.get('/other/path5', async (req, res) => {
  try {
    // todook: taint-backend-dynamic-child-process
    const command = url.parse(req.url, true).query.path;
    const shell = process.platform === 'win32' ? { cmd: 'cmd', arg: '/C' } : { cmd: 'sh', arg: '-c' };
    // ruleid: taint-backend-dynamic-child-process    
    spawnAlias(shell.cmd, [shell.arg, command])
    // Set-up for next test.
    const args = ['-c', command];
    // ruleid: taint-backend-dynamic-child-process
    execFileAlias("/bin/bash", args);
    // ruleid: taint-backend-dynamic-child-process
    spawnAlias('cmd.exe', ['/C', 'foo'].concat(['bar', command]));
    // ruleid: taint-backend-dynamic-child-process
    spawnAlias('cmd.exe', ['/C', 'foo'].concat(command));
    // ok: taint-backend-dynamic-child-process
    spawnAlias('cmd.exe', ['/C', 'foo'].concat('bar'));
    // ruleid: taint-backend-dynamic-child-process
    spawnAlias('cmd.exe', [...['/C', 'foo'], 'bar', command]);
    // ruleid: taint-backend-dynamic-child-process
    execFile('/bin/bash', args.slice());
    // todook: taint-backend-dynamic-child-process
    cp.execFile('/bin/bash', [...args.slice(0, 1), 'bar']);
    // Set-up for next test.
    const argsWithoutCommand = ['-c'];
    argsWithoutCommand.push(command);
    // todoruleid: taint-backend-dynamic-child-process
    cp.execFile('/bin/bash', argsWithoutCommand);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

