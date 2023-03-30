// DOM specific patterns

// ok:eval-dom-frontend
eval('alert')

// ok:eval-dom-frontend
window.eval('alert')

// ruleid:eval-dom-frontend
window.eval(`alert('${location.href}')`)

const href = location.href;

const maliciousFuncBody1 = new URLSearchParams(window.location.search).get('searchParam')
// ruleid:eval-dom-frontend
const weaponisedFunc1 = new Function(`return ${maliciousFuncBody1}(a,b)`)

const maliciousFuncBody2 = new URLSearchParams(window.location.hash.substring(1)).get('searchParam')
// ruleid:eval-dom-frontend
const weaponisedFunc2 = new Function(`return ${maliciousFuncBody2}(a,b)`)

// Cover the cases for URLSearchParams:
//   entries()
//   forEach()
//   getAll()
//   keys()
//   values()
const searchParams1 = new URLSearchParams(window.location.search);
const mappedEntries1 = [...searchParams1.entries()].map(([key, value]) => ({ k: key, v: value }));
// entries flags, so the rest should also be fine.

// ruleid:eval-dom-frontend
const weaponisedFunc3 = new Function(`return ${mappedEntries1[0].value}(a,b)`)

// ruleid:eval-dom-frontend
setTimeout('alert(' + weaponisedFunc3, 0);
// ruleid:eval-dom-frontend
setInterval(location.hash, 0);

function printGenerator(value) {
	return () => console.log(value);
}

// todook: eval-dom-frontend
setInterval(printGenerator(location.search), 0);

// End - DOM specific patterns

// User input specific patterns

// Get value from HTML form and any other elements:
// getElementById /////////////////////////////////
const untrustedInput0 = document.getElementById("myInput").value;
// ruleid:eval-dom-frontend
eval(untrustedInput0);

const myInput0 = document.getElementById("myInput");
const untrustedInput1 = myInput0.value;
// ruleid:eval-dom-frontend
eval(untrustedInput1);

// querySelector /////////////////////////////////
const myInputElement0 = document.querySelector("#myInput")
// ruleid:eval-dom-frontend
eval(myInputElement0.value);
let untrustedInput2 = document.querySelector("#myInput").value;
// ruleid:eval-dom-frontend
eval(untrustedInput2);

// getElementsByTagName /////////////////////////////////
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
const cells0 = table.getElementsByTagName('td');
// ruleid:eval-dom-frontend
eval(cells0[0].value);
// Todo: Are there other ways to get the value?
// ruleid:eval-dom-frontend
eval(table.getElementsByTagName('td')[1].value);

const item0 = cells0.item[1];
// ruleid:eval-dom-frontend
eval(item0.value);
// ruleid:eval-dom-frontend
eval(cells0.item[1].value);
// ruleid:eval-dom-frontend
eval(table.getElementsByTagName('td').item[1].value);

// ruleid:eval-dom-frontend
eval(cells0.myForm.value);
const myForm0 = cells0.myForm;
// ruleid:eval-dom-frontend
eval(myForm0.value);
// ruleid:eval-dom-frontend
eval(table.getElementsByTagName('td').myForm.value);

// ruleid:eval-dom-frontend
eval(cells0.namedItem("myForm").value);
const myForm1 = cells0.namedItem("myForm");
// ruleid:eval-dom-frontend
eval(myForm1.value);
// ruleid:eval-dom-frontend
eval(table.getElementsByTagName('td').namedItem("myForm").value);

const myForm2 = table.getElementsByTagName('td')["named.item.with.periods"];
// ruleid:eval-dom-frontend
eval(myForm2.value);
// ruleid:eval-dom-frontend
eval(table.getElementsByTagName('td')["named.item.with.periods"].value);

// getElementsByClassName ///////////////////////////////////
// https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
const cells1 = table.getElementsByClassName("my-class");
// ruleid:eval-dom-frontend
eval(cellfs1[0].value); // ..............
// Todo: Are there other ways to get the value?
// ruleid:eval-dom-frontend
eval(table.getElementsByClassName("my-class")[1].value);

const item1 = cells1.item[1];
// ruleid:eval-dom-frontend
eval(item1.value);
// ruleid:eval-dom-frontend
eval(cells1.item[1].value);
// ruleid:eval-dom-frontend
eval(table.getElementsByClassName("my-class").item[1].value);

// ruleid:eval-dom-frontend
eval(cells1.myForm.value);
const myForm3 = cells1.myForm;
// ruleid:eval-dom-frontend
eval(myForm3.value);
// ruleid:eval-dom-frontend
eval(table.getElementsByClassName("my-class").myForm.value);

// ruleid:eval-dom-frontend
eval(cells1.namedItem("myForm").value);
const myForm4 = cells1.namedItem("myForm");
// ruleid:eval-dom-frontend
eval(myForm4.value);
// ruleid:eval-dom-frontend
eval(table.getElementsByClassName("my-class").namedItem("myForm").value);

const myForm5 = table.getElementsByClassName("my-class")["named.item.with.periods"];
// ruleid:eval-dom-frontend
eval(myForm5.value);
// ruleid:eval-dom-frontend
eval(table.getElementsByClassName("my-class")["named.item.with.periods"].value);

// Get value by prompting user to enter it:
const promptVal = `Please enter some ${malicious} text:`;
const promptResponse0 = prompt(promptVal);
// ruleid:eval-dom-frontend
eval(promptResponse0);

// End - User input specific patterns
