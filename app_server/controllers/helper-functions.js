'use strict';

const moment = require('moment');

//convert a 10-digit string into a phone number like '(800)123-4567'
var phonePrettify = function (phoneString) {
  if (phoneString.length !== 10) {
    return phoneString;
  }

  var pieces = [
    '(',
    phoneString.substring(0, 3),
    ') ',
    phoneString.substring(3, 6),
    '-',
    phoneString.substring(6, 10)
  ];
  var pretty = pieces.join('');
  return pretty;
};

//convert (DDD) DDD-DDDD to a 10-digit string
module.exports.phoneUglify = function (phone) {
  var digits = [
    phone.slice(1, 4),
    phone.slice(6, 9),
    phone.slice(10, 14)
  ];
  var ugly = digits.join('');
  return ugly;
};

module.exports.formatDate = function (dateString) {

  //return ISO 8601 date string, without a colon in the timezone offset
  return moment(dateString).format().slice(0, -3) + '00';
};

module.exports.prettifyClientData = function (client) {
  if (client.dateOfBirth) {
    client.dateOfBirth = moment(client.dateOfBirth).format('MMMM DD, YYYY');
  }

  if (client.startDate) {
    client.startDate = moment(client.startDate).format('MMMM DD, YYYY');
  }

  if (client.phoneNumber) {
    client.phoneNumber = phonePrettify(client.phoneNumber);
  }

  if (client.contacts) {
    client.contacts.forEach(function (contact) {
      if (contact.phoneNumber) {
        contact.phoneNumber = phonePrettify(contact.phoneNumber);
      }
    });
  }

  return client;
};

module.exports.shapeContactData = function (clientId, formData) {
  var payload = {};
  payload.client = {};
  payload.client.id = clientId;
  payload.client.contacts = [formData];
  return payload;
};

// converts cookie from JSON string to JS object, or to empty object if no cookie data found
module.exports.processCookies = function (req, res) {
  if (req.cookies && typeof req.cookies.user === 'string') {
    req.cookies = JSON.parse(req.cookies.user);
  } else {
    req.cookies = {};
  }

  return req;
};

// generate error page in browser:
module.exports.showError = function (req, res, apiResponse, err, body) {
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
        if (apiResponse.body && apiResponse.body.errors) {
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
