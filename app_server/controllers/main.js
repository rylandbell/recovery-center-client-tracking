'use strict';

var request = require('request');
var moment = require('moment');

var Helper = require('./helper-functions.js');

var apiOptions = {
  server: 'http://dreamriverdigital.com'
};

/* GET list of clients */
var renderClientList = function (req, res, responseBody) {
  responseBody.forEach(function (client) {
    if (client.startDate) {
      client.startDate = client.startDate.substring(0, 10);
    }
  });

  var message;

  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (responseBody.length === 0) {
      message = 'No clients found.';
    }
  }

  res.render('client-list', {
    title: 'Wasatch: List of Clients',
    clients: responseBody,
    message: message,
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

module.exports.clientList = function (req, res, next) {
  Helper.processCookies(req);

  var path = '/wasatch/client/get';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {
      renderClientList(req, res, body);
    } else {
      Helper.showError(req, res, apiResponse, err);
    }
  });
};

/* GET client details page */
var renderDetailsView = function (req, res, body) {
  
  //sort funding objects in chronological order (ie, by ID)
  if(body.funding) {
    body.funding.sort(function(a,b){
      return a.id - b.id;
    });
  }

  res.render('client-details', {
    title: 'Wasatch: Client Details',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    client: body,
    error: req.query.err,
    moment: moment
  });
};

module.exports.clientDetails = function (req, res, next) {
  Helper.processCookies(req);

  var path = '/wasatch/client/get/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {
      Helper.prettifyClientData(body);
      renderDetailsView(req, res, body);
    } else {
      Helper.showError(req, res, apiResponse, err);
    }
  });
};

/* GET client notes */
var renderNotesView = function (req, res, body) {
  res.render('client-notes', {
    title: 'Wasatch: Client Notes',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    client: body,
    error: req.query.err
  });
};

module.exports.clientNotes = function (req, res, next) {
  Helper.processCookies(req);

  var path = '/wasatch/client/get/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {
      Helper.prettifyClientData(body);
      renderNotesView(req, res, body);
    } else {
      Helper.showError(req, res, apiResponse, err);
    }
  });
};

/* GET client check-in history */
var renderCheckInHistoryView = function (req, res, body) {
  res.render('check-in-history', {
    title: 'Wasatch: Check-In History',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    client: body,
    error: req.query.err
  });
};

module.exports.checkinHistory = function (req, res, next) {
  Helper.processCookies(req);

  var path = '/wasatch/client/get/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {
      Helper.prettifyClientData(body);
      renderCheckInHistoryView(req, res, body);
    } else {
      Helper.showError(req, res, apiResponse, err);
    }
  });
};

/* GET add-client form */
module.exports.addClientPage = function (req, res, next) {
  Helper.processCookies(req);

  res.render('add-client', {
    title: 'Wasatch: Add Client',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

/* GET clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  Helper.processCookies(req);

  res.render('clinician-settings', {
    title: 'Wasatch: My Settings',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

/* GET calendar page */
module.exports.calendar = function (req, res, next) {
  req = Helper.processCookies(req);

  res.render('calendar', {
    title: 'Wasatch: Calendar',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    pageTestScript: '/qa/tests-calendar.js',
    error: req.query.err
  });
};

/* GET calendar page */
module.exports.messaging = function (req, res, next) {
  req = Helper.processCookies(req);

  res.render('messaging', {
    title: 'Wasatch: Messaging',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

/* POST add new client */
module.exports.createClient = function (req, res, next) {
  Helper.processCookies(req);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = Helper.phoneUglify(req.body.phoneNumber);
  req.body.startDate = Helper.formatDate(req.body.startDate);
  if (req.body.dateOfBirth) {
    req.body.dateOfBirth = Helper.formatDate(req.body.dateOfBirth);
  }

  var path = '/wasatch/client/save';
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
    if (apiResponse && apiResponse.statusCode === 201) {

      //send the user to the newly created client's details page
      var newClientId = body.id;
      res.redirect('/client-details/' + newClientId);
    } else {
      Helper.showError(req, res, apiResponse, err, body);
    }
  });
};

/* POST add new contact for an existing client */
module.exports.createContact = function (req, res, next) {
  Helper.processCookies(req);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = Helper.phoneUglify(req.body.phoneNumber);

  var path = '/wasatch/clientContact/addContact';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',

    //convert contact data into format needed by API:
    json: Helper.shapeContactData(req.params.clientId, req.body),
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    qs: {}
  };

  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {

      //send the user back to the same client's contact list:
      res.redirect('/client-details/' + req.params.clientId + '?contacts');
    } else {
      Helper.showError(req, res, apiResponse, err, body);
    }
  });
};

// POST edit existing contact (POST from browser, PUT to API)
module.exports.editContact = function (req, res, next) {
  Helper.processCookies(req);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = Helper.phoneUglify(req.body.phoneNumber);

  var path = '/wasatch/clientContact/update';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'PUT',
    json: req.body,
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    qs: {}
  };

  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {

      //send the user back to the same client's contact list
      res.redirect('/client-details/' + req.params.clientId + '?contacts');
    } else {
      Helper.showError(req, res, apiResponse, err, body);
    }
  });
};

// POST edit client's basic info (POST from browser, PUT to API)
module.exports.editBasicInfo = function (req, res, next) {
  Helper.processCookies(req);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = Helper.phoneUglify(req.body.phoneNumber);
  req.body.dateOfBirth = Helper.formatDate(req.body.dateOfBirth);

  var path = '/wasatch/client/updateBasicInfo';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'PUT',
    json: Object.assign({}, req.body, { id: req.params.clientId }),
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    qs: {}
  };

  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {

      //send the user back to the same client's contact list
      res.redirect('/client-details/' + req.params.clientId + '?basic-info');
    } else {
      Helper.showError(req, res, apiResponse, err, body);
    }
  });
};

// POST edit client's funding info (POST from browser, PUT to API)
module.exports.editFunding = function (req, res, next) {
  Helper.processCookies(req);

  var path = '/wasatch/client/addFunding/?id=' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'PUT',
    json: {
      fundingType: {name: req.body.fundingType},
      insuranceProvider: req.body.insuranceProvider || "none provided",
      insuranceId: req.body.insuranceId || "none provided"
    },
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    }
    // qs: {id:req.params.clientId}
  };

  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {

      //send the user back to the same client's contact list
      res.redirect('/client-details/' + req.params.clientId + '?funding');
    } else {
      console.log('ERROR RECEIVED FROM API', apiResponse.toJSON())
      Helper.showError(req, res, apiResponse, err, body);
    }
  });
};
