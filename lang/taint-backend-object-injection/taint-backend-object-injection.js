// Check that both module systems work and all the permatations:
// CJS ///////////////////////////////////////////
//const express = require("express");
// ESM ////////////////////////////////////////////
import express from 'express';
import Bourne from '@hapi/bourne';

const app = express();

app.get('/users', async (req, res) => {
  try {
    const obj = {};
    const untrustedBehaviour = JSON.parse(req.body.behaviour);

    // ruleid: taint-backend-object-injection
    obj[req.body.name] = true;
    // ruleid: taint-backend-object-injection
    obj['doSomething'] = untrustedBehaviour;
    // ruleid: taint-backend-object-injection
    obj['doSomething'] = JSON.parse(req.body.behaviour);
    // ruleid: taint-backend-object-injection
    obj.doSomething = untrustedBehaviour;
    // ruleid: taint-backend-object-injection
    obj.doSomething = JSON.parse(req.body.behaviour);
    // ok: taint-backend-object-injection
    obj.doSomething = req.body.behaviour
    // ok: taint-backend-object-injection
    obj['doSomething'] = req.body.behaviour;
    // ok: taint-backend-object-injection
    obj['doSomething'] = `() => ${req.body.behaviour}`; // Strings are not directly executable.
    // ok: taint-backend-object-injection
    obj['doSomething'] = "() => " + req.body.behaviour + " "; // Strings are not directly executable.

    // ok: taint-backend-object-injection
    Object.defineProperty(obj, 'newProp', { value: () => {/* do evil stuff */}, writable: false });
    // ok: taint-backend-object-injection
    Object.defineProperty(obj, 'newProp', { value: req.body.behaviour, writable: false });
    // ruleid: taint-backend-object-injection
    Object.defineProperty(obj, 'newProp', { value: untrustedBehaviour, writable: false });
    // ruleid: taint-backend-object-injection
    Object.defineProperty(obj, 'newProp', { value: Bourne.parse(req.body.behaviour), writable: false });

    const untrustedObject = JSON.parse(req.body.json);
    // ok: taint-backend-object-injection
    Object.defineProperties(obj, req.body.json);
    // ruleid: taint-backend-object-injection
    Object.defineProperties(obj, untrustedObject);
    // ruleid: taint-backend-object-injection
    Object.defineProperties(obj, JSON.parse(req.body.json));

    // ok: taint-backend-object-injection
    Object.assign(obj, req.body.json);
    // ruleid: taint-backend-object-injection
    Object.assign(obj, untrustedObject);
    // ruleid: taint-backend-object-injection
    Object.assign(obj, Bourne.parse(req.body.json));

    // ok: taint-backend-object-injection
    Object.setPrototypeOf(obj, req.body.json);
    // ruleid: taint-backend-object-injection
    Object.setPrototypeOf(obj, untrustedObject);
    // ruleid: taint-backend-object-injection
    Object.setPrototypeOf(obj, JSON.parse(req.body.json));

    // ruleid: taint-backend-object-injection
    Object.create(untrustedObject);
    // ruleid: taint-backend-object-injection
    Object.create(JSON.parse(req.body.json));
    // ruleid: taint-backend-object-injection
    Object.create({}, untrustedObject);
    // ruleid: taint-backend-object-injection
    Object.create({}, JSON.parse(req.body.json));

    // req.body.behaviour may be: '{ "innocentPropertyNotReally": "() => alert(\\"Attack!\\")" }';
    // For the above to work, one option is to pass a reviver function to JSON.parse and a replacer function to JSON.stringify
    // ruleid: taint-backend-object-injection
    with (untrustedBehaviour) { innocentPropertyNotReally(); }
    // ruleid: taint-backend-object-injection
    with (JSON.parse(req.body.behaviour)) { innocentPropertyNotReally(); }
    // ruleid: taint-backend-object-injection
    with (untrustedBehaviour) innocentPropertyNotReally();
    // ruleid: taint-backend-object-injection
    with (JSON.parse(req.body.behaviour)) innocentPropertyNotReally();
        
    // ruleid: taint-backend-object-injection
    const objFromSpread1 = { ...untrustedObject, prop: 'arbitrary value'};
    // ruleid: taint-backend-object-injection
    const objFromSpread1 = { ...JSON.parse(req.body.json), prop: 'arbitrary value'};
    // ruleid: taint-backend-object-injection
    const objFromSpread2 = { ...obj, untrusted: untrustedObject};
    // ruleid: taint-backend-object-injection
    const objFromSpread2 = { ...obj, untrusted: Bourne.parse(req.body.json)};

    //const req.body.json = '{ "name": "John", "age": 50, "website": "https://evilsite.com" }';
    const userFunc = function (/* possible parameters */) { window.location.replace(this.website); };
    // ruleid: taint-backend-object-injection
    userFunc.apply(Bourne.parse(req.body.json) /*, [possible args]*/);
    // ruleid: taint-backend-object-injection
    userFunc.call(JSON.parse(req.body.json) /*,possible, args*/);
    // ruleid: taint-backend-object-injection
    const boundUserFunc = userFunc.bind(JSON.parse(req.body.json) /*,possible, args*/);

    // ruleid: taint-backend-object-injection
    const proxied = new Proxy(obj, untrustedObject);

    // req.body.behaviour may be: '{ "innocentPropertyNotReally": "() => alert(\\"Attack!\\")" }';
    // For the above to work, one option is to pass a reviver function to JSON.parse and a replacer function to JSON.stringify
    // ruleid: taint-backend-object-injection
    Reflect.set(obj, innocentPropertyNotReally, untrustedBehaviour.innocentPropertyNotReally);
    // ruleid: taint-backend-object-injection
    Reflect.set(obj, innocentPropertyNotReally, Bourne.parse(req.body.behaviour).innocentPropertyNotReally);

    const innocentPropertyNotReally = function(){untrustedBehaviour.innocentPropertyNotReally};
    // ruleid: taint-backend-object-injection
    Reflect.apply(innocentPropertyNotReally, untrustedBehaviour, []);
    // ruleid: taint-backend-object-injection
    Reflect.apply(innocentPropertyNotReally, JSON.parse(req.body.behaviour), []);

    function TargetClass(name, age, func) { this.name = name; this.age = age; this.func = func; };
    // ruleid: taint-backend-object-injection
    Reflect.construct(TargetClass, ['John', 50, untrustedBehaviour.innocentPropertyNotReally]);
    // ruleid: taint-backend-object-injection
    Reflect.construct(TargetClass, ['John', 50, JSON.parse(req.body.behaviour).innocentPropertyNotReally]);
    // ruleid: taint-backend-object-injection
    Reflect.construct(TargetClass, ['John', 50, () => {}], untrustedBehaviour);
    // ruleid: taint-backend-object-injection
    Reflect.construct(TargetClass, ['John', 50, () => {}], JSON.parse(req.body.behaviour));
    
    Reflect.defineProperty(
      obj,
      'innocentPropertyNotReally',
      // ruleid: taint-backend-object-injection
      {
        value: untrustedBehaviour.innocentPropertyNotReally,
        writable: true,
        enumerable: true,
        configurable: true
      }
    );    
    Reflect.defineProperty(
      obj,
      'innocentPropertyNotReally',
      // ruleid: taint-backend-object-injection
      {
        value: JSON.parse(req.body.behaviour).innocentPropertyNotReally,
        writable: true,
        enumerable: true,
        configurable: true
      }
    );

    Reflect.get(
      {
        name: 'John',
        age: 50,
        innocentPropertyNotReally: () => {/* is actually innocent until replaced */}
      },
      'innocentPropertyNotReally',
      // ruleid: taint-backend-object-injection
      untrustedBehaviour
    );
    Reflect.get(
      {
        name: 'John',
        age: 50,
        innocentPropertyNotReally: () => {/* is actually innocent until replaced */}
      },
      'innocentPropertyNotReally',
      // ruleid: taint-backend-object-injection
      JSON.parse(req.body.behaviour)
    );

    Reflect.setPrototypeOf(
      {
        name: 'John',
        age: 50,
        innocentPropertyNotReally: () => {/* is actually innocent until replaced */}
      },
      // ruleid: taint-backend-object-injection
      untrustedBehaviour
    );
    Reflect.setPrototypeOf(
      {
        name: 'John',
        age: 50,
        innocentPropertyNotReally: () => {/* is actually innocent until replaced */}
      },
      // ruleid: taint-backend-object-injection
      JSON.parse(req.body.behaviour)
    );

    const prototypeTest = {
      name: 'John',
      age: 50
    };
    // ruleid: taint-backend-object-injection
    prototypeTest.__proto__ = untrustedBehaviour;
    // ruleid: taint-backend-object-injection
    prototypeTest.__proto__ = JSON.parse(req.body.behaviour);

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
