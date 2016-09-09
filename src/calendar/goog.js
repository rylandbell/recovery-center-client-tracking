//handles all communication with Google API, including authorization and calendars:

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '4139562567-omh3t9ktrc2hmsf9j34tb0k9h2m41pi6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Ask server if app is authorized to modify calendar
module.exports.checkAuth = function (immediate, callback) {
  var _this = this;
  gapi.auth.authorize(
    {
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      immediate: immediate,
    }, function (token) {
      _this.handleAuthResult.apply(_this, [token, callback]);
    });
};

// Handle response from authorization server
// The callback function should be a hub for the app to handle the result, with a Boolean 'authorized' parameter
module.exports.handleAuthResult = function (authResult, callback) {
  if (authResult && !authResult.error) {
    this.loadCalendarApi(callback.bind(this, true));
  } else {
    callback(false);
  }
};

//Load Google Calendar client library.
module.exports.loadCalendarApi = function (callback) {
  gapi.client.load('calendar', 'v3', callback);
};

//Load calendar events (currently gets ALL of user's events):
module.exports.getEventsList = function (calendarId, timeMin, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.list({
    calendarId: calendarId,
    maxResults: 500,
    timeMin: timeMin
  });
  request.execute(function (e) {
    if (e) {
      successCallback(e);
    } else {
      failureCallback(e);
    }
  });
};

module.exports.getRecurringInstances = function (eventObject, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.instances(eventObject);
  request.execute(function (e) {
    if (e) {
      successCallback(e);
    } else {
      failureCallback(e);
    }
  });
};

module.exports.getCalendarObject = function (calendarId, successCallback, failureCallback) {
  var request = gapi.client.calendar.calendars.get({
    calendarId: calendarId
  });
  request.execute(function (calendar) {
    if (calendar) {
      successCallback(calendar);
    } else {
      failureCallback();
    }
  });
};

module.exports.getCalendarList = function (successCallback, failureCallback) {
  var request = gapi.client.calendar.calendarList.list({});
  request.execute(function (calendarList) {
    if (calendarList) {
      successCallback(calendarList);
    } else {
      failureCallback();
    }
  });
};

module.exports.getTimezone = function (successCallback, failureCallback) {
  var request = gapi.client.calendar.settings.get({
    setting: 'timezone'
  });
  request.execute(function (response) {
    if (response) {
      successCallback(response);
    } else {
      failureCallback();
    }
  });
};

//Add event to calendar
module.exports.addEvent = function (calendarId, localEvent, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.insert({
    calendarId: calendarId,
    resource: localEvent,
  });
  request.execute(function (e) {
    if (e && e.status === 'confirmed') {
      successCallback(e, localEvent);
    } else {
      failureCallback(e);
    }
  });
};

//Update existing event
module.exports.updateEvent = function (calendarId, event, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.update({
    calendarId: calendarId,
    eventId: event[0].googleId,
    summary: event[0].summary,
    start: event[0].start,
    end: event[0].end,
    transparency: 'transparent'
  });
  request.execute(function (e) {
    if (e && e.status === 'confirmed') {
      successCallback();
    } else {
      failureCallback();
    }
  });
};

//Delete an event
module.exports.deleteEvent = function (calendarId, googleId, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.delete({
    calendarId: calendarId,
    eventId: googleId,
  });
  request.execute(function (e) {
    if (e && !e.error) {
      successCallback();
    } else {
      failureCallback(e);
    }
  });
};

