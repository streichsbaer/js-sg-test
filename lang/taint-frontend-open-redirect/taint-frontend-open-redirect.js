/* Sources are thoroughly tested in lang/taint-dom-html-injection*/

function test1() {
	let req = new XMLHttpRequest();
	req.onload = function() {
		// ruleid: taint-frontend-open-redirect
		window.location.href = req.getResponseHeader('Location')
	};

	req.open("https://example.com/user_controlled_redirect");
	req.send();
}

function test2() {
	// ok: taint-frontend-open-redirect
	window.location.href = "#next-header";
}


function test3() {
	fetch("https://example.com/redirect")
		.then(resp => resp.text())
		// ruleid: taint-frontend-open-redirect
		.then(body => window.location.href = body);
}

function test3_1() {
	fetch("https://example.com/redirect")
		.then(resp => resp.text())
		.then(body => {
			// ruleid: taint-frontend-open-redirect
			window.location.href = body;
		});
}

const REDIRECTS = [
	"#header-1",
	"#header-2",
	"/login",
	"/home"
];

function test4() {
	let req = new XMLHttpRequest();
	req.onload = function() {
		let redirectID = JSON.parse(req.responseText).id;
		if(redirectID < REDIRECTS.length) {
			// ok: taint-frontend-open-redirect
			window.location.href = redirects[redirectID];
		}
	};

	req.open("https://example.com/get_redirect_id");
	req.send();
}

function test4_1() {
	let req = new XMLHttpRequest();
	req.onload = function() {
		let redirect_loc = JSON.parse(req.responseText).new_location;
		// ruleid: taint-frontend-open-redirect
		window.location.href = redirect_loc;
	};

	req.open("https://example.com/get_redirect");
	req.send();
}

function test5() {
	let req = new XMLHttpRequest();
	req.onload = function() {
		let redirect_loc = JSON.parse(req.responseText).new_location;
		let url = new URL(redirect_loc);
		if(url.hostname == "mysite.com") {
			// ok: taint-frontend-open-redirect
			window.location.href = redirect_loc;
			// ok: taint-frontend-open-redirect
			window.location.href = url;
		}
	};

	req.open("https://example.com/get_redirect");
	req.send();
}

function test5_1() {
	let req = new XMLHttpRequest();
	req.onload = function() {
		let redirect_loc = JSON.parse(req.responseText).new_location;
		if(new URL(redirect_loc).hostname == "mysite.com") {
			// ok: taint-frontend-open-redirect
			window.location.href = redirect_loc;
		}
	};

	req.open("https://example.com/get_redirect");
	req.send();
}

function test5_2() {
	let req = new XMLHttpRequest();
	req.onload = function() {
		let redirect_loc = JSON.parse(req.responseText).new_location;
		if(new URL(redirect_loc).path == "/") {
			// ruleid: taint-frontend-open-redirect
			window.location.href = redirect_loc;
		}
	};

	req.open("https://example.com/get_redirect");
	req.send();
}
