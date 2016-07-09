var request = require('request');
var helper = require('./helper-functions.js');

var apiOptions = {
  server: 'http://dreamriverdigital.com'
};

// NOT SECURE, but redirects users that don't have a cookie.
// (doesn't test for valid token, which I'm leaving for pages with secure calls to the API.)
var processCookies = function (req, res) {
  if (req.cookies && typeof req.cookies.user === 'string') {
    req.cookies = JSON.parse(req.cookies.user);
  } else {
    res.redirect('/login');
  }

  return req;
};

// generate error page in browser:
var _showError = function (req, res, apiResponse, err, body) {

  var title;
  var content;
  var message;

  if (apiResponse) {
    switch (apiResponse.statusCode){
      case 401:
        if (req.cookies && req.cookies.user) {

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
  processCookies(req, res);

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
  processCookies(req, res);

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
  processCookies(req, res);

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
  processCookies(req, res);

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

/* GET add-client form */
module.exports.addClientPage = function (req, res, next) {
  processCookies(req, res);

  res.render('add-client', {
    title: 'Wasatch: Add Client',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* GET add-clinician form */
module.exports.addClinicianPage = function (req, res, next) {
  processCookies(req, res);

  res.render('add-clinician', {
    title: 'Wasatch: Add Clinician',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* GET clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  processCookies(req, res);

  res.render('clinician-settings', {
    title: 'Wasatch: My Settings',
    username: req.cookies.username,
    error: req.query.err
  });
};

/* GET calendar page */
module.exports.calendar = function (req, res, next) {
  req = processCookies(req, res);

  res.render('calendar', {
    title: 'Wasatch: Calendar',
    username: req.cookies.username,
    pageTestScript: '/qa/tests-calendar.js',
    error: req.query.err
  });
};

/* POST add new client */
module.exports.createClient = function (req, res, next) {
  processCookies(req, res);

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

/* POST add new contact for an existing client */
var shapeContactData = function (clientId, formData) {
  var payload = {};
  payload.client = {};
  payload.client.id = clientId;
  payload.client.contacts = [formData];
  return payload;
};

module.exports.createContact = function (req, res, next) {
  processCookies(req, res);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = helper.phoneUglify(req.body.phoneNumber);

  var path = '/wasatch/clientContact/addContact';
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',

    //convert contact data into format needed by API:
    json: shapeContactData(req.params.clientId, req.body),
    headers: {
      Authorization: 'Bearer ' + req.cookies.token
    },
    qs: {}
  };

  request(requestOptions, function (err, apiResponse, body) {
    if (apiResponse && apiResponse.statusCode === 200) {

      //send the user back to the same client's details page:
      res.redirect('/client-details/' + req.params.clientId);
    } else {
      _showError(req, res, apiResponse, err, body);
    }
  });
};

// POST edit existing contact (PUT on back-end)
module.exports.editContact = function (req, res, next) {
  processCookies(req, res);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = helper.phoneUglify(req.body.phoneNumber);

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

      //send the user back to the same client's details page
      res.redirect('/client-details/' + req.params.clientId);
    } else {
      _showError(req, res, apiResponse, err, body);
    }
  });
};

/* POST add new clinician */
module.exports.createClinician = function (req, res, next) {
  processCookies(req, res);

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
      res.redirect('/add-clinician/');
    } else {
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
      maxAge: 1000 * 3600 * 24 * 7
    };
    if (apiResponse && apiResponse.statusCode === 200) {

      //Ran into Express bugs trying to set two separate cookies, so I'm combining them into one JSON object:
      var cookieObject = {
        token: apiResponse.body.access_token,
        username: apiResponse.body.username
      };
      res.cookie('user', JSON.stringify(cookieObject), cookieOptions);
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
