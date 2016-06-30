var request = require('request');
var helper = require('./helper-functions.js');

var apiOptions = {
  server: 'http://dreamriverdigital.com'
};

// generate error page in browser:
var _showError = function (req, res, apiResponse, err, body) {
  var title;
  var content;
  var message;

  //don't think this does anything anymore (?)
  // if (apiResponse && apiResponse.body) {
  //   message = apiResponse.body.text;
  // }

  if (apiResponse) {
    switch (apiResponse.statusCode){
      case 401:
        if (req.cookie && req.cookie.token) {

          //For logged-in user attempting to access unauthorized endpoints
          title = '401, Authorization Error';
          content = 'You are not authorized to access that page.';
        } else {

          //If user isn't logged in at all, load login page instead of error page
          res.redirect('/login');
        }

        break;
      case 404:
        title = '404, content not found';
        content = 'Sorry, we can\'t find your page. Maybe try again?';
        break;
      case 422:
        title = '422 Error';
        content = body.text;
        break;
      default:
        title = apiResponse.statusCode + ' error';
        if (apiResponse.body) {
          content = 'Something\'s gone wrong with this request: \n\n' + apiResponse.body.errors[0].message;
        } else {
          content = 'Something\'s gone wrong with this request.';
        }
    }
  } else {
    if (err.code === 'ECONNREFUSED') {
      title = '503, Service Unavailable';
      content = 'Could not connect to the server. Please try again later.';
    } else {
      title = '500, Internal Service Error';
      content = 'Something\'s gone wrong with this request. Try again later.';
    }
  }

  res.render('generic-text', {
    message: message,
    title: title,
    content: content
  });
};

var prettifyClientData = function (client) {
  if (client.dateOfBirth) {
    client.dateOfBirth = helper.datePrettify(client.dateOfBirth);
  }

  if (client.startDate) {
    client.startDate = helper.datePrettify(client.startDate);
  }

  if (client.phoneNumber) {
    client.phoneNumber = helper.phonePrettify(client.phoneNumber);
  }

  return client;
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
    error: req.query.err
  });
};

module.exports.clientList = function (req, res, next) {
  var path = '/wasatch/clinician/getAllClients';
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
      _showError(req, res, apiResponse, err);
    }
  });
};

/* GET client details page */
var renderDetailsView = function (req, res, body) {
  res.render('client-details', {
    title: 'Wasatch: Client Details',
    username: req.cookies.username,
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
    if (apiResponse && apiResponse.statusCode === 200) {
      prettifyClientData(body);
      renderDetailsView(req, res, body);
    } else {
      _showError(req, res, apiResponse, err);
    }
  });
};

/* GET client notes */
var renderNotesView = function (req, res, body) {
  res.render('client-notes', {
    title: 'Wasatch: Client Notes',
    username: req.cookies.username,
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
    if (apiResponse && apiResponse.statusCode === 200) {
      prettifyClientData(body);
      renderNotesView(req, res, body);
    } else {
      _showError(req, res, apiResponse, err);
    }
  });
};

/* GET client check-in history */
var renderCheckInHistoryView = function (req, res, body) {
  res.render('check-in-history', {
    title: 'Wasatch: Check-In History',
    username: req.cookies.username,
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
    if (apiResponse && apiResponse.statusCode === 200) {
      prettifyClientData(body);
      renderCheckInHistoryView(req, res, body);
    } else {
      _showError(req, res, apiResponse, err);
    }
  });
};

// GET login page
var renderLoginView = function (req, res, body) {
  var message;
  if (body) {
    message = body.message;
  }

  res
    .clearCookie('token')
    .clearCookie('username')
    .render('login', {
      title: 'Wasatch: Login',
      message: message,
      error: req.query.err
    });
};

module.exports.loginPage = function (req, res, next) {
  renderLoginView(req, res);
};

/* GET add-client form */
module.exports.addClientPage = function (req, res, next) {
  res.render('add-client', {
    title: 'Wasatch: Add Client',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* GET add-clinician form */
module.exports.addClinicianPage = function (req, res, next) {
  res.render('add-clinician', {
    title: 'Wasatch: Add Clinician',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* GET update clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  res.render('clinician-settings', {
    title: 'Wasatch: My Settings',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* GET calendar page */
module.exports.calendar = function (req, res, next) {
  res.render('calendar', {
    title: 'Wasatch: Calendar',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* POST add new client */
module.exports.createClient = function (req, res, next) {
  console.log(req.body);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = helper.phoneUglify(req.body.phoneNumber);
  req.body.startDate = helper.dateUglify(req.body.startDate);
  req.body.dateOfBirth = helper.dateUglify(req.body.dateOfBirth);

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
    if (apiResponse && apiResponse.statusCode === 200) {

      //send the user to the newly created client's details page
      var newClientId = body.id;
      res.redirect('/client-details/' + newClientId);
    } else {
      _showError(req, res, apiResponse, err, body);
    }
  });
};

/* POST add new clinician */
module.exports.createClinician = function (req, res, next) {

  //convert the phone number string to the 10-digit format sent to database
  req.body.phoneNumber = helper.phoneUglify(req.body.phoneNumber);

  var path = '/wasatch/clinician/create';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: req.body,
    headers: {
      Authorization: req.cookies.token
    },
    qs: {}
  };

  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {
      console.log(apiResponse.body);
      res.redirect('/add-clinician/');
    } else {
      console.log(apiResponse.body);
      _showError(req, res, apiResponse, err);
    }
  });

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
      maxAge: 1000 * 3600 * 24 * 7,

      // secure: true,
      // httpOnly: true,

      //Not using signed cookies until/unless I can find a better way to access & store username
      // signed: false
    };
    if (apiResponse && apiResponse.statusCode === 200) {
      res.cookie('token', apiResponse.body.access_token, cookieOptions);
      res.cookie('username', req.body.username, cookieOptions);
      res.redirect('/');
    } else if (apiResponse && apiResponse.statusCode === 401) {
      renderLoginView(req, res, {
        message: 'Invalid username or password. Please try again.'
      });
    } else {
      console.log(err);
      _showError(req, res, apiResponse, err);
    }
  });

};
