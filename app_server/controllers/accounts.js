'use strict';

var request = require('request');
var moment = require('moment');

var Helper = require('./helper-functions.js');
var Main = require('./main.js');

var apiOptions = {
  server: 'http://dreamriverdigital.com'
};

// GET login page
var renderLoginView = function (req, res, body) {
  var message;
  if (body) {
    message = body.message;
  }

  res
    .clearCookie('user')
    .render('login', {
      title: 'Wasatch: Login',
      message: message,
      error: req.query.err
    });
};

module.exports.loginPage = function (req, res, next) {
  renderLoginView(req, res);
};

/* POST sign in */
module.exports.signIn = function (req, res, next) {
  var path = '/wasatch/api/login';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: req.body,
    qs: {}
  };

  request(requestOptions, function (err, apiResponse, body) {
    var cookieOptions = {
      maxAge: 1000 * 3600 * 24 * 7
    };
    if (apiResponse && apiResponse.statusCode === 200) {

      //Ran into Express bugs trying to set multiple separate cookies, so I'm combining them into one JSON object:
      var cookieObject = {
        token: apiResponse.body.access_token,
        username: apiResponse.body.username,
        isAdmin: false
      };
      if (apiResponse.body.roles[0] === 'ROLE_ADMIN') {
        cookieObject.isAdmin = true;
      }

      res.cookie('user', JSON.stringify(cookieObject), cookieOptions);
      res.redirect('/');
    } else if (apiResponse && apiResponse.statusCode === 401) {
      renderLoginView(req, res, {
        message: 'Invalid username or password. Please try again.'
      });
    } else {
      console.log(err);
      Main._showError(req, res, apiResponse, err);
    }
  });

};

/* GET add-clinician form */
module.exports.addClinicianPage = function (req, res, next) {
  processCookies(req);

  res.render('add-clinician', {
    title: 'Wasatch: Add Clinician',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

/* POST add new clinician */
module.exports.createClinician = function (req, res, next) {
  Main.processCookies(req);

  //convert the phone number string to the 10-digit format sent to database
  req.body.phoneNumber = Helper.phoneUglify(req.body.phoneNumber);

  var path = '/wasatch/clinician/create';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: req.body,
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {
      res.redirect('/add-clinician/');
    } else {
      Main._showError(req, res, apiResponse, err, body);
    }
  });

};