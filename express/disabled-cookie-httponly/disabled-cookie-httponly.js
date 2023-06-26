// https://github.com/returntocorp/semgrep-rules/blob/b83e22e89d02e48d1490a222e305b2b879d34590/contrib/nodejsscan/header_cookie.js
const session1 = require('express-session')
const session2 = require('cookie-session')
import session3 from 'express-session'
import session4 from 'cookie-session'
import * as session5 from 'express-session'
import * as session6 from 'cookie-session'

const express = require('express')

const app = express()

app.use(session1({
    name: 'foo',
    cookie: {
        // ruleid: disabled-cookie-httponly
        httpOnly: false,
        path: '/'
    }
}))

app.use(session2({
    signed: true,
    // ruleid: disabled-cookie-httponly
    httpOnly: false
}))

let opts3 = {}
// ruleid: disabled-cookie-httponly
opts3.cookie.httpOnly = false
app.use(session3(opts3))

let opts4 = {}
// ruleid: disabled-cookie-httponly
opts4.httpOnly = false
app.use(session4(opts4))

let opts5 = {
    name: 'foo',
    cookie: {
        // ruleid: disabled-cookie-httponly
        httpOnly: false,
        path: '/'
    }
}
app.use(session5(opts5))

let opts6 = {
    signed: true,
    // ruleid: disabled-cookie-httponly
    httpOnly: false
}
app.use(session6(opts6))

let opts7 = {
    name: 'foo',
}
// ruleid: disabled-cookie-httponly
opts7.cookie = {path: '/', httpOnly: false}
app.use(session5(opts7))


const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.get('/hello', function(req, res) {
    res.cookie('mycookie', 'myvalue', {
        path: '/',
        // ruleid: disabled-cookie-httponly
        httpOnly: false
      })
    res.send('Hello')
})

app.get('/hello-true', function(req, res) {
    res.cookie('mycookie', 'myvalue', {
        path: '/',
        // ok: disabled-cookie-httponly
        httpOnly: true
      })
    res.send('Hello')
})

app.get('/hello2', function(req, res) {
    // ruleid: disabled-cookie-httponly
    let opts = {httpOnly: false, path: '/'}
    res.cookie('mycookie', 'myvalue', opts)
    res.send('Hello')
})

app.get('/hello2-true', function(req, res) {
    // ok: disabled-cookie-httponly
    let opts = {httpOnly: true, path: '/'}
    res.cookie('mycookie', 'myvalue', opts)
    res.send('Hello')
})
