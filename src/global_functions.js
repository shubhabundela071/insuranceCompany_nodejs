
pe = require('parse-error'); //parses error so you can read error message and handle them accordingly

Message = function (resKey) { // Success Web Response
  let resp, responseM;
  resp = require('./helper/message.json');
  responseM = resp[resKey];
  return responseM;
};

to = function (promise) { //global function that will help use handle promise rejections, this article talks about it http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
  return promise
    .then(data => {
      return [null, data];
    }).catch(err => [pe(err)]);
};

// Response handlers
successResponse = function (res, code, data, message) {
  return res.status(code || 200).json({
    success: true,
    data,
    code,
    message
  })
}

okResponse = function (res, data, message) {
  return successResponse(res, 200, data, message);
}

okPhoneResponse = function (res, data, message) {
  return successResponse(res, 437, data, message);
}


createdResponse = function (res, data, message) {
  return successResponse(res, 201, data, message);
}

noContentResponse = function (res, message) {
  return successResponse(res, 204, {}, message);
}
notFoundError = function (res,message) {
  return successResponse(res,404,{},message);
}

forbiddenError = function (res,msg) {
  return successResponse(res,403,{},msg);
}

errorResponse = function (res, data, message) {
  res.statusCode = 422;
  return res.json({
    success: false,
    code:422,
    data,
    message
  })
}

// Code 422 - bad req
badRequestError = function (res, data, message) {
  res.statusCode = 422;
  return res.json({
    success: false,
    code: 422,
    data: data,
    message: message
  })
}
unverifiedError = function (res, message) {
  res.statusCode = 412;
  return res.json({
    success: false,
    code: 412,
    message: message
  })
}

// Error handler for unverified Email with dedicated response code.
// Code 432 - Unverified Email
unverifiedEmailError = function (res, data, message) {
  res.statusCode = 432;
  return res.json({
    success: false,
    code: 432,
    data,
    message: message
  })
}



ReE = function (res, err, code) { // Error Web Response
  console.log(err);
  // console.log(res);
  console.log(code);
  if (typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message;
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json({
    success: false,
    message: err,
    code: code
  });
}