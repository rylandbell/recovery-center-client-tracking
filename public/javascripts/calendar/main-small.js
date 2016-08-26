(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports.authCheckDisplay = function (authorized) {
  $('.auth-waiting').hide();
  if (authorized) {
    $('.auth-view').hide();
    $('.cal-view').show();
  } else {
    $('.auth-view').show();
    $('.cal-view').hide();
  }
};

module.exports.showCalName = function (calendarObject) {
  $('#cal-name').text('Active calendar: ' + calendarObject.id);
};

module.exports.showEventPopover = function (event, jsEvent) {
  var popoverHtml;
  if (event.googleId.length < 28) {
    popoverHtml = '<p>Clicking on the Details button will take you to this event\'s page on Google Calendar.</p>' +
        '<p><button class="btn btn-danger delete-event" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>' +
        '&nbsp;<a href="' + event.htmlLink + '" target="_blank">' + '<button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Details</button></a></p>';
  } else {
    popoverHtml = '<p>This app can\'t (yet) reliably edit recurring events. Clicking on the Details button will take you to this event\'s page on Google Calendar.</p>' +
      '<p>&nbsp;<a href="' + event.htmlLink + '" target="_blank">' + '<button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Details</button></a></p>';
  }

  $(jsEvent.currentTarget)
    .popover({
      html: true,
      content: popoverHtml,
      placement: 'bottom',
      trigger: 'manual',
      container: '.fc-scroller'
    })
    .popover('toggle');

};

module.exports.clearPopovers = function () {
  $('.popover').remove();
};

module.exports.showMessage = function (message, fade) {
  $('#message-box')
    .show()
    .text(message)
    .delay(3000);
  if (fade) {
    $('#message-box').fadeOut(1000);
  }
};

module.exports.showError = function (message) {
  $('#error-message').text(message);
  $('.cal-view').show();
  $('#error-container').show();
  $('#message-box').hide();
  $('#calendar')
    .find('*')
    .not('#error-container')
    .off()
    .fadeTo(1000, 0.9);
  $('.sidebar')
    .find('*')
    .hide();
};

module.exports.showLoadingMessage = function (loading) {
  if (loading) {
    $('.cal-loading').show();
  } else {
    $('.cal-loading').hide();
  }
};

module.exports.showAuthWaitingMessage = function (loading) {
  if (loading) {
    $('.auth-waiting').show();
  } else {
    $('.auth-waiting').hide();
  }
};

},{}],2:[function(require,module,exports){
//Draw a calendar with fullcalendar.js:
module.exports.draw = function (customOptions, callbacks, colors) {
  // Default options object:
  var defaultOptions = {
    defaultView: 'agendaWeek',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    views: {
      fourDay: {
        type: 'agenda',
        duration: { days: 4 },
        buttonText: '4-day'
      }
    },
    minTime: '07:00',
    maxTime: '21:00',
    timezone: 'local',
    weekends: true,
    scrollTime: '08:00',
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    droppable: true,
    eventBackgroundColor: colors.bgDefault,
    eventBorderColor: colors.border,
    eventTextColor: colors.text,
    eventOverlap: false,
    allDayDefault: false,
    defaultAllDayEventDuration: { days: 1 },
    nowIndicator: true
  };

  //add customOptions and callbacks, like the events array and user-specific settings:
  var options = Object.assign({}, defaultOptions, customOptions, callbacks);

  $('#calendar').fullCalendar(options);
};

module.exports.deleteEvent = function (id) {
  $('#calendar').fullCalendar('removeEvents', id);
};

module.exports.addGoogleEventData = function (localEventId, googEvent) {
  $('#calendar').fullCalendar('clientEvents', localEventId)[0].googleId = googEvent.id;
  $('#calendar').fullCalendar('clientEvents', localEventId)[0].htmlLink = googEvent.htmlLink;
};

module.exports.destroy = function () {
  $('#calendar').fullCalendar('destroy');
};

module.exports.refreshEvents = function (eventSource) {
  $('#calendar').fullCalendar('removeEvents');
  $('#calendar').fullCalendar('addEventSource', eventSource);
};

},{}],3:[function(require,module,exports){
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
module.exports.getEventsList = function (timeMin, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.list({
    calendarId: 'primary',
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

module.exports.getCalendarObject = function (successCallback, failureCallback) {
  var request = gapi.client.calendar.calendars.get({
    calendarId: 'primary'
  });
  request.execute(function (calendar) {
    if (calendar) {
      successCallback(calendar);
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
module.exports.addEvent = function (localEvent, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.insert({
    calendarId: 'primary',
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
module.exports.updateEvent = function (event, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.update({
    calendarId: 'primary',
    eventId: event[0].googleId,
    summary: event[0].summary,
    start: event[0].start,
    end: event[0].end
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
module.exports.deleteEvent = function (googleId, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.delete({
    calendarId: 'primary',
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



},{}],4:[function(require,module,exports){
//---------Collects helper functions - only pure, no side effects, don't need access to global variables

//Transform a fullcalendar event object to a Google calendar event object
module.exports.translateFcToGoog = function (fullCalEvent, userTimezone) {
  var preppedEvent = {
    summary: fullCalEvent.title,
    start: {
      dateTime: fullCalEvent.start._d.toISOString(),
      timeZone: userTimezone
    },
    end: {
      dateTime: fullCalEvent.end._d.toISOString(),
      timeZone: userTimezone
    },
    recurrence: fullCalEvent.recurrence
  };
  if (fullCalEvent.googleId) {
    preppedEvent.googleId = fullCalEvent.googleId;
  }

  return [preppedEvent, fullCalEvent._id];
};

module.exports.translateGoogToFc = function (event) {
  var transformedEvent = {};
  transformedEvent.googleId = event.id;
  transformedEvent.htmlLink = event.htmlLink;
  transformedEvent.title = event.summary;

  //handle regular (not full-day) events
  if (event.end.dateTime && event.start.dateTime) {
    transformedEvent.start = event.start.dateTime;
    transformedEvent.end = event.end.dateTime;

  //handle full-day events
  } else if (event.end.date && event.start.date) {
    transformedEvent.start = event.start.date;
    transformedEvent.end = event.end.date;
    transformedEvent.allDay = true;
  }

  if (event.recurringEventId) {
    transformedEvent.editable = false;
    transformedEvent.recurring = true;
  }

  return transformedEvent;
};

//return an ISO string for x days from now, used to create timeMin/timeMax for pulling calendar data from Google
module.exports.nDaysFromToday = function (days) {
  var today = new Date();
  today.setDate(today.getDate() + days);
  return today.toISOString();
};


},{}],5:[function(require,module,exports){
// Main app - contains:
// -functions that tie together functionality found in multiple other modules
// -event handlers and associated callbacks
// -global variables
// -helper functions that require access to global variables

var goog = require('./goog.js');
var helper = require('./helper.js');
var fullCal = require('./fullcal-interface.js');
var dom = require('./dom-interface.js');

$(document).ready(function () {
  //global variables:
  var colors = {
    bgDefault: 'lightgrey',
    border: 'black',
    text: 'black',
    bgHighlight: ['#62c66c', '#7c95ee']
  };
  var presetEventTitles = ['Available for client appointments'];
  var userTimezone = '';
  var fcCallbacks = {
    //kill all popovers when click on calendar background:
    dayClick: function (event, jsEvent) {
      dom.clearPopovers();
    }
  };
  var smallCalCustomOptions = {
    defaultView: 'basicDay',
    header: false,
    height: 350
  }

  // --------Authorization handling------------

  //use domReady instead of window.load because RequireJS loads scripts aynchronously, which may or may not complete before window.load is called
  $(window).load(function () {
    if (typeof gapi !== 'undefined') {
      goog.checkAuth(true, manageAuthResult);
    } else {
      dom.showError('Unable to connect to Google authorization server.');
    }
  });

  // initiates authorization process at user request
  $('#begin-auth').on('click', function () {
    dom.showAuthWaitingMessage(true);
    goog.checkAuth(false, manageAuthResult);
  });

  function manageAuthResult(authorizedStatus) {
    dom.authCheckDisplay(authorizedStatus);
    dom.showMessage('Authorization successful. Waiting for calendar events to load...', false);
    if (authorizedStatus) {

      //load fullCalendar, without events:
      fullCal.draw(smallCalCustomOptions, fcCallbacks, colors);

      //add events to calendar:
      getAndDisplayEvents();
    }
  }

  // -------Calendar drawing------------------

  //passes a list of event instances (including recurring events) to the updateCalendarDisplay function
  function getAndDisplayEvents() {
    goog.getEventsList(helper.nDaysFromToday(-60),
      function (list) {
        catchRecurringEvents(list.items, updateCalendarDisplay.bind(this, {}));
      },

      dom.showError.bind(this, 'Unable to download calendar data from Google.')
    );
  }

  function updateCalendarDisplay(customOptions, eventSourceObject) {
    fullCal.refreshEvents(translateEventsList(eventSourceObject));
    dom.showMessage('');
  }

  //takes a list of GCal events, and adds all instances for each recurring event
  //remainingEventsCount variable is used to wait for all of the calls to goog.getRecurringInstances to return
  function catchRecurringEvents(eventList, callback) {
    var remainingEventsCount = eventList.length;
    var requestObject = {
      timeMin: helper.nDaysFromToday(-60),
      timeMax: helper.nDaysFromToday(180),
      calendarId: 'primary'
    };
    var fullInstanceList = [];
    eventList.forEach(function (event) {
      if (event.recurrence) {
        requestObject.eventId = event.id;
        goog.getRecurringInstances(requestObject, function (instances) {
          instances.items.forEach(function (instance) {
            instance.editable = false;
            fullInstanceList.push(instance);
          });

          remainingEventsCount -= 1;
          if (remainingEventsCount < 1) {
            callback(fullInstanceList);
          }
        });
      } else {
        fullInstanceList.push(event);
        remainingEventsCount -= 1;
        if (remainingEventsCount < 1) {
          callback(fullInstanceList);
        }
      }
    });
  }

  // convert event list from Google's format to the format used by fullCalendar
  function translateEventsList(list) {
    var transformedEvent;
    var googleEvents = list;
    var fcEventSource = {
      events: []
    };

    googleEvents.forEach(function (event) {
      if (event.status !== 'cancelled') {
        transformedEvent = helper.translateGoogToFc(event);
        transformedEvent = paintSpecialEvents(transformedEvent);
        fcEventSource.events.push(transformedEvent);
      }
    });

    return fcEventSource;
  }

  // add color/custom options for events created by this app, including before current session
  function paintSpecialEvents(event) {

    //Catch events with event titles in presetEventTitles array:
    presetEventTitles.forEach(function (presetTitle, j) {
      if (event.title === presetTitle) {
        event.backgroundColor = colors.bgHighlight[j % colors.bgHighlight.length];
      }
    });

    //Catch YCBM-generated appointments:
    if (event.title && event.title.substring(0, 7) === 'booked:') {
      event.backgroundColor = colors.bgHighlight[1];
    }

    //Give recurring events a dashed border:
    //(This code slightly changes the background color for recurring events, so that the CSS can search by color and apply a dashed border.
    //It's a hacky solution, but FullCalendar doesn't allow things like custom classes for its elements.)
    if (event.recurring) {

      //Catch recurring appointment slots:
      if (event.title === presetEventTitles[0]) {
        event.backgroundColor = 'rgb(98, 198, 109)';

      //Catch all other recurring appointments:
      } else {
        event.backgroundColor = 'rgb(210,211,211)';
      }
    }

    return event;
  }

});

},{"./dom-interface.js":1,"./fullcal-interface.js":2,"./goog.js":3,"./helper.js":4}]},{},[5]);
