var request = require('request');
var moment = require('moment');
var helper = require('./helper-functions.js');

var apiOptions = {
  server: 'http://dreamriverdigital.com'
};

// converts cookie from JSON string to JS object, or to empty object if no cookie data found
var processCookies = function (req, res) {
  if (req.cookies && typeof req.cookies.user === 'string') {
    req.cookies = JSON.parse(req.cookies.user);
  } else {
    req.cookies = {};
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
    client.dateOfBirth = moment(client.dateOfBirth).format('MMMM DD, YYYY');
  }

  if (client.startDate) {
    client.startDate = moment(client.startDate).format('MMMM DD, YYYY');
  }

  if (client.phoneNumber) {
    client.phoneNumber = helper.phonePrettify(client.phoneNumber);
  }

  if (client.contacts) {
    client.contacts.forEach(function (contact) {
      if (contact.phoneNumber) {
        contact.phoneNumber = helper.phonePrettify(contact.phoneNumber);
      }
    });
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
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

module.exports.clientList = function (req, res, next) {
  processCookies(req);

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
      _showError(req, res, apiResponse, err);
    }
  });
};

/* GET client details page */
var renderDetailsView = function (req, res, body) {
  res.render('client-details', {
    title: 'Wasatch: Client Details',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    client: body,
    error: req.query.err
  });
};

module.exports.clientDetails = function (req, res, next) {
  processCookies(req);

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
    isAdmin: req.cookies.isAdmin,
    client: body,
    error: req.query.err
  });
};

module.exports.clientNotes = function (req, res, next) {
  processCookies(req);

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
    isAdmin: req.cookies.isAdmin,
    client: body,
    error: req.query.err
  });
};

module.exports.checkinHistory = function (req, res, next) {
  processCookies(req);

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
  processCookies(req);

  res.render('add-client', {
    title: 'Wasatch: Add Client',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
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

/* GET clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  processCookies(req);

  res.render('clinician-settings', {
    title: 'Wasatch: My Settings',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

/* GET calendar page */
module.exports.calendar = function (req, res, next) {
  req = processCookies(req);

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
  req = processCookies(req);

  res.render('messaging', {
    title: 'Wasatch: Messaging',
    username: req.cookies.username,
    isAdmin: req.cookies.isAdmin,
    error: req.query.err
  });
};

/* POST add new client */
module.exports.createClient = function (req, res, next) {
  processCookies(req);

  //convert numbers and dates to the format sent to database
  req.body.phoneNumber = helper.phoneUglify(req.body.phoneNumber);
  req.body.startDate = moment(req.body.startDate).toISOString().split('.')[0] + 'Z';
  if (req.body.dateOfBirth) {
    req.body.dateOfBirth = moment(req.body.dateOfBirth).toISOString().split('.')[0] + 'Z';
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
  processCookies(req);

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

      //send the user back to the same client's contact list:
      res.redirect('/client-details/' + req.params.clientId + '?contacts');
    } else {
      _showError(req, res, apiResponse, err, body);
    }
  });
};

// POST edit existing contact (POST from browser, PUT to API)
module.exports.editContact = function (req, res, next) {
  processCookies(req);

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

      //send the user back to the same client's contact list
      res.redirect('/client-details/' + req.params.clientId + '?contacts');
    } else {
      _showError(req, res, apiResponse, err, body);
    }
  });
};

/* POST add new clinician */
module.exports.createClinician = function (req, res, next) {
  processCookies(req);

  //convert the phone number string to the 10-digit format sent to database
  req.body.phoneNumber = helper.phoneUglify(req.body.phoneNumber);

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
      _showError(req, res, apiResponse, err);
    }
  });

};
