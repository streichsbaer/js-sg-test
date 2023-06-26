const handlebars1 = require('handlebars')
import handlebars2 from 'handlebars'
import * as handlebars3 from 'handlebars'
const { compile } = require('handlebars')
// import { compile } from 'handlebars'


const source = "Hello {{name}}!"

// ruleid: disabled-auto-escape
handlebars1.compile(source, {noEscape: true})

// ruleid: disabled-auto-escape
let opts = {noEscape: true}
handlebars2.compile(source, opts)

// ruleid: disabled-auto-escape
handlebars3.compile(source, {noEscape: true})

// ruleid: disabled-auto-escape
let opts2 = {noEscape: true}
compile(source, opts2)

// ok: disabled-auto-escape
handlebars1.compile(source)
// ok: disabled-auto-escape
let opts3 = {noEscape: false}
handlebars2.compile(source, opts3)
// ok: disabled-auto-escape
compile(source)
// ok: disabled-auto-escape
compile(source, {noEscape: false})
