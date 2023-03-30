import express from 'express';
import csurf from 'csurf';
import methodOverride from 'method-override';

const express = require('express');
const moverride = require('method-override')
const basicAuth = require('@fastify/basic-auth')
const csrf = require('csurf')

let myApp = express();

myApp.get('/', (req, res) => {
    // Verify credentials
    const header = req?.headers?.authorization;
    const [basic, b64data] = header.split(" ");

  // todook: string-compare-timing-attack
    if(basic.toLowerCase() !== "basic") return;

    const [user, pass] = atob(b64data).split(":", 1);

    if ((!authorization)
        // ruleid: string-compare-timing-attack
        || "admin" !== user
        // ruleid: string-compare-timing-attack
        || "pass" !== pass) {
        // Throw error if invalid
        res.header('WWW-Authenticate', 'Basic realm="DDrive Login"')
        const error = new Error('Missing or bad formatted authorization header')
        error.statusCode = 401
        throw error;
    }

    const users = ["admin", "bob"];
    const passes = ["admin", "iLikePainting123"];

    // ruleid: string-compare-timing-attack
    if(users.find(item => item === user) 
       // ruleid: string-compare-timing-attack
       && passes.indexOf(pass) != -1) {
        console.log("Authenticated ...");
    }


    const creds = {
        admin: "password123",
        john: "bonham"
    };

    if(user in creds 
       // ruleid: string-compare-timing-attack
       && creds[user] == pass) {
        console.log("Authenticated again ...");
    }
});


myApp.use("/api/v1", (req, resp, next) => {
	let userApiKey = req.header("X-API-KEY");
	
	// ruleid: string-compare-timing-attack
	if(userApiKey !== "MY_API_KEY") {
		resp.status(403);
		resp.send('Invalid API key');
		return;
	}

	next();
})

module.exports = ({ auth, publicAccess }) => async (req, reply, done) => {
    // If creds are not given skip this route
    if (!auth.user && !auth.pass) return
    // Check if route is public or not
    const { routeConfig: { ACCESS_TAGS } } = req
    if (ACCESS_TAGS && ACCESS_TAGS.includes(publicAccess)) return;
    // Verify credentials
    const header = req?.headers?.authorization;
    const [basic, b64data] = header.split(" ");

  // todook: string-compare-timing-attack
    if(basic.toLowerCase() !== "basic") return;

    const [user, pass] = atob(b64data).split(":", 1);

    if ((!authorization)
    // ruleid: string-compare-timing-attack
        || authorization.user !== user
    // ruleid: string-compare-timing-attack
        || authorization.pass !== pass) {
        // Throw error if invalid
        reply.header('WWW-Authenticate', 'Basic realm="DDrive Login"')
        const error = new Error('Missing or bad formatted authorization header')
        error.statusCode = 401
        done(error)
    }
}

function registerBasicAuth(server, opts) {
    if (opts.auth) {
        const { username, password } = opts.auth
        await server.register(basicAuth, {
            validate: function (user, pass, req, reply, done) {
                // ruleid: string-compare-timing-attack
                if (username !== user || password !== pass) {
                    return reply.code(401).send({ message: 'Unauthorized' })
                }
                return done()
            }
        })
    }
}
