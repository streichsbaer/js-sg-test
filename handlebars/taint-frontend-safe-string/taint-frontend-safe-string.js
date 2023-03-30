/* Sources are thoroughly tested in lang/taint-dom-html-injection*/

import * as Handlebars from 'handlebars';

async function test1() {
	let request = await fetch("http://example.com/example.txt");
	let body = await request.text();
	// ruleid: taint-frontend-safe-string
	new Handlebars.SafeString(body);
}

async function test2() {
	let request = await fetch("http://example.com/example.txt");
	let body = DOMPurify.sanitize(await request.text());
	// ok: taint-frontend-safe-string
	new Handlebars.SafeString(body);
}

function test3() {
	let template = Handlebars.compile('This is some bold text: <b>{{input}}</b>')
	let request = fetch("http://example.com/example.txt")
		.then(body => body.text())
		// ruleid: taint-frontend-safe-string
		.then(text => new Handlebars.SafeString(text))
		.then(sstring => template({input: sstring}));
}

function test4() {
	let template = Handlebars.compile('This is some bold text: <b>{{input}}</b>')
	let request = fetch("http://example.com/example.txt")
		.then(body => body.text())
		.then(DOMPurify.sanitize)
		// ok: taint-frontend-safe-string
		.then(text => new Handlebars.SafeString(text))
		.then(sstring => template({input: sstring}));
}

function test5() {
	let template = Handlebars.compile('This is some bold text: <b>{{input}}</b>')
	let request = fetch("http://example.com/example.txt")
		.then(body => body.text())
		.then(Handlebars.Utils.escapeExpression)
		// ok: taint-frontend-safe-string
		.then(text => new Handlebars.SafeString(text))
		.then(sstring => template({input: sstring}));
}
