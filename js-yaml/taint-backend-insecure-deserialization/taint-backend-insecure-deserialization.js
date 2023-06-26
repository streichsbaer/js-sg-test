const fs = require('fs')
const express = require('express')
const yaml = require('js-yaml')
const yaml_js_types = require('js-yaml-js-types')
const multer = require('multer')

import yaml_js_types2 from 'js-yaml-js-types'
import * as yaml_js_types3 from 'js-yaml-js-types'

const SCHEMA = yaml.DEFAULT_SCHEMA.extend(yaml_js_types.all)

const app = express()
const upload = multer({dest: './uploads/'})

app.post('/convert', upload.single('uploaded_file'), function(req, res) {
    // ruleid: taint-backend-insecure-deserialization
    yaml.load(fs.readFileSync(req.file.path, 'utf-8'), { SCHEMA })

    let schema1 = yaml.DEFAULT_SCHEMA.extend(require('js-yaml-js-types').all)
    // ruleid: taint-backend-insecure-deserialization
    yaml.load(fs.readFileSync(req.file.path, 'utf-8'), { schema1 })

    let schema2 = yaml.DEFAULT_SCHEMA.extend(yaml_js_types2.all)
    // ruleid: taint-backend-insecure-deserialization
    yaml.load(fs.readFileSync(req.file.path, 'utf-8'), { schema2 })

    let schema3 = yaml.DEFAULT_SCHEMA.extend(yaml_js_types3.all)
    // ruleid: taint-backend-insecure-deserialization
    yaml.load(fs.readFileSync(req.file.path, 'utf-8'), { schema3 })
})

app.post('/post', upload.single('uploaded_file'), function(req, res) {
    let schema = yaml.DEFAULT_SCHEMA.extend([yaml_js_types.undefined, yaml_js_types.regexp])
    // ok: taint-backend-insecure-deserialization
    yaml.load(fs.readFileSync(req.file.path, 'utf-8'), { schema })
    // ok: taint-backend-insecure-deserialization
    yaml.load(fs.readFileSync(req.file.path, 'utf-8'))
})
