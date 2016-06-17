var fakeClient = JSON.parse('{"class":"com.wasatch.model.Client","id":1,"accountExpired":false,"accountLocked":false,"address":null,"dateOfBirth":"0016-07-31T07:00:00Z","email":"typorterjones@gmail.com","enabled":true,"firstName":"Imaginary","gender":"NonConforming","lastName":"Client","password":"$2a$10$Fd0UQPk7KQ15cVTLmhFfbeUgiv/PW.3rN84WxJ9DrGkVtwGKi8dsO","passwordExpired":false,"phoneNumber":"801-555-5555","preferredName":"Tami","username":"tami"}');

var request = require('request');

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

/* GET client details page */
var renderDetailsView = function (req, res, body) {
  res.render('client-details', {
    title: 'Details View',
    client: body,
    error: req.query.err
  });
};

module.exports.clientDetails = function (req, res, next) {
  console.log('HIIIIIIII');
  var path = '/wasatch/api/client/' + req.params.clientId;
  var requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {}
  };
  request(requestOptions, function (err, apiResponse, body) {

    // get YYYY-MM-DD formatted dates from ISO format:
    console.log('MESSAGE: ' + apiResponse.body.message);
    if (apiResponse.statusCode === 200) {
      if (body.dateOfBirth) {
        body.dateOfBirth = body.dateOfBirth.substring(0, 10);
      }

      if (body.dateDue) {
        body.dateDue = body.dateDue.substring(0, 10);
      }

      renderDetailsView(req, res, body);
    } else {
      _showError(req, res, apiResponse);
    }
  });
};

/* GET list of clients */
module.exports.clientList = function (req, res, next) {
  res.render('client-list', { title: 'Wasatch: List of Clients' });
};

/* GET new client form */
module.exports.addClient = function (req, res, next) {
  res.render('add-client', { title: 'Wasatch: Add Client' });
};

/* GET client check-in history */
module.exports.checkinHistory = function (req, res, next) {
  res.render('check-in-history', {
    title: 'Wasatch: Check-in History',
    client: fakeClient
  });
};

/* GET update clinician's settings */
module.exports.clinicianSettings = function (req, res, next) {
  res.render('clinician-settings', { title: 'Wasatch: My Settings' });
};

/* GET client info home */
module.exports.clientNotes = function (req, res, next) {
  res.render('client-notes', {
    title: 'Wasatch: Client Notes',
    client: fakeClient
  });
};

/* GET calendar page */
module.exports.calendar = function (req, res, next) {
  res.render('calendar', { title: 'Wasatch: Calendar' });
};
