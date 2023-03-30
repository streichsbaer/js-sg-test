// Check that both module systems work and all the permatations:
// CJS ///////////////////////////////////////////
//const express = require("express");
// MongoDb ---------------------------------------
// Technique One
//const { MongoClient } = require('mongodb');
// Technique Two
const MongoClient = require('mongodb').MongoClient;
// Technique Three
//const mongodb = require('mongodb');
//const MongoClient = mongodb.MongoClient;
// Technique Four
//const mongodb = require('mongodb');
//const { MongoClient } = mongodb;
// Mongo Sanitize ---------------------------------
const mongoSanitize = require('mongo-sanitize');
// Mongoose ---------------------------------------
//const mongoose = require('mongoose');
// Mongojs ----------------------------------------
//const mongojs = require('mongojs');
// ESM ////////////////////////////////////////////
import express from 'express';
// MongoDb ----------------------------------------
// Technique One
//import { MongoClient } from 'mongodb';
// Technique Two
//import * as MongoDB from 'mongodb';
//const MongoClient = MongoDB.MongoClient;
// Technique Three
//import { MongoClient } from 'mongodb';
// Technique Four
//import { default as MongoClient } from 'mongodb';
// Technique Five
//import mongodb from 'mongodb';
//const MongoClient = mongodb.MongoClient;
// Technique Six
//import mongodb from 'mongodb';
//const { MongoClient } = mongodb;
// Mongo Sanitize ---------------------------------
//import mongoSanitize from 'mongo-sanitize';
// Mongoose ---------------------------------------
// Technique One
import mongoose from 'mongoose';
// Technique Two
//import { model, Schema } from 'mongoose';
// Mongojs ----------------------------------------
//import mongojs from 'mongojs';
import { mongojs } from 'mongojs';

const app = express();

// Setup mongodb: https://www.npmjs.com/package/mongodb
const url = 'mongodb://localhost:27017';
const dbName = 'myProject';
const client = new MongoClient(url);

app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(dbName).collection('users');

    // Find all users
    // ruleid: taint-backend-nosqli
    const users0 = await collection.find({ user: req.query.user, city: req.query.city }).toArray();

    // Find all users
    const query1 = { user: req.query.user, city: req.query.city };
    // ruleid: taint-backend-nosqli
    const users1 = await collection.find(query1, {}).toArray();

    const query2 = {};
    query2.user = req.query.user;
    // ruleid: taint-backend-nosqli
    const users2 = await collection.find(query2).toArray();

    res.send(users0 || users1 || users2);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Example taken from: https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/experimental/adaptivethreatmodeling/test/modeled_apis/index.js
app.get('/users', async (req, res) => {
  let users;

  try {
    client.connect("mongodb://someHost:somePort/", (err, db) => {
      if (err) throw err;
      // The intention of this is for req.query.password to be a string. However, if it
      // is { "$ne": "not_the_password" } for example, the query will succeed without
      // the user knowing the password.
      // ruleid: taint-backend-nosqli
      db.collection("someCollection").find({ password: req.query.password }).toArray((err, result) => {
        if (err) throw err;
        users = result;
        client.close();
      });
    });

    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Tests possibly worth implementing:
//   The following two URLs are the same test with different inline comments:
//     https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/test/query-tests/Security/CWE-089/typed/typedClient.ts
//     https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/test/ApiGraphs/typed/index.ts

// Test untrusted input converted to string sanitizers:
app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    // String()
    const query1 = { user: String(req.query.user), city: { $expr: { $ne: String(req.query.city) } } };
    // ruleid: taint-backend-nosqli
    const users1 = await collection.find(query1, {}).toArray();

    const query2 = { user: String(req.query.user), city: { $ne: req.query.city } };
    // ruleid: taint-backend-nosqli
    const users2 = await collection.find(query2, {}).toArray();

    const query3 = { user: req.query.user, city: String(req.query.city) };
    // ruleid: taint-backend-nosqli
    const users3 = await collection.find(query3, {}).toArray();

    const query4 = { user: String(req.query.user), city: String(req.query.city) };
    // ok: taint-backend-nosqli
    const users4 = await collection.find(query4, {}).toArray();


    // toString()
    const query5 = { user: req.query.user, city: req.query.city.toString() };
    // ruleid: taint-backend-nosqli
    const users5 = await collection.find(query5, {}).toArray();

    const query6 = { user: req.query.user.toString(), city: { $ne: req.query.city.toString() } };
    // ruleid: taint-backend-nosqli
    const users6 = await collection.find(query6, {}).toArray();

    const query7 = { user: req.query.user.toString(), city: req.query.city };
    // ruleid: taint-backend-nosqli
    const users7 = await collection.find(query7, {}).toArray();

    const query8 = { user: req.query.user.toString(), city: req.query.city.toString() };
    // ok: taint-backend-nosqli
    const users8 = await collection.find(query8, {}).toArray();


    // Template literals
    const query9 = { user: req.query.user, city: `${req.query.city}` };
    // ruleid: taint-backend-nosqli
    const users9 = await collection.find(query9, {}).toArray();

    const query10 = { user: `${req.query.user}`, city: { $ne: `${req.query.city}` } };
    // ruleid: taint-backend-nosqli
    const users10 = await collection.find(query10, {}).toArray();

    const query11 = { user: `${req.query.user}`, city: req.query.city };
    // ruleid: taint-backend-nosqli
    const users11 = await collection.find(query11, {}).toArray();

    const query12 = { user: `${req.query.user}`, city: `${req.query.city}` };
    // ok: taint-backend-nosqli
    const users12 = await collection.find(query12, {}).toArray();


    // JSON.stringify()
    const query13 = { user: req.query.user, city: { $ne: JSON.stringify(req.query.city) } };
    // ruleid: taint-backend-nosqli
    const users13 = await collection.find(query13, {}).toArray();

    const query13 = { user: req.query.user, city: { $expr: { $ne: JSON.stringify(req.query.city) } } };
    // ruleid: taint-backend-nosqli
    const users13 = await collection.find(query13, {}).toArray();

    const query14 = { user: JSON.stringify(req.query.user), city: { $ne: JSON.stringify(req.query.city) } };
    // ok: taint-backend-nosqli
    const users14 = await collection.find(query14, {}).toArray();

    const query15 = { user: JSON.stringify(req.query.user), city: req.query.city };
    // ruleid: taint-backend-nosqli
    const users15 = await collection.find(query15, {}).toArray();

    const query16 = { user: JSON.stringify(req.query.user), city: JSON.stringify(req.query.city) };
    // ok: taint-backend-nosqli
    const users16 = await collection.find(query16, {}).toArray();

    res.send(users1 || users2 || users3 || users4 || users5 || users6 || users7 || users8 || users9 || users10 || users11 || users12 || users13 || users14 || users15 || users16);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Test untrusted input in the form containing MongoDB operators ($...) handled by the mongo-sanitize package:
app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    const clean = mongoSanitize(req.query.user) // Beware: mongo-sanitize mutates it's parameter.
    const query2 = { user: clean };
    // ok: taint-backend-nosqli
    const users2 = await collection.find(query2, {}).toArray();

    res.send(users2);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// $where operator
app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    // Covers: https://rules.sonarsource.com/javascript/RSPEC-5334
    const user = req.query.user;
    const query = { $where: `this.user == '${user}'` }
    // ruleid: taint-backend-nosqli
    const users1 = await collection.find(query, {}).toArray();

    // Covers: https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/test/query-tests/Security/CWE-094/CodeInjection/NoSQLCodeInjection.js
    // ruleid: taint-backend-nosqli
    const users2 = await collection.find({ $where: req.body.query }, {});
    // ruleid: taint-backend-nosqli
    const users3 = await collection.find({ $where: "name = " + req.body.name });
    // ruleid: taint-backend-nosqli
    const users4 = await collection.find({ $where: req.body.query.toString() }, {});
    // ruleid: taint-backend-nosqli
    const users5 = await collection.find({ $where: String(req.body.query) }, {});
    // ruleid: taint-backend-nosqli
    const users6 = await collection.find({ $where: JSON.stringify(req.body.query) }, {});

    // But misses last example here: https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/test/query-tests/Security/CWE-094/CodeInjection/NoSQLCodeInjection.js
    function mkWhereObj() {
      return { $where: "name = " + req.body.name };
    }
    // todoruleid: taint-backend-nosqli
    const users4 = await collection.find(mkWhereObj());

    res.send(users1 || users2 || users3 || users4 || users5 || users6);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Test $function operator:
app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    // Find all users
    const query = {
      $expr: {
        $eq: [
          { $function: {
            body: req.query.locator,
            args: ['$user'],
            lang: 'js'
          }},
          req.query.user.name
        ]
      }
    };
    // ruleid: taint-backend-nosqli
    const users = await collection.find(query, {}).toArray();

    res.send(users);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Mongoose Specific
// Mostly taken from https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/test/query-tests/Security/CWE-089/untyped/mongoose.js
app.get('/users', async (req, res) => {
  try {
    await mongoose.connect(`${url}/${dbName}`);
    const MyModel = mongoose.model('users');

    const query = {};
    query.title = req.body.title;
    // ruleid: taint-backend-nosqli
    const users0 = await MyModel.aggregate([query]).toArray();
    // ruleid: taint-backend-nosqli
    await MyModel.count(query);
    // ruleid: taint-backend-nosqli
    await MyModel.deleteMany(query);
    // ruleid: taint-backend-nosqli
    await MyModel.deleteOne(query);
    // ruleid: taint-backend-nosqli
    await MyModel.distinct('type', query);
    // ruleid: taint-backend-nosqli
    await MyModel.find(query);
    // ruleid: taint-backend-nosqli
    await MyModel.findOne(query);
    // ruleid: taint-backend-nosqli
    await MyModel.findOneAndDelete(query);
    // ruleid: taint-backend-nosqli
    await MyModel.findOneAndRemove(query);
    // ruleid: taint-backend-nosqli
    await MyModel.findOneAndUpdate(query);
    // ruleid: taint-backend-nosqli
    await MyModel.replaceOne(query);
    // ruleid: taint-backend-nosqli
    await MyModel.update(query);
    // ruleid: taint-backend-nosqli
    await MyModel.updateMany(query);
    // ruleid: taint-backend-nosqli
    await MyModel.updateOne(query)
    // ruleid: taint-backend-nosqli
    await MyModel.findByIdAndUpdate(X, query, function(){});
    // todoruleid: taint-backend-nosqli
    new mongoose.Query(X, Y, query)
    // todoruleid: taint-backend-nosqli
		.and(query, function(){})

    // ruleid: taint-backend-nosqli
    MyModel.where(query) // NOT OK - `.where()` on a Model.
      // todoruleid: taint-backend-nosqli
      .where(query)	// NOT OK - `.where()` on a Query.
      // todoruleid: taint-backend-nosqli
	    .and(query)
      // todoruleid: taint-backend-nosqli
	    .or(query)
      // todoruleid: taint-backend-nosqli
	    .distinct(X, query)
      // ok: taint-backend-nosqli
	    .comment(query) // OK
      // todoruleid: taint-backend-nosqli
	    .count(query) // NOT OK
      // todoruleid: taint-backend-nosqli
	    .exec();

    // todook: taint-backend-nosqli
    mongoose.createConnection(X).count(query); // OK (invalid program)
    // ruleid: taint-backend-nosqli
    mongoose.createConnection(X).model(Y).count(query);
    // ruleid: taint-backend-nosqli
    mongoose.createConnection(X).models[Y].count(query);

  // todoruleid: taint-backend-nosqli
  MyModel.findOne(X, (/*err,*/ res) => res.count(query)); // NOT OK
  // ok: taint-backend-nosqli
  MyModel.findOne(X, (err /*, res*/) => err.count(query));
  // ruleid: taint-backend-nosqli
  MyModel.findOne(X).exec((/*err,*/ res) => res.count(query)); // NOT OK
  // todook: taint-backend-nosqli
  MyModel.findOne(X).exec((err /*, res*/) => err.count(query)); // OK
  // ruleid: taint-backend-nosqli
  MyModel.findOne(X).then((res) => res.count(query)); // NOT OK
  // todook: taint-backend-nosqli
  MyModel.findOne(X).then(Y, (err) => err.count(query)); // OK

  // todoruleid: taint-backend-nosqli
  MyModel.find(X, (/*err, */ res) => res[i].count(query)); // NOT OK
  // ok: taint-backend-nosqli
  MyModel.find(X, (err /*, res*/) => err.count(query)); // OK
  // ruleid: taint-backend-nosqli
  MyModel.find(X).exec((/*err, */ res) => res[i].count(query)); // NOT OK
  // todook: taint-backend-nosqli
  MyModel.find(X).exec((err /*, res*/) => err.count(query)); // OK
  // ruleid: taint-backend-nosqli
  MyModel.find(X).then((res) => res[i].count(query)); // NOT OK
  // todook: taint-backend-nosqli
  MyModel.find(X).then(Y, (err) => err.count(query)); // OK

    // ok: taint-backend-nosqli
    MyModel.count(X, (/*err, */ res) => res.count(query)); // OK (res is a number)

    function innocent(/*X, Y, query*/) { // To detect if API-graphs were used incorrectly.
      return new Mongoose.Query("constant", "constant", "constant");
    }
    new innocent(X, Y, query);

    function getQueryConstructor() {
      return mongoose.Query;
    }

    var GetQueryConstructor = getQueryConstructor();
    // todoruleid: taint-backend-nosqli
    new GetQueryConstructor(X, Y, query); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.findOneAndUpdate(X, query, function () { }); // NOT OK

    let id = req.query.id, cond = req.query.cond;
    // ruleid: taint-backend-nosqli
    MyModel.deleteMany(cond); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.deleteOne(cond); // NOT OK
    // todoruleid: taint-backend-nosqli
    MyModel.geoSearch(cond); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.remove(cond); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.replaceOne(cond, Y); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.find(cond); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.findOne(cond); // NOT OK
    // todoruleid: taint-backend-nosqli
    MyModel.findById(id); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.findOneAndDelete(cond); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.findOneAndRemove(cond); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.findOneAndUpdate(cond, Y); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.update(cond, Y); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.updateMany(cond, Y); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.updateOne(cond, Y); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.find({ _id: id }); // NOT OK
    // ruleid: taint-backend-nosqli
    MyModel.find({ _id: { $eq: id } }); // OK

    res.send(users0);
    mongoose.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Mongoose Specific
// https://github.com/github/codeql/blob/bbd7e623418e41775c90cfbbe44ad25b3bf9c5e3/javascript/ql/test/query-tests/Security/CWE-089/untyped/mongooseJsonParse.js
app.get('/users', async (req, res) => {
  try {
    await mongoose.connect(`${url}/${dbName}`);

    const MyModel = Mongoose.model('users', {
        title: {
            type: String,
            unique: true
        },
        type: String
    });

    const query = {};
    query.title = JSON.parse(req.query.data).title;

    // ruleid: taint-backend-nosqli
    const users0 = await MyModel.find(query).toArray();

    res.send(users0);
    mongoose.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

// Mongojs Specific
app.get('/users', async (req, res) => {
  try {
    const db = mongojs(dbName, ['users']);
    const collection = db.collection('users')

    // Find all users
    const query1 = { user: req.query.user, city: req.query.city };    
    // ruleid: taint-backend-nosqli
    collection.count([query1], (/*err, users1*/) => {/* do stuff here */});

    res.send(users1);
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
