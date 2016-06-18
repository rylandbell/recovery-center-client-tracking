var fakeClient = JSON.parse('{"class":"com.wasatch.model.Client","id":1,"accountExpired":false,"accountLocked":false,"address":null,"dateOfBirth":"0016-07-31T07:00:00Z","email":"typorterjones@gmail.com","enabled":true,"firstName":"Eddard","gender":"NonConforming","lastName":"Stark","password":"$2a$10$Fd0UQPk7KQ15cVTLmhFfbeUgiv/PW.3rN84WxJ9DrGkVtwGKi8dsO","passwordExpired":false,"phoneNumber":"1236548899","preferredName":"Tami","username":"tami"}');

var request = require('request');
var helper = require('./helper-functions.js');

var apiOptions = {
  server: 'http://dreamriverdigital.com'
};

// generate error page in browser:
var _showError = function (req, res, apiResponse) {
  var title;
  var content;
  if (apiResponse.statusCode === 404) {
    title = '404, content not found';
    content = 'Sorry, we can\'t find your page. Maybe try again?';
  } else if (apiResponse.statusCode === 401) {
    title = '401, Authorization Error';
    content = 'You are not authorized to access that page.';
  } else {
    title = apiResponse.statusCode + ' error';
    content = 'Something\'s gone wrong with this request. I wonder what it could be...';
  }

  res.render('generic-text', {
    message: apiResponse.body.message,
    title: title,
    content: content
  });
};

/* GET list of clients */
var renderClientList = function (req, res, responseBody) {
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
    error: req.query.err,
  });
};

module.exports.clientList = function (req, res, next) {
  var path = '/wasatch/api/client';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (body.message) {
      console.log('message= ' + body.message);
    }

    //renderListView has its own error handling, so I call it regardless:
    renderClientList(req, res, body);
  });

  // res.render('client-list', { title: 'Wasatch: List of Clients' });
};

/* GET client details page */
var renderDetailsView = function (req, res, body) {
  res.render('client-details', {
    title: 'Details View',
    client: body,
    error: req.query.err
  });
};

module.exports.clientDetails = function (req, res, next) {
  var path = '/wasatch/api/client/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {

    // get YYYY-MM-DD formatted dates from ISO format:
    if (apiResponse.statusCode === 200) {
      if (body.dateOfBirth) {
        body.dateOfBirth = helper.datePrettify(body.dateOfBirth);
      }

      if (body.phoneNumber) {
        body.phoneNumber = helper.phonePrettify(body.phoneNumber);
      }

      renderDetailsView(req, res, body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

/* GET client notes */
module.exports.clientNotes = function (req, res, next) {
  res.render('client-notes', {
    title: 'Wasatch: Client Notes',
    client: fakeClient
  });
};

/* GET client check-in history */
module.exports.checkinHistory = function (req, res, next) {
  res.render('check-in-history', {
    title: 'Wasatch: Check-in History',
    client: fakeClient
  });
};

/* GET add-client form */
module.exports.addClientPage = function (req, res, next) {
  res.render('add-client', { title: 'Wasatch: Add Client' });
};

/* GET update clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  res.render('clinician-settings', { title: 'Wasatch: My Settings' });
};

/* GET calendar page */
module.exports.calendar = function (req, res, next) {
  res.render('calendar', { title: 'Wasatch: Calendar' });
};

/* POST add new client */
module.exports.createClient = function (req, res, next) {

  // apiRequestBody = req.body.name;
  var path = '/wasatch/api/client/';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: req.body,
    qs: {}
  };
  if (!req.body.username) {
    res.redirect('/?err=validation');
  } else {
    request(requestOptions, function (err, apiResponse, body) {
      if (apiResponse.statusCode === 400) {
        res.redirect('/?err=validation');
      } else if (apiResponse.statusCode === 200 || apiResponse.statusCode === 201) {

        //use this to reload page with new task added:
        var newClientId = body.id;
        console.log(newClientId);
        res.redirect('/client-details/' + newClientId);
      } else {
        _showError(req, res, apiResponse);
      }
    });
  }
};
