// Check that both module systems work and all the permatations:
// CJS ///////////////////////////////////////////
//const express = require("express");

// Promises API
//     const fsPromises = require('fs/promises');
//const fsPromises = require('node:fs/promises');
//    const { access, constants } = require('fs/promises');
//const { access, constants } = require('node:fs/promises');
//     const { readFile: rfPromises } = require('fs/promises');
//const { readFile: rfPromises } = require('node:fs/promises');

// Callback API
//     const fs = require('fs');
//const fs = require('node:fs');
//     const { readFile } = require('fs');
//const { readFile } = require('node:fs');
//     const { readFile: rf } = require('fs');
//const { readFile: rf } = require('node:fs');

// ESM ////////////////////////////////////////////
import express from 'express';

// Promises API
     import fsPromises from 'fs/promises';
//import fsPromises from 'node:fs/promises';
//import * as fsPromises from 'fs/promises';
//import * as fsPromises from 'node:fs/promises';
     import { access, constants } from 'fs/promises';
//import { access, constants } from 'node:fs/promises';
     import { readFile as rfPromises } from 'fs/promises';
//import { readFile as rfPromises } from 'node:fs/promises';

// Callback API
     import fs from 'fs';
//import fs from 'node:fs';
//import * as fs from 'fs';
//import * as fs from 'node:fs';
     import { readFile } from 'fs';
//import { readFile } from 'node:fs';
     import { readFile as rf } from 'fs';
//import { readFile as rf } from 'node:fs';

const app = express();

// Inspiration for the following tests: https://semgrep.dev/playground/r/javascript.lang.security.audit.detect-non-literal-fs-filename.detect-non-literal-fs-filename
app.get('/positive-tests', async (req, res) => {
  try {
    // ruleid: taint-backend-dynamic-fs-read-filename
    await fsPromises.access(req.body.path, constants.R_OK | constants.W_OK)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be written`);
      })
      .catch(() => { console.error(`${req.body.path} can not be written`); })

    // ruleid: taint-backend-dynamic-fs-read-filename
    await rfPromises(req.body.path, { encoding: 'utf8' })
      .then((fileContents) => {
        console.log(fileContents);
      })
      .catch((err) => { console.error(err.message); })

    // ruleid: taint-backend-dynamic-fs-read-filename
    await access(req.body.path, constants.F_OK | constants.W_OK)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be written`);
      })
      .catch(() => { console.error(`${req.body.path} can not be written`); })


    // ruleid: taint-backend-dynamic-fs-read-filename
    await fs.promises.access(req.body.path, constants.F_OK | constants.W_OK)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be written`);
      })
      .catch(() => { console.error(`${req.body.path} can not be written`); })

    // ruleid: taint-backend-dynamic-fs-read-filename
    fs.access(req.body.path, constants.F_OK, (err) => {
      console.log(`${req.body.path} ${err ? 'does not exist' : 'exists'}`);
    });

    // ruleid: taint-backend-dynamic-fs-read-filename
    readFile(req.body.path, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    // ruleid: taint-backend-dynamic-fs-read-filename
    rf(req.body.path, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    const untrustedPath = req.body.path;

    // ruleid: taint-backend-dynamic-fs-read-filename
    rf(untrustedPath, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    // ruleid: taint-backend-dynamic-fs-read-filename
    rf(`${untrustedPath}file.txt`, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    res.send('injected');
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.get('/negative-tests', async (req, res) => {
  try {
    // ok: taint-backend-dynamic-fs-read-filename
    await fsPromises.access('file.txt', constants.R_OK | constants.W_OK)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be written`);
      })
      .catch(() => { console.error(`${req.body.path} can not be written`); })

    // ok: taint-backend-dynamic-fs-read-filename
    await rfPromises('file.txt', { encoding: 'utf8' })
      .then((fileContents) => {
        console.log(fileContents);
      })
      .catch((err) => { console.error(err.message); })

    // ok: taint-backend-dynamic-fs-read-filename
    await access('file.txt', constants.F_OK | constants.W_OK)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be written`);
      })
      .catch(() => { console.error(`${req.body.path} can not be written`); })

    // ok: taint-backend-dynamic-fs-read-filename
    await fs.promises.access('file.txt', constants.F_OK | constants.W_OK)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be written`);
      })
      .catch(() => { console.error(`${req.body.path} can not be written`); })

    // ok: taint-backend-dynamic-fs-read-filename
    fs.access('file.txt', constants.F_OK, (err) => {
      console.log(`${req.body.path} ${err ? 'does not exist' : 'exists'}`);
    });

    // ok: taint-backend-dynamic-fs-read-filename
    readFile('file.txt', (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    // ok: taint-backend-dynamic-fs-read-filename
    rf('file.txt', (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    res.send('injected');
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.get('/codeql-tests', async (req, res) => {
  try {
    // Inspired by: https://github.com/github/codeql/blob/0d68d8874191904741720c2a3d296825d7ee4cd6/javascript/ql/experimental/adaptivethreatmodeling/src/TaintedPathATM.md?plain=1#L24

    const path = new URL(req.url).searchParams.get('path');

    // ruleid: taint-backend-dynamic-fs-read-filename
    res.write(fs.readFileSync(path));

    res.write('/media/books/' + path);

    res.end();
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

