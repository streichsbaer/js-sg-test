const express = require('express');
const lusca = require('lusca');

import lusca2 from 'lusca';
import { xssProtection } from 'lusca';


const app = express();

// ruleid: disabled-xss-protection
app.use(lusca({
    csrf: true,
    csp: { policy: "referrer no-referrer" },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: false,
    nosniff: true,
    referrerPolicy: 'same-origin'
}));

app.use(lusca.csrf());
app.use(lusca.csp({ policy: [{ "img-src": "'self' http:" }, "block-all-mixed-content"], reportOnly: false }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.p3p('ABCDEF'));
app.use(lusca.hsts({ maxAge: 31536000 }));
// ruleid: disabled-xss-protection
app.use(lusca.xssProtection(false));
// ruleid: disabled-xss-protection
app.use(lusca2.xssProtection(false));
// ruleid: disabled-xss-protection
app.use(xssProtection(false));
// ok: disabled-xss-protection
app.use(lusca.xssProtection(true));
// ok: disabled-xss-protection
app.use(lusca2.xssProtection(true));
// ok: disabled-xss-protection
app.use(xssProtection(true))
app.use(lusca.nosniff());
app.use(lusca.referrerPolicy('same-origin'));
