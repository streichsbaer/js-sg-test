const Joi = require("joi");
// AWS Lambda specific
// This of course will miss many cases, for example, it's not mandatory to name your handler function "handler"
exports.handler = async (event) => {
  const { untrustedFunc, provisionViaLambdaDto, provisionViaLambdaDto: { untrustedCode } } = event;
  
  // ok:taint-backend-eval
  eval('alert')

  // ruleid:taint-backend-eval
  eval(event['provisionViaLambdaDto'])

  // ruleid:taint-backend-eval
  eval(provisionViaLambdaDto);

  // ruleid:taint-backend-eval
  var resp1 = eval("(" + event?.propertyThatMayExist + ")");

  // ruleid:taint-backend-eval
  var resp2 = eval(`return ${provisionViaLambdaDto.untrustedCode}`);

  // todoruleid:taint-backend-eval
  var resp2 = eval(`return ${untrustedCode}`);

  // ruleid:taint-backend-eval
  var x = new Function('a', 'b', `return ${event['untrustedFunc']}(a,b)`)

  // ruleid:taint-backend-eval
  var x = new Function('a', 'b', `return ${untrustedFunc}(a,b)`)

  // ruleid:taint-backend-eval
  var y = Function('a', 'b', event['propertyThatMayExist'])
  
  // ruleid:taint-backend-eval
  eval(event.provisionViaLambdaDto.items);
  // todoruleid:taint-backend-eval
  eval(untrustedCode);
  
}

// ExpressJS specific
app.get('/', function (req, res) {
  // ruleid:taint-backend-eval
  const untrustedResp = eval('(' + req.query.untrustedCode + ')');
  // ruleid:taint-backend-eval
  var untrustedFunc = new Function('arg1', 'arg2', req.query.untrustedFuncBody);
  untrustedFunc(1, 2);
  // ruleid:taint-backend-eval
  setTimeout('alert(' + req.body.untrustedCode, 0);
  // ok: taint-backend-eval
  setTimeout('alert(123)', req.body.untrustedNumber)
  // ruleid:taint-backend-eval
  setInterval(req.body.untrustedCode, 0);
  // ok: taint-backend-eval
  setInterval('alert(123)', req.body.untrustedNumber)
  res.send('Response</br>');
});
app.listen(8000);
// ok:taint-backend-eval
eval("outside_express" + req.foo)
// ok:taint-backend-eval
setTimeout('alert(' + req.body.untrustedCode, 0);
// ok:taint-backend-eval
setInterval(req.body.untrustedCode, 0);
// ok:taint-backend-eval
new Function('arg1', 'arg2', req.query.untrustedFuncBody)

// ExpressJS specific
function patMyCat(req, res) {
  // ruleid:taint-backend-eval
  eval(req.query.untrusted);
  // ruleid:taint-backend-eval
  eval(req.query);
  // ruleid:taint-backend-eval
  var resp1 = eval("(" + req.query.untrustedQueryParam + ")");
  // ruleid:taint-backend-eval
  var resp2 = eval(`return ${req.body.untrusted}`);
  // For those that forget to use the 'new' keyword?
  // ruleid:taint-backend-eval
  var untrustedFunc = Function('arg1', 'arg2', req.query.untrustedQueryParam)
  // ok: taint-backend-eval
  var untrustedFunc = Function('arg1', req.query.untrustedQueryParam, 'return arg1 + arg2')
  untrustedFunc(1, 2);
  // ruleid:taint-backend-eval
  setTimeout('alert(' + req.body.untrustedCode, 0);
  // ruleid:taint-backend-eval
  setInterval(req.body.untrustedFunc, 0);
  // ruleid:taint-backend-eval
  var preTax = eval(req.body.preTax);

   
  const tax_schema = Joi.object().keys({
    preTax: Joi.number().precision(2),
  });
  Joi.validate({ preTax: req.body.preTax }, tax_schema, function(error, val) {
    if (error == null) {
      // ok:taint-backend-eval
      var preTax = eval(req.body.preTax);
      //do stuff
    } else {
      //catch validation error
    }
  });

  res.send('Response</br>');
}
