// Only the CJS module system is affected
// CJS ///////////////////////////////////////////
const express = require("express");

const app = express();

app.get('/users', async (req, res) => {
  try {
    // ok: taint-backend-dynamic-require
    const a = require('a');
    // ok: taint-backend-dynamic-require
    const b = require(process.env.VAR);
    // ruleid: taint-backend-dynamic-require
    const c = require(req.body.module);
    // ruleid: taint-backend-dynamic-require
    const d = require(`cats-${req.body.module}`);

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
