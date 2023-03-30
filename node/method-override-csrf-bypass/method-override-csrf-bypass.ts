import express from 'express';
import csurf from 'csurf';
import methodOverride from 'method-override';

// const express = require('express');
const moverride = require('method-override')
const csrf = require('csurf')

let myApp = express();

// ruleid: method-override-csrf-bypass
myApp.use(csrf())
myApp.use(moverride('X-HTTP-Method-Override'))


// For earlier/deprecated versions of express
let myApp2 = express.createServer();
// ruleid: method-override-csrf-bypass
myApp2.use(express.csrf());
myApp2.use(express.methodOverride('X-HTTP-Method-Override'))

let myApp3 = express();

// ruleid: method-override-csrf-bypass
myApp3.use(csurf())
myApp3.use(methodOverride('X-HTTP-Method-Override'))

let myApp4 = express();

// ok: method-override-csrf-bypass
myApp4.use(methodOverride('X-HTTP-Method-Override'))
myApp4.use(csurf())

let myApp5 = express();

// ruleid: method-override-csrf-bypass
myApp5.use(csurf({ cookie: true }))
myApp5.use(methodOverride('X-HTTP-Method-Override'))

let myApp6 = express();

const csrfMiddleware = csurf({ cookie: true });

// todoruleid: method-override-csrf-bypass
myApp6.use(csrfMiddleware)
myApp6.use(methodOverride('X-HTTP-Method-Override'))
