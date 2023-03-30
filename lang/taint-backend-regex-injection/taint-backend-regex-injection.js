const express = require('express')
const safe_regex = require('safe-regex')
const escape_regex = require('lodash.escaperegexp')
const app = express()
const port = 3000

app.get('/test', (req, res) => {
    const p = "The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?";

    // ruleid: taint-backend-regex-injection
    new RegExp(req.params.regex)
    // ruleid: taint-backend-regex-injection
    RegExp("[" + req.params.regex + "]+")
    // ok: taint-backend-regex-injection
    new RegExp("[abc]+", req.params.flags)
    // ok: taint-backend-regex-injection
    RegExp("[abc]+", req.params["flags"])

    res.send('Hello World!')
})

app.get("/search", (req, res) => {
    let str_regex = req.params["regex"]
    if (!safe_regex(str_regex) 
        && req.params["regex"].length >= 15) {
        res.send("Invalid regex!")
        return
    }
    // ok: taint-backend-regex-injection
    let regex = new RegExp(str_regex)
    regex.exec("match me!")
})

app.get("/search02", (req, res) => {
    let str_regex = req.params["regex"]
    if (!str_regex.match(/[a-zA-Z0-9]+/)
        && req.params["regex"].length >= 15) {
        res.send("Invalid regex!")
        return
    }
    // ok: taint-backend-regex-injection
    let regex = new RegExp(str_regex)
    regex.exec("match me!")
})

app.get("/search03", (req, res) => {
    let str_regex = escape_regex(req.params.regex)
    // ok: taint-backend-regex-injection
    let regex = new RegExp(str_regex)
    regex.exec("match me!")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})