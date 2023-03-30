
function test(count) {
	// ruleid: buffer-memory-exposure
	let a = new Buffer(count);
	return a;
}

function test2(count) {
	
	// ok: buffer-memory-exposure
	let a = new Buffer(count);
	a.fill(12);

	return a;
}

function test3(count) {
	// ruleid: buffer-memory-exposure
	let a = Buffer.allocUnsafe(count);
	return a;
}

function test4(count) {
	
	// ok: buffer-memory-exposure
	let a = Buffer.allocUnsafe(count);
	a.fill(12);

	return a;
}


function test5() {
	// ruleid: buffer-memory-exposure
	let a = new Buffer(100);
	return a;
}

function test6(arr: any[]) {
	// ok: buffer-memory-exposure
	let a = new Buffer(arr);
	return a;
}

function test7(input: any) {
	// ruleid: buffer-memory-exposure
	let a = new Buffer(input);
	return a;
}

function test8(input) {
	if(typeof input === 'number') {
		input = [input]
	}

	// ok: buffer-memory-exposure
	let b = new Buffer(input);
	return b;
}

function test9(input: any) {

	if(input instanceof String) {
		// ok: buffer-memory-exposure
		let a = new Buffer(input);
		return a;
	}
}
