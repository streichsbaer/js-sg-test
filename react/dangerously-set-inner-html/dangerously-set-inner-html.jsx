import DOMPurify from "dompurify"
import sanitize from "xss"

function TestComponent1() {
    // ok:dangerously-set-inner-html
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}

function TestComponent2(foo) {
    // ruleid:dangerously-set-inner-html
    let params = {smth: 'test123', dangerouslySetInnerHTML: {__html: foo},a:b};
    return React.createElement('div', params);
}

function TestComponent3() {
    // ok:dangerously-set-inner-html
  return <li className={"foobar"} dangerouslySetInnerHTML={{__html: params}} />;
}


function OkComponent1({myUserInput, ...rest}) {
    // ok:dangerously-set-inner-html
  return <li className={"foobar"} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(input)}} />;
}

function OkComponent2() {
    // ok:dangerously-set-inner-html
  return <li className={"foobar"} dangerouslySetInnerHTML={DOMPurify.sanitize(createMarkup())} />;
}

function OkComponent3() {
    // ok:dangerously-set-inner-html
    let params = {smth: 'test123', dangerouslySetInnerHTML: {__html: sanitize(foo)},a:b};
    return React.createElement('div', params);
}

function OkComponent4() {
    // ok:dangerously-set-inner-html
    let params = {smth: 'test123', dangerouslySetInnerHTML: {__html: "hi"},a:b};
    return React.createElement('div', params);
}

function OkComponent5() {
    // ok:dangerously-set-inner-html
  return <li class="foobar" selected={true} />;
}

function OkComponent6() {
    // ok:dangerously-set-inner-html
    let params = {smth: "test123", style: {color: 'red'}};
    return React.createElement('div', params);
}

