function good() {
	var d = document.createElement('div');
	// ok: taint-frontend-html-injection
	d.innerHTML = "This is ok";
	document.body.appendChild(d);
}

document.onready = function() {
	var d = document.createElement('div');
	// ruleid: taint-frontend-html-injection
	d.innerHTML = document.location.search;
	document.body.appendChild(d);
}

async function bad_code2() {
    let r = await fetch("http://google.com").text();
	// ruleid: taint-frontend-html-injection
    document.write(r);
}

async function bad_code3() {
    let r = await fetch("http://google.com");
    let g = await r.text();
	// ruleid: taint-frontend-html-injection
    document.write(g);
}

function myGoodFunc(input) {
	var d = document.createElement('div');
	// ok: taint-frontend-html-injection
	d.innerHTML = sanitizeHtml(input);
	document.body.appendChild(d);
}

function ajax_callback() {
    // ruleid: taint-frontend-html-injection
    document.write(this.responseText);
}

function ajax_callback2() {
	let a = document.getElementById("my-div");
    // ruleid: taint-frontend-html-injection
	a.innerHTML = this.getResponseHeader('Content-Type')
}

function bad_ajax() {
    const a = new XMLHttpRequest();
    a.onload = ajax_callback;
    a.open("GET", "http://www.example.org/example.txt");
    a.send();
}

function bad_ajax2() {
    const a = new XMLHttpRequest();
    a.onload = () => {
        // ruleid: taint-frontend-html-injection
        document.write(this.responseText);
    };
    a.addEventListener("load", ajax_callback2);
    // todook: taint-frontend-html-injection
    document.write(this.responseText);
    a.open("GET", "http://www.example.org/example.txt");
    a.send();

}

function bad_ajax3() {
	let a = fetch("http://www.example.org/example.txt")
		.then(resp => resp.text())
	// ruleid: taint-frontend-html-injection
		.then(j => document.write(j))
}

function bad_fetch() {
    let a = fetch("https://example.org/example.txt")
            .then(resp => resp.body)
            .then(body => body.getReader())
            .then(reader => {
                console.log('Hello world')
                return reader.read()
            })
    // ruleid: taint-frontend-html-injection
            .then(data => document.write(data))
    document.write(data)
}
