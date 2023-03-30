// Check that both module systems work and all the permatations
// Imports are separated in groups of 3, so comment out the groups of 3 
// you do not use before testing the rule 

// CJS ///////////////////////////////////////////
const { createCipher } = require('crypto');
const { createCipheriv: CCIV_CJS } = require('crypto');
const crypto = require('crypto');

const { createCipheriv } = require('node:crypto');
const { createCipher: CC_CJS } = require('node:crypto');
const crypto = require('node:crypto');

// ESM ///////////////////////////////////////////
// Note that only the await import is tested here, as 
// the official documentation of NodeJS does not mention anything
// related to import without await 

const { createDecipher } = await import('crypto');
const { createDecipheriv: CDIV_ESM } = await import('crypto');
const crypto = await import('crypto');

const { createDecipheriv } = await import('node:crypto');
const { createDecipher: CD_ESM } = await import('node:crypto');
const crypto = await import('node:crypto');

const key = "some dummy key"
const iv = "some dummy iv";

// CJS ///////////////////////////////////////////
// ruleid: weak-encryption-algorithms
const cjs_method_alg = createCipher('AES-192-ECB', key);

// ruleid: weak-encryption-algorithms
const cjs_alias_alg = CCIV_CJS('des', key, iv);

// ruleid: weak-encryption-algorithms 
const cjs_module_alg = crypto.createCipher('RC4-HMAC-MD5', key);

// ok: weak-encryption-algorithms
const ok_cjs_method_alg = createCipheriv('aes-256-gcm', key, iv);

// ok: weak-encryption-algorithms
const ok_cjs_alias_alg = CC_CJS('CHACHA20', key);

// ok: weak-encryption-algorithms
const ok_cjs_module_alg = crypto.createCipheriv('aes-256-ctr', key, iv);


// ESM ///////////////////////////////////////////
// ruleid: weak-encryption-algorithms
const esm_method_alg = createDecipher('RC2-OFB', key);

// ruleid: weak-encryption-algorithms
const esm_alias_alg = CDIV_ESM('rc4', key, iv);

// ok: weak-encryption-algorithms
const ok_esm_method_alg = createDecipheriv('AES-256-CCM', key, iv);

// ok: weak-encryption-algorithms
const ok_esm_alias_alg = CD_ESM('chacha20-poly1305', key);

// ok: weak-encryption-algorithms
const ok_esm_module_alg = crypto.createDecipheriv('aes-256-ofb', key, iv);

///////////////////////////////////////////////////////////////
// Exhaustive test for regex checking

// ruleid: weak-encryption-algorithms
crypto.createCipher('aes-128-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('aes-192-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('aes-256-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-cfb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-cfb1', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-cfb8', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede-cfb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede-ofb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3-cfb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3-cfb1', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3-cfb8', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ede3-ofb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des-ofb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des3', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('des3-wrap', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('desx', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('desx-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-128', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-40', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-40-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-64', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-64-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-cfb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc2-ofb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc4', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc4-40', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('rc4-hmac-md5', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('sm4', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('sm4-cbc', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('sm4-cfb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('sm4-ctr', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('sm4-ecb', key);

// ruleid: weak-encryption-algorithms
crypto.createCipher('sm4-ofb', key);