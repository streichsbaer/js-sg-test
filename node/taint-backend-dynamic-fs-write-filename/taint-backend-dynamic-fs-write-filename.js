// Check that both module systems work and all the permatations:
// CJS ///////////////////////////////////////////
//const express = require("express");

// Promises API
//     const fsPromises = require('fs/promises');
//const fsPromises = require('node:fs/promises');
//    const { access, constants } = require('fs/promises');
//const { access, constants } = require('node:fs/promises');
//     const { writeFile: wfPromises } = require('fs/promises');
//const { writeFile: wfPromises } = require('node:fs/promises');

// Callback API
//     const fs = require('fs');
//const fs = require('node:fs');
//     const { writeFile } = require('fs');
//const { writeFile } = require('node:fs');
//     const { writeFile: wf } = require('fs');
//const { writeFile: wf } = require('node:fs');

// ESM ////////////////////////////////////////////
import express from 'express';

// Promises API
     import fsPromises from 'fs/promises';
//import fsPromises from 'node:fs/promises';
//import * as fsPromises from 'fs/promises';
//import * as fsPromises from 'node:fs/promises';
     import { chown } from 'fs/promises';
//import { access, constants } from 'node:fs/promises';
     import { writeFile as wfPromises } from 'fs/promises';
//import { readFile as rfPromises } from 'node:fs/promises';

// Callback API
     import fs from 'fs';
//import fs from 'node:fs';
//import * as fs from 'fs';
//import * as fs from 'node:fs';
     import { writeFile } from 'fs';
//import { writeFile } from 'node:fs';
     import { writeFile as wf } from 'fs';
//import { writeFile as wf } from 'node:fs';

const app = express();

// Inspiration for the following tests: https://semgrep.dev/playground/r/javascript.lang.security.audit.detect-non-literal-fs-filename.detect-non-literal-fs-filename
app.get('/positive-tests', async (req, res) => {
  try {
    // ruleid: taint-backend-dynamic-fs-write-filename
    await fsPromises.chown(req.body.path, 1541, 999)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} was chowned`);
      })
      .catch(() => { console.error(`${req.body.path} can not be chowned`); })

    // ruleid: taint-backend-dynamic-fs-write-filename
    await wfPromises(req.body.path, req.body.text, { encoding: 'utf8' })
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} was successfully written to`);
      })
      .catch((err) => { console.error(err.message); })

    // ruleid: taint-backend-dynamic-fs-write-filename
    await chown(req.body.path, 1541, 999)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} was chowned`);
      })
      .catch(() => { console.error(`${req.body.path} can not be chowned`); })


    // ruleid: taint-backend-dynamic-fs-write-filename
    await fs.promises.chown(req.body.path, 1541, 999)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be chowned`);
      })
      .catch(() => { console.error(`${req.body.path} can not be chowned`); })

    // ruleid: taint-backend-dynamic-fs-write-filename
    fs.chown(req.body.path, 1541, 999, (err) => {
      console.log(`${req.body.path} ${err ? 'can not be chowned' : 'chowned'}`);
    });

    // ruleid: taint-backend-dynamic-fs-write-filename
    writeFile(req.body.path, req.body.text, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    // ruleid: taint-backend-dynamic-fs-write-filename
    wf(req.body.path, req.body.text, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    const untrustedPath = req.body.path;

    // ruleid: taint-backend-dynamic-fs-write-filename
    wf(untrustedPath, req.body.text, (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    // ruleid: taint-backend-dynamic-fs-write-filename
    wf(`${untrustedPath}file.txt`, req.body.text, (err, data) => {
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
    // ok: taint-backend-dynamic-fs-write-filename
    await fsPromises.chown('file.txt', 1541, 999)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} was chowned`);
      })
      .catch(() => { console.error(`${req.body.path} can not be chowned`); })

    // ok: taint-backend-dynamic-fs-write-filename
    await wfPromises('file.txt', 'Some arbitrary text.', { encoding: 'utf8' })
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} was successfully written to`);
      })
      .catch((err) => { console.error(err.message); })

    // ok: taint-backend-dynamic-fs-write-filename
    await chown('file.txt', 1541, 999)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} was chowned`);
      })
      .catch(() => { console.error(`${req.body.path} can not be chowned`); })

    // ok: taint-backend-dynamic-fs-write-filename
    await fs.promises.chown('file.txt', 1541, 999)
      .then((resolved) => {
        !resolved && console.log(`${req.body.path} can be chowned`);
      })
      .catch(() => { console.error(`${req.body.path} can not be chowned`); })

    // ok: taint-backend-dynamic-fs-write-filename
    fs.chown('file.txt', 1541, 999, (err) => {
      console.log(`${req.body.path} ${err ? 'can not be chowned' : 'chowned'}`);
    });

    // ok: taint-backend-dynamic-fs-write-filename
    writeFile('file.txt', 'Some arbitrary text.', (err, data) => {
      if (err) throw err;
      console.log(data);
    });

    // ok: taint-backend-dynamic-fs-write-filename
    wf('file.txt', 'Some arbitrary text.', (err, data) => {
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

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

