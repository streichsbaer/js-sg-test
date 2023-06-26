const express = require('express')

const app = express()

app.get('redirect', function(req, res) {
    // ruleid: taint-backend-open-redirect-response
    res.redirect('302', req.query.target)
})

app.get('redirect2', function(req, res) {
    // ruleid: taint-backend-open-redirect-response
    res.redirect(req.query.target)
})

app.get('redirect3', function(req, res) {
    // ruleid: taint-backend-open-redirect-response
    res.set('Location', req.query.target)
})

app.get('redirect4', function(req, res) {
    // ok: taint-backend-open-redirect-response
    res.redirect('http://google.com/' + req.query.target)
})

app.get('redirect5', function(req, res) {
    let url = req.query.target
    // todoruleid: taint-backend-open-redirect-response
    res.redirect(url)
})

app.get('redirectOk', function(req, res) {
    const whitelist = new Set(['google.com', 'guardrails.io'])
    let url = new URL(req.query.target)
    if (req.hostname != new URL(req.get('Referer')).hostname) {
        res.status(500).send("Can't redirect from an external website!")
    }
    if (whitelist.has(url.hostname)) {
        res.status(500).send('Invalid URL!')
    }
    // ok: taint-backend-open-redirect-response
    res.redirect(302, url)
})

app.get('redirectOk2', function(req, res) {
    const whiteList = ['google.com', 'guardrails.io']
    let url = new URL(req.query.target)
    if (new URL(req.hostname).hostname != new URL(req.get('Referer'))) {
        res.status(500).send("Can't redirect from an external website!")
    }
    if (whiteList.filter(u => url.hostname == u).length <= 0) {
        res.status(500).send('Invalid URL!')
    }
    // ok: taint-backend-open-redirect-response
    res.set('location', url)
})