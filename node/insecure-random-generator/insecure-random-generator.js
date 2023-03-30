const Crypto = require("crypto");
const { pseudoRandomBytes, createDecipher, randomBytes, createECDH } =  require("crypto");
const crypto = require("crypto");
const express = require('express');

function testNamespace() {
	let key1 = Crypto.pseudoRandomBytes(4);
	// ruleid: insecure-random-generator
	Crypto.createCipher("aes192", key1);
	// ruleid: insecure-random-generator
	crypto.createCipher("aes192", key1);

	let salt2 = Crypto.pseudoRandomBytes(4);
	// ruleid: insecure-random-generator
	createDecipher("aes192", salt2);

	let buffer = Crypto.pseudoRandomBytes(16);
	let algo = crypto.createECDH(crypto.getCurves()[0]);
	// ruleid: insecure-random-generator
	algo.setPrivateKey(buffer);

	let buffer2 = Crypto.pseudoRandomBytes(16);
	let algo2 = Crypto.createECDH(crypto.getCurves()[0]);
	// ruleid: insecure-random-generator
	algo2.setPrivateKey(buffer2);
}

function testNamed() {
	let key1 = pseudoRandomBytes(4);
	// ruleid: insecure-random-generator
	Crypto.createCipher("aes192", key1);

	let salt2 = pseudoRandomBytes(4);
	// ruleid: insecure-random-generator
	createDecipher("aes192", salt2);

	let buffer = pseudoRandomBytes(16);
	let algo = crypto.createECDH(crypto.getCurves()[0]);
	// ruleid: insecure-random-generator
	algo.setPrivateKey(buffer);
}

function testDefault() {
	let key1 = crypto.pseudoRandomBytes(4);
	// ruleid: insecure-random-generator
	Crypto.createCipher("aes192", key1);

	let salt2 = crypto.pseudoRandomBytes(4);
	// ruleid: insecure-random-generator
	createDecipher("aes192", salt2);

	let buffer = crypto.pseudoRandomBytes(16);
	let algo = crypto.createECDH(crypto.getCurves()[0]);
	// ruleid: insecure-random-generator
	algo.setPrivateKey(buffer);
}

function goodNamespace() {
	// ok: insecure-random-generator
	Crypto.createCipher('aes192', crypto.randomBytes(4));

	// ok: insecure-random-generator
	createDecipher('aes192', Crypto.randomBytes(4));

	let buffer = Crypto.randomBytes(16);
	let algo = crypto.createECDH(crypto.getCurves()[0]);
	// ok: insecure-random-generator
	algo.setPrivateKey(buffer);
}

function goodNamed() {
	// ok: insecure-random-generator
	Crypto.createCipher('aes192', randomBytes(4));

	// ok: insecure-random-generator
	createDecipher('aes192', crypto.randomBytes(4));

	let buffer = randomBytes(16);
	let algo = Crypto.createECDH(crypto.getCurves()[0]);
	// ok: insecure-random-generator
	algo.setPrivateKey(buffer);
}

function goodDefault() {
	// ok: insecure-random-generator
	Crypto.createCipher('aes192', Crypto.randomBytes(4));

	// ok: insecure-random-generator
	createDecipher('aes192', randomBytes(43));

	let buffer = crypto.randomBytes(16);
	let algo = createECDH(crypto.getCurves()[0]);
	// ok: insecure-random-generator
	algo.setPrivateKey(buffer);
}

function testRedirect() {

	let app = express();
	let receipts = {};
	app.use(express.urlencoded({extended: true}));

	app.get('/checkout', function(req, res) {
		res.sendFile('./checkout.html', {root: '.'});
	});

	app.get('/receipt/:id', function(req, res) {
		if(req.params.id in receipts) {
			res.json(receipts[req.params.id])
		} else {
			res.status(404).json({'error': 'not found'});
		}
	});

	app.post('/checkout', function(req, res) {
		let receipt = {
			items: req.body.itemNames,
			total: req.body.itemPrices.reduce((total, n) => total + (parseInt(n) || 0), 0)
		};

		let receiptId = crypto.pseudoRandomBytes(8).toString('hex');
		receipts[receiptId] = receipt;

		// ruleid: insecure-random-generator
		res.redirect(`/receipt/${receiptId}`);

	});

	app.listen(8080);

}
