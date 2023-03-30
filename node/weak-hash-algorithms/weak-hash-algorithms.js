// Check that both module systems work and all the permatations
// Imports are separated in groups of 3, so comment out the groups of 3 
// you do not use before testing the rule 

// CJS ///////////////////////////////////////////
const { createHash } = require('crypto');
const { createHash: CH_CJS } = require('crypto');
const crypto = require('crypto');

const { createHash } = require('node:crypto');
const { createHash: CH_CJS } = require('node:crypto');
const crypto = require('node:crypto');

// ESM ///////////////////////////////////////////
// Note that only the await import is tested here, as 
// the official documentation of NodeJS does not mention anything
// related to import without await 

const { createHash } = await import('crypto');
const { createHash: CH_ESM } = await import('crypto');
const crypto = await import('crypto');

const { createHash } = await import('node:crypto');
const { createHash: CH_ESM } = await import('node:crypto');
const crypto = await import('node:crypto');

// CJS ///////////////////////////////////////////
// ruleid: weak-hash-algorithms
const cjs_method_hash = createHash('sha1');

// ruleid: weak-hash-algorithms 
const cjs_alias_hash = CH_CJS('MD5');

// ruleid: weak-hash-algorithms 
const cjs_module_hash = crypto.createHash('MD4');

// ok: weak-hash-algorithms 
const ok_cjs_method_hash = createHash('sha256');

// ok: weak-hash-algorithms 
const ok_cjs_alias_hash = CH_CJS('SHA3-256');

// ok: weak-hash-algorithms 
const ok_cjs_module_hash = crypto.createHash('sha512');

// ESM ///////////////////////////////////////////
// ruleid: weak-hash-algorithms
const esm_method_hash = createHash('rsa-sha1-2');

// ruleid: weak-hash-algorithms 
const esm_alias_hash = CH_ESM('RSA-SHA1');

// ruleid: weak-hash-algorithms 
const esm_module_hash = crypto.createHash('ssl3-md5');

// ok: weak-hash-algorithms 
const ok_esm_method_hash = createHash('sha3-384');

// ok: weak-hash-algorithms 
const ok_esm_alias_hash = CH_ESM('SHA224');

// ok: weak-hash-algorithms 
const ok_esm_module_hash = crypto.createHash('sha384');

// ruleid: weak-hash-algorithms 
crypto.createHash('rsa-md4');

// ruleid: weak-hash-algorithms 
crypto.createHash('rsa-md5');

// ruleid: weak-hash-algorithms 
crypto.createHash('rsa-sha1');

// ruleid: weak-hash-algorithms 
crypto.createHash('rsa-sha1-2');

// ruleid: weak-hash-algorithms 
crypto.createHash('md4');

// ruleid: weak-hash-algorithms 
crypto.createHash('md4WithRSAEncryption');

// ruleid: weak-hash-algorithms 
crypto.createHash('md5');

// ruleid: weak-hash-algorithms 
crypto.createHash('md5WithRSAEncryption');

// ruleid: weak-hash-algorithms 
crypto.createHash('sha1');

// ruleid: weak-hash-algorithms 
crypto.createHash('sha1WithRSAEncryption');

// ruleid: weak-hash-algorithms 
crypto.createHash('ssl3-md5');

// ruleid: weak-hash-algorithms 
crypto.createHash('ssl3-sha1');
