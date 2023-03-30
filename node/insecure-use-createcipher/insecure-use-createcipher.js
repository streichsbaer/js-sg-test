// Check that both module systems work and all the permatations
// Imports are separated in groups of 3, so comment out the groups of 3 
// you do not use before testing the rule 

// CJS ///////////////////////////////////////////
const { createCipher, createCipheriv } = require('crypto');
const { createCipher: CC_CJS, createCipheriv: CCIV_CJS } = require('crypto');
// const crypto = require('crypto');

const { createDecipher, createDecipheriv } = require('node:crypto');
const { createDecipher: CD_CJS, createDecipheriv: CDIV_CJS } = require('node:crypto');
const crypto = require('node:crypto');

// ESM ///////////////////////////////////////////
// Note that only the await import is tested here, as 
// the official documentation of NodeJS does not mention anything
// related to import without await 

// const { createCipher } = await import('crypto');
const { createCipher: CC_ESM, createCipheriv: CCIV_ESM } = await import('crypto');
// const crypto = await import('crypto');

// const { createDecipher } = await import('node:crypto');
const { createDecipher: CD_ESM, createDecipheriv: CDIV_ESM } = require('node:crypto');
// const crypto = await import('node:crypto');

const key = "some dummy key"
const iv = "some dummy iv";

// ruleid: insecure-use-createcipher 
createCipher('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
CC_CJS('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
crypto.createCipher('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
createDecipher('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
CD_CJS('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
CC_ESM('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
CD_ESM('aes-128-cbc', key);

// ruleid: insecure-use-createcipher 
crypto.createDecipher('aes-128-cbc', key);

// ok: insecure-use-createcipher
crypto.createCipheriv('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
crypto.createDecipheriv('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
createCipheriv('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
createDecipheriv('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
CCIV_CJS('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
CDIV_CJS('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
CCIV_ESM('aes-128-cbc', key, iv);

// ok: insecure-use-createcipher 
CDIV_ESM('aes-128-cbc', key, iv);
