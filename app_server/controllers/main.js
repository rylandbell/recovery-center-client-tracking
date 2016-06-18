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

var prettifyClientData = function (client) {
  if (client.dateOfBirth) {
    client.dateOfBirth = helper.datePrettify(client.dateOfBirth);
  }

  if (client.phoneNumber) {
    client.phoneNumber = helper.phonePrettify(client.phoneNumber);
  }

  return client;
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
    title: 'Wasatch: Client Details',
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
    if (apiResponse.statusCode === 200) {
      prettifyClientData(body);
      renderDetailsView(req, res, body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

/* GET client notes */
var renderNotesView = function (req, res, body) {
  res.render('client-notes', {
    title: 'Wasatch: Client Notes',
    client: body,
    error: req.query.err
  });
};

module.exports.clientNotes = function (req, res, next) {
  var path = '/wasatch/api/client/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse.statusCode === 200) {
      prettifyClientData(body);
      renderNotesView(req, res, body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

/* GET client check-in history */
var renderCheckInHistoryView = function (req, res, body) {
  res.render('check-in-history', {
    title: 'Wasatch: Check-In History',
    client: body,
    error: req.query.err
  });
};

module.exports.checkinHistory = function (req, res, next) {
  var path = '/wasatch/api/client/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse.statusCode === 200) {
      prettifyClientData(body);
      renderCheckInHistoryView(req, res, body);
    } else {
      _showError(req, res, apiResponse);
    }
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
