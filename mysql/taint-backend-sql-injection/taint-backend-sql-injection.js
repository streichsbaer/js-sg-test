// Check that both module systems work:
// CJS
//const express = require("express");
//const mysql = require('mysql');
// ESM
// defaultExport
import express from 'express';
import mysql from 'mysql';
// Named import to alias
//import { mysql as mysqlalias } from 'mysql';
// Namespace imports
//import mysql, * as mysqlModule from 'mysql'
//import * as mysql from 'mysql';

const app = express();

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});

const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'example.org',
  user            : 'bob',
  password        : 'secret',
  database        : 'my_db'
});

// Example came from https://www.stackhawk.com/blog/node-js-sql-injection-guide-examples-and-prevention/#what-sql-injection-attacks-look-like-in-nodejs
app.post("/records", (request, response) => {
  const data = request.body;
  const query = `SELECT * FROM health_records WHERE id = (${data.id})`;
  // ruleid: taint-backend-sql-injection
  connection.query(query, (err, rows) => {
    if(err) throw err;
    // Do something with parameters.
  });
});

// Example derived from above StackHalk example.
app.post("/records", (request, response) => {
  const query = `SELECT * FROM health_records WHERE id = (${request.body.id})`;
  // ruleid: taint-backend-sql-injection
  connection.query(query, (err, rows) => {
    if(err) throw err;
    // Do something with parameters.
  });
});

// Example derived from above StackHalk example.
app.post("/records", (request, response) => {
  // ruleid: taint-backend-sql-injection
  connection.query(`SELECT * FROM health_records WHERE id = (${request.body.id})`, (err, rows) => {
    if(err) throw err;
    // Do something with parameters.
  });
});

// The following examples are from: https://github.com/mysqljs/mysql#performing-queries
app.post("/records", (request, response) => {
  // The simplest form of .query() is .query(sqlString, callback),
  // where a SQL string is the first argument and the second is a callback:
  // ok: taint-backend-sql-injection
  connection.query('SELECT * FROM `books` WHERE `author` = "David"', function (error, results, fields) {
    // Do something with parameters.
  });
});

app.post("/records", (request, response) => {
  // The second form .query(sqlString, values, callback)
  // comes when using placeholder values (see [escaping query values](https://github.com/mysqljs/mysql#escaping-query-values)):
  // ok: taint-backend-sql-injection
  connection.query('SELECT * FROM `books` WHERE `author` = ? AND `cats` = ?', [request.body.id, 'Maincoon'], function (error, results, fields) {
    // Do something with parameters.
  });
});

app.post("/records", (request, response) => {
  // The third form .query(options, callback)
  // comes when using various advanced options on the query, like
  // [escaping query values](https://github.com/mysqljs/mysql#escaping-query-values),
  // [joins with overlapping column names](https://github.com/mysqljs/mysql#joins-with-overlapping-column-names),
  // [timeouts](https://github.com/mysqljs/mysql#timeouts),
  // and [type casting](https://github.com/mysqljs/mysql#type-casting).
  // ok: taint-backend-sql-injection
  connection.query({
      sql: 'SELECT * FROM `books` WHERE `author` = ? AND `cats` = ?',
      timeout: 40000, // 40s
      values: [request.body.id, black]
    },
    function (error, results, fields) {
      // Do something with parameters.
    }
  );
});

app.post("/records", (request, response) => {
  // The third form .query(options, callback)
  // comes when using various advanced options on the query, like
  // [escaping query values](https://github.com/mysqljs/mysql#escaping-query-values),
  // [joins with overlapping column names](https://github.com/mysqljs/mysql#joins-with-overlapping-column-names),
  // [timeouts](https://github.com/mysqljs/mysql#timeouts),
  // and [type casting](https://github.com/mysqljs/mysql#type-casting).
  // ruleid: taint-backend-sql-injection
  connection.query({
      sql: `SELECT * FROM 'books' WHERE 'author' = ? AND 'cats' = ? AND id = ${request.body.id}`,
      timeout: 40000, // 40s
      values: [request.body.id, black]
    },
    function (error, results, fields) {
      // Do something with parameters.
    }
  );
});

app.post("/records", (request, response) => {
  // Note that a combination of the second and third forms can be used where the placeholder values are passed as an argument and not in the options object.
  // The values argument will override the values in the option object.
  // ok: taint-backend-sql-injection
  connection.query({
      sql: 'SELECT * FROM `books` WHERE `cats` = ? AND `author` = ?',
      timeout: 40000, // 40s
    },
    ['blue', request.body.id],
    function (error, results, fields) {
      // Do something with parameters.
    }
  );
});

app.post("/records", (request, response) => {
  // Note that a combination of the second and third forms can be used where the placeholder values are passed as an argument and not in the options object.
  // The values argument will override the values in the option object.
  // ruleid: taint-backend-sql-injection
  connection.query({
      sql: `SELECT * FROM 'books' WHERE 'author' = ? AND 'cats' = ? AND id = ${request.body.id}`,
      timeout: 40000, // 40s
    },
    ['blue', request.body.id],
    function (error, results, fields) {
      // Do something with parameters.
    }
  );
});

app.post("/records", (request, response) => {
  // If the query only has a single replacement character (?), and the value is not null, undefined,
  // or an array, it can be passed directly as the second argument to .query:
  // ok: taint-backend-sql-injection
  connection.query(
    'SELECT * FROM `books` WHERE `author` = ?',
    request.body.id,
    function (error, results, fields) {
      // Do something with parameters.
    }
  );
});

app.post("/records", (request, response) => {
  // If the query only has a single replacement character (?), and the value is not null, undefined,
  // or an array, it can be passed directly as the second argument to .query:
  connection.query(
    // ruleid: taint-backend-sql-injection
    `SELECT * FROM 'books' WHERE 'author' = ? AND id = ${request.body.id}`,
    request.body.id,
    function (error, results, fields) {
      // Do something with parameters.
    }
  );
});

// The following example is from: https://github.com/mysqljs/mysql#escaping-query-values
app.post("/records", (request, response) => {
  const userId = request.body.id;
  const sql    = 'SELECT * FROM users WHERE id = ' + c.escape(userId);
  // ruleid: taint-backend-sql-injection
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    // ...
  });
});

// The following example is from: https://github.com/mysqljs/mysql#escaping-query-values
app.post("/records", (request, response) => {
  const userId = request.body.id;
  const sql    = 'SELECT * FROM users WHERE id = ' + mysql.escape(userId);
  // ok: taint-backend-sql-injection
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    // ...
  });
});

// The following example is from: https://github.com/mysqljs/mysql#escaping-query-values
app.post("/records", (request, response) => {
  const userId = request.body;
  const sql    = 'SELECT * FROM users WHERE id = ' + connection.escape(userId);
  // ok: taint-backend-sql-injection
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    // ...
  });
});

// The following example is from: https://github.com/mysqljs/mysql#escaping-query-values
app.post("/records", (request, response) => {
  const userId = request.body.id;
  const sql    = 'SELECT * FROM users WHERE id = ' + pool.escape(userId);
  // ok: taint-backend-sql-injection
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    // ...
  });
});

// The following examples are from the 2nd half of https://github.com/mysqljs/mysql#escaping-query-values
app.post("/records", (request, response) => {
  const post  = {id: request.body.id, title: 'Hello MySQL'};
  // ok: taint-backend-sql-injection
  const query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
    if (error) throw error;
  });
  console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
});

app.post("/records", (request, response) => {
  const post  = {id: request.body.id, title: 'Hello MySQL'};
  // ruleid: taint-backend-sql-injection
  const query = connection.query('INSERT INTO posts SET' + '`unsafeId` = "' + request.body.id + '", ?', post, function (error, results, fields) {
    if (error) throw error;
  });
  console.log(query.sql); // INSERT INTO posts SET `unsafeId` = "untrusted-id" `id` = 1, `title` = 'Hello MySQL'
});

app.post("/records", (request, response) => {
  const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
  const sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
  console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42

  // ok: taint-backend-sql-injection
  const query = connection.query(sql, function (error, results, fields) {
    if (error) throw error;
  });
});

app.post("/records", (request, response) => {
  const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
  const sql = mysql.format('UPDATE posts SET' + '`unsafeId` = "' + request.body.id + '" modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
  console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42

  // ruleid: taint-backend-sql-injection
  const query = connection.query(sql, function (error, results, fields) {
    if (error) throw error;
  });
});

app.post("/records", (request, response) => {
  const CURRENT_TIMESTAMP = mysql.raw('CURRENT_TIMESTAMP()');
  const sql = mysql.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
  console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42
  
  // ok: taint-backend-sql-injection
  const query = connection.query(sql, function (error, results, fields) {
    if (error) throw error;
  });
});

app.post("/records", (request, response) => {
  const CURRENT_TIMESTAMP = mysql.raw('CURRENT_TIMESTAMP()');
  const sql = mysql.format('UPDATE posts SET' + '`unsafeId` = "' + request.body.id + '" modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
  console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42
  
  // ruleid: taint-backend-sql-injection
  const query = connection.query(sql, function (error, results, fields) {
    if (error) throw error;
  });
});
