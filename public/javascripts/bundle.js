(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
    popoverHtml = '<p>Clicking on the Details button will take you to this event\'s page on Google Calendar.</p>' + '<p><button class="btn btn-danger delete-event" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>' + '&nbsp;<a href="' + event.htmlLink + '" target="_blank">' + '<button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Details</button></a></p>';
  } else {
    popoverHtml = '<p>This app can\'t (yet) reliably edit recurring events. Clicking on the Details button will take you to this event\'s page on Google Calendar.</p>' + '<p>&nbsp;<a href="' + event.htmlLink + '" target="_blank">' + '<button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Details</button></a></p>';
  }

  $(jsEvent.currentTarget).popover({
    html: true,
    content: popoverHtml,
    placement: 'bottom',
    trigger: 'manual',
    container: '.fc-scroller'
  }).popover('toggle');
};

module.exports.clearPopovers = function () {
  $('.popover').remove();
};

module.exports.showMessage = function (message, fade) {
  $('#message-box').show().text(message).delay(3000);
  if (fade) {
    $('#message-box').fadeOut(1000);
  }
};

module.exports.showError = function (message) {
  $('#error-message').text(message);
  $('.cal-view').show();
  $('#error-container').show();
  $('#message-box').hide();
  $('#calendar').find('*').not('#error-container').off().fadeTo(1000, 0.9);
  $('.sidebar').find('*').hide();
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
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//Draw a calendar with fullcalendar.js:
module.exports.draw = function (targetDivId, customOptions, callbacks, colors) {

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
  var options = _extends({}, defaultOptions, customOptions, callbacks);

  $('#' + targetDivId).fullCalendar(options);
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

module.exports.refreshEvents = function (targetDivId, eventSource) {
  $('#' + targetDivId).fullCalendar('removeEvents');
  $('#' + targetDivId).fullCalendar('addEventSource', eventSource);
};

},{}],3:[function(require,module,exports){
'use strict';

//handles all communication with Google API, including authorization and calendars:

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '4139562567-omh3t9ktrc2hmsf9j34tb0k9h2m41pi6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Ask server if app is authorized to modify calendar
module.exports.checkAuth = function (immediate, callback) {
  var _this = this;
  gapi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    immediate: immediate
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
    resource: localEvent
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
module.exports.deleteEvent = function (googleId, successCallback, failureCallback) {
  var request = gapi.client.calendar.events.delete({
    calendarId: 'primary',
    eventId: googleId
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
'use strict';

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
    recurrence: fullCalEvent.recurrence,
    transparency: 'transparent'
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
'use strict';

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
  var fcCallbacks = {

    //kill all popovers when click on calendar background:
    dayClick: function dayClick(event, jsEvent) {
      dom.clearPopovers();
    }
  };
  var smallCalCustomOptions = {
    defaultView: 'basicDay',
    header: false,
    height: 300
  };

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
      fullCal.draw('cal-small', smallCalCustomOptions, fcCallbacks, colors);

      //add events to calendar:
      getAndDisplayEvents();
    }
  }

  // -------Calendar drawing------------------

  //passes a list of event instances (including recurring events) to the updateCalendarDisplay function
  function getAndDisplayEvents() {
    goog.getEventsList(helper.nDaysFromToday(-60), function (list) {
      catchRecurringEvents(list.items, updateCalendarDisplay.bind(this, {}));
    }, dom.showError.bind(this, 'Unable to download calendar data from Google.'));
  }

  function updateCalendarDisplay(customOptions, eventSourceObject) {
    fullCal.refreshEvents('cal-small', translateEventsList(eventSourceObject));
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

},{"./dom-interface.js":1,"./fullcal-interface.js":2,"./goog.js":3,"./helper.js":4}],6:[function(require,module,exports){
'use strict';

// Main app - contains:
// -functions that tie together functionality found in multiple other modules
// -event handlers and associated callbacks
// -global variables
// -Helper functions that require access to global variables

var Goog = require('./goog.js');
var Helper = require('./helper.js');
var FullCal = require('./fullcal-interface.js');
var Dom = require('./dom-interface.js');
var UiComponents = require('./ui-components.js');

$(document).ready(function () {

  //global variables:
  var colors = {
    bgDefault: 'lightgrey',
    border: 'black',
    text: 'black',
    bgHighlight: ['#62c66c', '#7c95ee']
  };
  var presetEventTitles = ['Available for client bookings'];
  var userTimezone = '';
  var fcCallbacks = {
    eventReceive: function eventReceive(event) {
      Dom.showMessage('Sending updates to Google...', false);
      Goog.addEvent(Helper.translateFcToGoog(event, userTimezone)[0], successfulAdd.bind(this, event._id), Dom.showError.bind(this, 'Failed to add new event.'));
    },

    eventDrop: function eventDrop(event) {
      handleEventChange(event);
    },

    eventResize: function eventResize(event) {
      handleEventChange(event);
    },

    eventClick: function eventClick(event, jsEvent) {
      Dom.clearPopovers();
      Dom.showEventPopover(event, jsEvent);
    },

    //kill all popovers when click on calendar background:
    dayClick: function dayClick(event, jsEvent) {
      Dom.clearPopovers();
    }
  };

  // --------Authorization handling------------

  //use domReady instead of window.load because RequireJS loads scripts aynchronously, which may or may not complete before window.load is called
  $(window).load(function () {
    if (typeof gapi !== 'undefined') {
      Goog.checkAuth(true, manageAuthResult);
    } else {
      Dom.showError('Unable to connect to Google authorization server.');
    }
  });

  // initiates authorization process at user request
  $('#begin-auth').on('click', function () {
    Dom.showAuthWaitingMessage(true);
    Goog.checkAuth(false, manageAuthResult);
  });

  function manageAuthResult(authorizedStatus) {
    Dom.authCheckDisplay(authorizedStatus);
    Dom.showMessage('Authorization successful. Waiting for calendar events to load...', false);
    if (authorizedStatus) {

      //load FullCalendar, without events:
      FullCal.draw('calendar', {}, fcCallbacks, colors);

      //add events to calendar:
      getAndDisplayEvents();

      //set correct timezone for adding events:
      Goog.getTimezone(function (response) {
        userTimezone = response.value;
      });

      //display correct calendar name in sidebar:
      Goog.getCalendarObject(Dom.showCalName, Dom.showError.bind(this, 'Unable to load calendar name.'));
    }
  }

  // -------Calendar drawing------------------

  //passes a list of event instances (including recurring events) to the updateCalendarDisplay function
  function getAndDisplayEvents() {
    Goog.getEventsList(Helper.nDaysFromToday(-60), function (list) {
      catchRecurringEvents(list.items, updateCalendarDisplay.bind(this, {}));
    }, Dom.showError.bind(this, 'Unable to download calendar data from Google.'));
  }

  function updateCalendarDisplay(customOptions, eventSourceObject) {
    FullCal.refreshEvents('calendar', translateEventsList(eventSourceObject));
    Dom.showMessage('');
  }

  //takes a list of GCal events, and adds all instances for each recurring event
  //remainingEventsCount variable is used to wait for all of the calls to Goog.getRecurringInstances to return
  function catchRecurringEvents(eventList, callback) {
    var remainingEventsCount = eventList.length;
    var requestObject = {
      timeMin: Helper.nDaysFromToday(-60),
      timeMax: Helper.nDaysFromToday(180),
      calendarId: 'primary'
    };
    var fullInstanceList = [];
    eventList.forEach(function (event) {
      if (event.recurrence) {
        requestObject.eventId = event.id;
        Goog.getRecurringInstances(requestObject, function (instances) {
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

  // convert event list from Google's format to the format used by FullCalendar
  function translateEventsList(list) {
    var transformedEvent;
    var googleEvents = list;
    var fcEventSource = {
      events: []
    };

    googleEvents.forEach(function (event) {
      if (event.status !== 'cancelled') {
        transformedEvent = Helper.translateGoogToFc(event);
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

  //------------Adding events-------------------

  // create draggable elements for availability-slot events (currently only one element in this array)
  for (var i = 0; i < presetEventTitles.length; i++) {
    new UiComponents.Draggable('#draggable-events', {
      title: presetEventTitles[i],
      backgroundColor: colors.bgHighlight[i % colors.bgHighlight.length]
    });
  }

  // creates a draggable element for the first event, set to repeat weekly forever
  new UiComponents.Draggable('#draggable-events-recurring', {
    title: presetEventTitles[0],

    // hacky solution to set border type inside FullCalendar, without altering vendor code
    // (sets slightly different color for style selector in CSS to catch)
    backgroundColor: 'rgb(98, 198, 109)',
    recurrence: ['RRULE:FREQ=WEEKLY']
  });

  //callback for Goog.addEvent:
  function successfulAdd(localEventId, googEvent) {

    //need to tag new local event with Google's ID and URL for the event:
    FullCal.addGoogleEventData(localEventId, googEvent);
    Dom.showMessage('Event successfully added to your Google calendar.', true);

    if (googEvent.recurrence) {
      getAndDisplayEvents();
    }
  }

  //---------------Edit or delete events---------------
  function handleEventChange(event) {
    if (event.googleId) {
      Dom.showMessage('Sending updates to Google...', false);
      Goog.updateEvent(Helper.translateFcToGoog(event, userTimezone), Dom.showMessage.bind(this, 'Event time successfully updated.', true), Dom.showError.bind(this, 'Failed to update event time.'));
    } else {
      Dom.showError('Failed to update event time: no Google Event ID found');
    }
  }

  $('#calendar').on('click', '.delete-event', function (e) {
    var $target = $(e.target);
    var googleId = $target.attr('data-googleId');
    var localId = $target.attr('data-id');
    FullCal.deleteEvent(localId);
    Goog.deleteEvent(googleId, Dom.showMessage.bind(this, 'Event successfully deleted.', true), Dom.showError.bind(this, 'Failed to delete event.'));
    Dom.showMessage('Sending updates to Google...', false);
    Dom.clearPopovers();
  });

  //-----------Apply settings changes to calendar view-----------
  $('#cal-settings').on('submit', function (e) {
    e.preventDefault();
    var userInput = $(this).serializeArray();
    var customOptions = {};
    userInput.forEach(function (field) {
      if (field.value === 'true') {
        field.value = true;
      }

      if (field.value === 'false') {
        field.value = false;
      }

      customOptions[field.name] = field.value;
    });

    //destroy and reload calendar with new settings
    FullCal.destroy();
    updateCalendarDisplay(customOptions);
  });
});

},{"./dom-interface.js":1,"./fullcal-interface.js":2,"./goog.js":3,"./helper.js":4,"./ui-components.js":7}],7:[function(require,module,exports){
'use strict';

//Creates a draggable DOM element with encoded event information
module.exports.Draggable = function (parent, fcEvent) {
  var $parent = $(parent);

  if (typeof fcEvent === 'undefined') {
    fcEvent = {
      title: 'No event title found.',
      backgroundColor: 'lightgrey'
    };
  }

  // add default values for fcEvent:
  if (!fcEvent.duration) {
    fcEvent.duration = '01:00';
  }

  if (!fcEvent.hasOwnProperty('editable')) {
    fcEvent.editable = true;
  }

  var $textArea = $('<div>').addClass('draggable-text').text(fcEvent.title + ' ');

  //create the new draggable DOM element:
  this.$el = $('<div>').addClass('draggable').append($textArea).css('background-color', fcEvent.backgroundColor);

  if (fcEvent.recurrence) {
    $('<div><span class="glyphicon glyphicon-refresh">&nbsp;</span></div>').addClass('draggable-icon').prependTo(this.$el);
  }

  // add draggability via jQuery UI, event data via fullCalendar
  this.$el.draggable({
    revert: true,
    revertDuration: 0,
    helper: 'clone',
    opacity: 0.5,
    cursor: 'pointer',
    cursorAt: { top: 33, left: 70 }
  }).data('duration', fcEvent.duration).data('event', fcEvent);

  $parent.append(this.$el);

  return this;
};

},{}],8:[function(require,module,exports){
'use strict';

var React = require('react');

var ConversationHeading = require('./conversation-heading.jsx');
var MessageLog = require('./message-log.jsx');
var NewMessageInput = require('./new-message-input.jsx');

//owns message array state, assembles subcomponents: 
module.exports = function (_ref) {
  var reduxState = _ref.reduxState;
  var handleSubmit = _ref.handleSubmit;
  var handleTextChange = _ref.handleTextChange;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  var listenForEnter = _ref.listenForEnter;
  return React.createElement(
    'div',
    { className: 'panel panel-primary' },
    React.createElement(
      'div',
      { className: 'panel-heading' },
      React.createElement(ConversationHeading, { correspondent: reduxState.conversation.correspondent })
    ),
    React.createElement(
      'div',
      { className: 'panel-body conversation-panel' },
      React.createElement(MessageLog, { messages: reduxState.conversation.messages }),
      React.createElement('div', { className: 'clearfix' })
    ),
    React.createElement(
      'div',
      { className: 'panel-footer' },
      React.createElement(NewMessageInput, {
        enteredText: reduxState.enteredText,
        enterToSendStatus: reduxState.enterToSendStatus,
        handleSubmit: handleSubmit,
        handleTextChange: handleTextChange,
        handleCheckboxChange: handleCheckboxChange,
        listenForEnter: listenForEnter
      })
    )
  );
};

},{"./conversation-heading.jsx":9,"./message-log.jsx":12,"./new-message-input.jsx":14,"react":"react"}],9:[function(require,module,exports){
'use strict';

var React = require('react');

//simply displays name of correspondent
module.exports = function (_ref) {
  var correspondent = _ref.correspondent;
  return React.createElement(
    'div',
    { className: 'panel-title' },
    correspondent.firstName + ' ' + correspondent.lastName
  );
};

},{"react":"react"}],10:[function(require,module,exports){
"use strict";

var React = require('react');

//Simply the checkbox; state and event handling managed by parent: NewMessageInput
module.exports = function (_ref) {
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  return React.createElement(
    "div",
    { className: "small pull-right" },
    React.createElement(
      "div",
      { className: "checkbox" },
      React.createElement(
        "label",
        null,
        React.createElement("input", { name: "isEmergencyContact", type: "checkbox", checked: enterToSendStatus, onChange: handleCheckboxChange }),
        " Press enter to send"
      )
    )
  );
};

},{"react":"react"}],11:[function(require,module,exports){
'use strict';

var React = require('react');

var Helper = require('../helper.jsx');

//handles paragraph breaks in message text
module.exports = function (_ref) {
    var content = _ref.content;
    return React.createElement(
        'div',
        { className: 'message-content pull-right' },
        Helper.formatMessage(content)
    );
};

},{"../helper.jsx":16,"react":"react"}],12:[function(require,module,exports){
'use strict';

var React = require('react');

var Helper = require('../helper.jsx');
var MessageRow = require('./message-row.jsx');

//creates array of MessageRows
module.exports = React.createClass({
  displayName: 'exports',

  componentDidUpdate: Helper.scrollToBottom,
  componentDidMount: Helper.scrollToBottom,
  render: function render() {
    var _this = this;

    return React.createElement(
      'div',
      { className: 'messages-display', ref: function ref(c) {
          return _this.log = c;
        } },
      this.props.messages.map(function (message, index) {
        return React.createElement(MessageRow, { message: message, key: index });
      })
    );
  }
});

},{"../helper.jsx":16,"./message-row.jsx":13,"react":"react"}],13:[function(require,module,exports){
'use strict';

var React = require('react');

var MessageContentBox = require('./message-content-box.jsx');

//assembles message display from date,  author, content
module.exports = function (_ref) {
  var message = _ref.message;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'message ' + (message.author === 'Me' ? 'from-user' : 'to-user') },
      React.createElement(
        'div',
        { className: 'message-header' },
        React.createElement(
          'div',
          { className: 'message-author' },
          message.author
        ),
        React.createElement('div', { className: 'clearfix' })
      ),
      React.createElement(MessageContentBox, { content: message.content }),
      React.createElement('div', { className: 'clearfix' }),
      React.createElement(
        'div',
        { className: 'message-time small' },
        moment(message.msgTime).format('MMMM DD, YYYY. h:mm A')
      )
    ),
    React.createElement('div', { className: 'clearfix' })
  );
};

},{"./message-content-box.jsx":11,"react":"react"}],14:[function(require,module,exports){
'use strict';

var React = require('react');

var EnterToSend = require('./enter-to-send.jsx');

//owns new message, enterToSend states; handles all form events
module.exports = function (_ref) {
  var handleSubmit = _ref.handleSubmit;
  var enteredText = _ref.enteredText;
  var handleTextChange = _ref.handleTextChange;
  var listenForEnter = _ref.listenForEnter;
  var enterToSendStatus = _ref.enterToSendStatus;
  var handleCheckboxChange = _ref.handleCheckboxChange;
  return React.createElement(
    'form',
    { className: 'new-message-form', onSubmit: handleSubmit },
    React.createElement('textarea', { placeholder: 'Your Message', className: 'form-control', rows: '6', value: enteredText, onChange: handleTextChange, onKeyPress: listenForEnter }),
    React.createElement('input', { className: 'btn btn-primary', type: 'submit', value: 'Send' }),
    React.createElement(EnterToSend, { enterToSendStatus: enterToSendStatus, handleCheckboxChange: handleCheckboxChange }),
    React.createElement('div', { className: 'clearfix' })
  );
};

},{"./enter-to-send.jsx":10,"react":"react"}],15:[function(require,module,exports){
'use strict';

module.exports = {
  correspondent: {
    lastName: 'Madison',
    firstName: 'James'
  },
  messages: [{
    author: 'Me',
    msgTime: '2016-05-16T17:45:40.276Z',
    content: ' One day in a research meeting, in the spring of 1985, he and another postdoc, Leonard Martin, heard a presentation on the topic. Lots of studies found that if you asked someone to smile, she’d say she felt more happy or amused, and her body would react in kind. It appeared to be a small but reliable effect.',
    seen: true,
    flagged: false
  }, {
    author: 'George',
    msgTime: '2016-06-16T17:45:40.276Z',
    content: 'He told a group of students that he wanted to record the activity of their facial muscles under various conditions, and then he hooked silver cup electrodes to the corners of their mouths, the edges of their jaws, and the space between their eyebrows. The wires from the electrodes plugged into a set of fancy but nonfunctional gizmos.',
    seen: true,
    flagged: false
  }, {
    author: 'Me',
    msgTime: '2016-07-16T17:45:40.276Z',
    content: 'sure',
    seen: true,
    flagged: false
  }]
};

},{}],16:[function(require,module,exports){
'use strict';

var React = require('react');

//When a message is sent, the MessageLog component should scroll to the bottom to show the new message
module.exports.scrollToBottom = function () {
  var node = this.log;
  node.parentNode.scrollTop = node.scrollHeight;
};

//Convert user-entered string to a message object:
module.exports.addMessageProps = function (enteredText) {
  var fullMessage = {
    author: "Me",
    msgTime: new Date().toISOString(),
    content: enteredText,
    seen: true,
    flagged: false
  };
  return fullMessage;
};

//handles paragraph formatting for displayed messages
module.exports.formatMessage = function (message) {
  var paragraphArray = message.split('\n');
  var formattedMessage = [];
  paragraphArray.forEach(function (paragraph, index) {
    formattedMessage.push(React.createElement(
      'p',
      { className: 'message-paragraph', key: index },
      paragraph
    ));
  });
  return formattedMessage;
};

},{"react":"react"}],17:[function(require,module,exports){
'use strict';

// React component hierarchy:
// ActiveConversation
//   ConversationHeading
//   MessageLog
//     [MessageRow]
//       MessageContentBox
//   NewMessageInput
//     EnterToSend
//
// ConversationSelector
//   CorrespondentList
//     [CorrespondentRow]
//   NewCorrespondentButton
//   NewCorrespondentModal


$(document).ready(function () {
  if (window.location.pathname === '/messaging') {
    var React = require('react');
    var ReactDOM = require('react-dom');
    var Redux = require('redux');

    var Helper = require('./helper.jsx');
    var Reducers = require('./reducers.jsx');
    var ActiveConversation = require('./active/active-conversation.jsx');
    var ConversationSelector = require('./selector/conversation-selector.jsx');

    var reduxStore = Redux.createStore(Reducers.messagingApp);
    reduxStore.subscribe(render);
    render();
  }
  function render() {
    //Render the list of available conversations:
    ReactDOM.render(React.createElement(ConversationSelector, null), document.getElementById('conversation-selector-root'));

    //Render the active conversation:
    ReactDOM.render(React.createElement(ActiveConversation, {
      reduxState: reduxStore.getState(),
      handleTextChange: function handleTextChange(e) {
        e.preventDefault();
        if (e.charCode === 13 && reduxStore.getState().enterToSendStatus) {
          $('.new-message-form input[type="submit"]').click();
        }
        reduxStore.dispatch({
          type: 'TEXT_ENTRY',
          enteredText: e.target.value
        });
      },
      handleCheckboxChange: function handleCheckboxChange(e) {
        reduxStore.dispatch({
          type: 'CHECKBOX_UPDATE',
          checkboxValue: e.target.checked
        });
      },
      handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        if (reduxStore.getState().enteredText === '') {
          return;
        } else {
          reduxStore.dispatch({
            type: 'SEND_MESSAGE',
            newMessage: Helper.addMessageProps(reduxStore.getState().enteredText)
          });
        }
      }
      //On each keypress, check for the case that Enter was pressed and enterToSendStatus is true:
      , listenForEnter: function listenForEnter(e) {
        if (e.charCode === 13 && reduxStore.getState().enterToSendStatus) {
          e.preventDefault();
          $('.new-message-form input[type="submit"]').click();
        }
      }
    }), document.getElementById('active-conversation-root'));
  }
});

},{"./active/active-conversation.jsx":8,"./helper.jsx":16,"./reducers.jsx":18,"./selector/conversation-selector.jsx":19,"react":"react","react-dom":"react-dom","redux":"redux"}],18:[function(require,module,exports){
'use strict';

var fudge = require('./fudge.js');
var Redux = require('redux');

var messages = function messages() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? fudge.messages : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SEND_MESSAGE':
      return state.concat([action.newMessage]);
    default:
      return state;
  }
};

var correspondent = function correspondent() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? { firstName: fudge.correspondent.firstName, lastName: fudge.correspondent.lastName } : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    default:
      return state;
  }
};

var enterToSendStatus = function enterToSendStatus() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'CHECKBOX_UPDATE':
      return action.checkboxValue;
    default:
      return state;
  }
};

var enteredText = function enteredText() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'TEXT_ENTRY':
      return action.enteredText;
    case 'SEND_MESSAGE':
      return '';
    default:
      return state;
  }
};

var conversation = Redux.combineReducers({
  correspondent: correspondent,
  messages: messages
});

module.exports.messagingApp = Redux.combineReducers({
  conversation: conversation,
  enterToSendStatus: enterToSendStatus,
  enteredText: enteredText
});

},{"./fudge.js":15,"redux":"redux"}],19:[function(require,module,exports){
'use strict';

var React = require('react');

var NewCorrespondentButton = require('./new-correspondent-button.jsx');
var NewCorrespondentModal = require('./new-correspondent-modal.jsx');
var CorrespondentList = require('./correspondent-list.jsx');

module.exports = function () {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'conversation-list' },
      React.createElement(
        'h4',
        { className: 'text-center' },
        'My Correspondents'
      ),
      React.createElement('hr', null),
      React.createElement(CorrespondentList, null),
      React.createElement('hr', null),
      React.createElement(NewCorrespondentButton, null)
    ),
    React.createElement(NewCorrespondentModal, null)
  );
};

},{"./correspondent-list.jsx":20,"./new-correspondent-button.jsx":22,"./new-correspondent-modal.jsx":23,"react":"react"}],20:[function(require,module,exports){
'use strict';

var React = require('react');
var CorrespondentRow = require('./correspondent-row.jsx');

module.exports = function () {
  return React.createElement(
    'ul',
    { className: 'nav nav-pills nav-stacked' },
    React.createElement(CorrespondentRow, null)
  );
};

},{"./correspondent-row.jsx":21,"react":"react"}],21:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = function () {
  return React.createElement(
    "li",
    { role: "presentation" },
    React.createElement(
      "a",
      { href: "#" },
      "Washington, George   ",
      React.createElement("span", { className: "glyphicon glyphicon-envelope" }),
      React.createElement(
        "div",
        { className: "small pull-right" },
        "RTC"
      )
    )
  );
};

},{"react":"react"}],22:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = function () {
  return React.createElement(
    "button",
    { "data-toggle": "modal", "data-target": "#new-conversation-modal", className: "btn btn-success center-block" },
    React.createElement("span", { className: "glyphicon glyphicon-plus" }),
    "  Add Correspondent"
  );
};

},{"react":"react"}],23:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = function () {
  return React.createElement(
    "div",
    { tabIndex: "-1", role: "dialog", "aria-labelledby": "myModalLabel", id: "new-conversation-modal", className: "modal fade" },
    React.createElement(
      "div",
      { role: "document", className: "modal-dialog" },
      React.createElement(
        "div",
        { className: "modal-content" },
        React.createElement(
          "div",
          { className: "modal-body" },
          "(sortable/searchable list of ",
          React.createElement(
            "i",
            null,
            "all "
          ),
          "clients, which a clinician can use to initiate a new conversation.)"
        )
      )
    )
  );
};

},{"react":"react"}],24:[function(require,module,exports){
'use strict';

// next steps:
// lineOptions vs tempOptions is confusing

$(document).ready(function () {

  //load needed packages from Google:
  try {
    google.charts.load('current', { packages: ['corechart', 'line'] });
  } catch (e) {
    $('#chart-error-div').addClass('alert alert-warning').show();
    $('#chart-error-text').text('Can\'t load the Google Charts package. Are you connected to the internet?');
    return;
  }

  //global variables:
  var colorList = [null, '#2C3E50', '#18BC9C', '#3498DB', '#F39C12', '#E74C3C', 'darkblue'];
  var initialLineOptions = {
    colors: colorList,
    hAxis: {
      format: 'EEE, MMM d',
      gridlines: { count: 8 },
      viewWindow: {}
    },
    vAxis: {
      gridlines: { count: 6 },
      viewWindowMode: 'pretty',
      viewWindow: {
        min: 0,
        max: 10
      }
    },
    titleTextStyle: {
      fontName: 'Droid Serif',
      fontSize: 24
    },
    legend: {
      position: 'top',
      alignment: 'center'
    },
    height: 320,
    lineWidth: 3,
    focusTarget: 'datum',
    pointSize: 7,
    animation: {
      startup: true,
      duration: 500,
      easing: 'out'
    },
    chartArea: {
      height: '70%',
      top: 50,
      left: 50,
      width: '90%'
    },
    fontSize: 18,
    fontName: 'Droid Sans'

  };

  var initialColOptions = {
    bar: { groupWidth: 70 },
    hAxis: {
      gridlines: { count: 0 },
      viewWindow: {}
    },
    vAxis: {
      gridlines: { count: 0 },
      viewWindow: {
        min: 0,
        max: 1
      }
    },
    height: 60,
    focusTarget: 'datum',
    animation: {
      startup: true,
      duration: 500,
      easing: 'out'
    },
    chartArea: {
      height: '70%',
      top: 50,
      left: 50,
      width: '90%'
    },
    fontSize: 18,
    fontName: 'Droid Sans',
    annotations: {
      textStyle: {
        fontName: 'Droid Sans',
        fontSize: 40,
        bold: true
      }
    }
  };

  //Create some fake data in the correct format:
  function fudgeData(days) {
    var i;
    var outputArray = [];
    var dateArray = [];
    var today = new Date(2016, 4, 10);
    for (i = 0; i < days; i++) {
      var datesList;
      datesList = today.setDate(today.getDate() - 1);
      dateArray.push(datesList);
    }

    for (i = 0; i < days; i++) {
      var med = Math.round(Math.random() + 0.2);
      var ex = Math.round(Math.random() + 0.2);
      var fudge = [new Date(dateArray[i]), Math.min(i + 6, 10), Math.floor(Math.random() * 10 + 1), 5, Math.max(7 - i, 0), Math.floor(Math.random() * 10 + 1), Math.floor(Math.random() * 10 + 1), 0, 0];
      if (med) {
        fudge.push('✓');
      } else {
        fudge.push(null);
      }

      if (ex) {
        fudge.push('✓');
      } else {
        fudge.push(null);
      }

      outputArray.push(fudge);
    }

    return outputArray;
  }

  //Create the DataTable. This object won't change once created. (Its DataView will.)
  function createTable(dataArray) {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'X');
    data.addColumn('number', 'Cravings');
    data.addColumn('number', 'Sleep');
    data.addColumn('number', 'Stress');
    data.addColumn('number', 'Mood');
    data.addColumn('number', 'Energy');
    data.addColumn('number', 'Goals');
    data.addColumn('number', 'Meditated');
    data.addColumn('number', 'Exercised');
    data.addColumn({ type: 'string', role: 'annotation' });
    data.addColumn({ type: 'string', role: 'annotation' });
    data.addRows(dataArray);
    return data;
  }

  // Generic debounce function. Used below to slow chart re-draw on window resize
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var _this = this;
      var args = arguments;
      var later = function later() {
        timeout = null;
        if (!immediate) {
          func.apply(_this, args);
        }
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(_this, args);
      }
    };
  }

  function initializeCharts(dataArray, lineOptions, colOptions) {
    var data = createTable(dataArray);

    //the Data View is the object that mutates with form input:
    var filteredLineData = new google.visualization.DataView(data);
    var exerciseData = new google.visualization.DataView(data);
    var meditateData = new google.visualization.DataView(data);

    // set the columns for each of the col charts. (the line chart's columns are set dynamically by form input)
    exerciseData.setColumns([0, 7, 9]);
    meditateData.setColumns([0, 8, 10]);

    var lineChart = new google.visualization.LineChart(document.getElementById('line-chart'));
    var exerciseChart = new google.visualization.ColumnChart(document.getElementById('exercise-chart'));
    var meditateChart = new google.visualization.ColumnChart(document.getElementById('meditate-chart'));

    var viewWidth = 7;
    var finalDate;
    var earliestDate;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //Some functions to handle changes to date range from user input. (Event listeners at bottom of initializeLineCharts.)
    function resetDates() {
      finalDate = new Date(dataArray[0][0].getTime());
      earliestDate = new Date(finalDate.getTime());
      earliestDate.setDate(earliestDate.getDate() - (viewWidth - 1));
    }

    function goPast() {
      earliestDate.setDate(earliestDate.getDate() - viewWidth);
      finalDate.setDate(finalDate.getDate() - viewWidth);
      drawCharts(findActiveColumns());
    }

    function goFuture() {
      earliestDate.setDate(earliestDate.getDate() + viewWidth);
      finalDate.setDate(finalDate.getDate() + viewWidth);
      drawCharts(findActiveColumns());
    }

    function updateDateDisplay() {
      var earliestString = months[earliestDate.getMonth()] + ' ' + earliestDate.getDate();
      var finalString = months[finalDate.getMonth()] + ' ' + finalDate.getDate();
      var rangeString = earliestString + ' - ' + finalString;
      $('#date-range').text(rangeString);
    }

    //check status of column selector buttons on form:
    function findActiveColumns() {
      var $selector = $('#toggle-categories');
      var visibleCols = [0];
      $selector.children().children().each(function () {
        if ($(this).prop('checked')) {
          visibleCols.push(parseInt($(this).prop('id').substring(3)));
        }
      });

      return visibleCols;
    }

    //draw (or update) all 3 charts:
    function drawCharts(cols) {
      filteredLineData.setColumns(cols);

      $('#go-future').removeClass('disabled');
      if (finalDate >= dataArray[0][0]) {
        $('#go-future').addClass('disabled');
        resetDates();
      }

      lineOptions.hAxis.viewWindow.max = finalDate;
      colOptions.hAxis.viewWindow.max = finalDate;
      lineOptions.hAxis.viewWindow.min = earliestDate;
      colOptions.hAxis.viewWindow.min = earliestDate;

      var tempOptions = lineOptions;
      var tempColors = [];

      //start loop at 1 to ignore the null color for x-values (dates)
      for (var i = 1; i < cols.length; i++) {
        tempColors.push(colorList[cols[i]]);
      }

      tempOptions.colors = tempColors;

      // According to the Google documentation, I shouldn't need to use the
      // toDataTable method, but I get an error message without it (as far as
      // I can tell, this is a bug in the library)
      updateDateDisplay();
      lineChart.draw(filteredLineData.toDataTable(), tempOptions);

      //draw the column charts (their options are identical except for color, which needs to be manually updated):
      colOptions.annotations.textStyle.color = '#176AB0';
      exerciseChart.draw(exerciseData.toDataTable(), colOptions);

      colOptions.annotations.textStyle.color = '#18BC9C';
      meditateChart.draw(meditateData.toDataTable(), colOptions);
    }

    // ~~~~~~~Event Listeners:~~~~~~~~~ //

    //redraw when window resized:
    $(window).on('resize', debounce(function () {
      drawCharts(findActiveColumns());
    }, 150, false));

    //listen for control panel input:
    $('#toggle-categories').on('change', function () {
      drawCharts(findActiveColumns());
    });

    $('#go-past').on('click', function () {
      goPast();
    });

    $('#go-future').on('click', function () {
      goFuture();
    });

    $('#jump-size-picker').on('click', function (e) {
      switch (e.target.id) {
        case 'jump-7':
          viewWidth = 7;
          $('#go-past').removeClass('disabled');
          break;
        case 'jump-30':
          viewWidth = 30;
          $('#go-past').removeClass('disabled');
          break;
        case 'jump-all':
          viewWidth = dataArray.length;
          finalDate = new Date(dataArray[0][0].getTime());
          $('#go-past').addClass('disabled');
          break;
      }

      //Need to modify a function-scoped variable, not the relatively global date variable:
      var tempEarliest = new Date(finalDate.getTime());
      tempEarliest.setDate(finalDate.getDate() - (viewWidth - 1));
      earliestDate = tempEarliest;
      drawCharts(findActiveColumns());
    });

    //keyboard controls:
    $(window).on('keydown', function (e) {
      switch (e.which) {
        case 37:
          e.preventDefault();
          goPast();
          break;
        case 39:
          e.preventDefault();
          goFuture();
          break;
      }
    });

    //listen for swipes on mobile:
    $('#line-chart').on('swipeleft', function (e) {
      goFuture();
    });

    $('#line-chart').on('swiperight', function (e) {
      goPast();
    });

    // ~~~~~~~End event listeners~~~~~~~//

    //initial draw:
    resetDates();
    drawCharts(findActiveColumns());
  }

  google.charts.setOnLoadCallback(function () {
    initializeCharts(fudgeData(80), initialLineOptions, initialColOptions);
  });
});

},{}],25:[function(require,module,exports){
'use strict';

$(document).ready(function () {

  //initialize Bootstrap features:
  $('.glyphicon').tooltip();
  $('.dead-link').tooltip();

  //make nav for current page active in top navbar
  var url = window.location.pathname;
  if (url === '/') {
    url = '/client-list';
  }

  //highlight appropriate nav in single-client view sidebar
  url = url.split('/')[1];
  $('#' + url + '-nav').addClass('active');

  $('.nav-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $('#client-table tbody tr').on('click', function (e) {
    var clientId = this.id.substring(7);
    window.document.location = '/client-details/' + clientId;
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

  //mark current page as active in sidebar:
  var currentPage = window.location.pathname.split('/')[1];
  var target = 'li#' + currentPage + '-nav';
  $(target).addClass('active-sidebar');

  //mask phone number input fields
  if ($('input[type=phone]').mask) {
    $('input[type=phone]').mask('(999) 999-9999', { placeholder: '(___) ___-____' });
  }

  //mask date input fields
  if ($('.date-input').mask) {
    $('.date-input').mask('9999-99-99', { placeholder: 'yyyy-mm-dd' });
  }

  //DataTables:
  $('.dynamic-table').show();
  $('.dynamic-table').DataTable();
  $('.partial-dynamic-table').DataTable({
    paging: false,
    searching: false,
    info: false
  });
  $('.messaging-dynamic-table').DataTable({
    scrollY: true
  });

  //Edit contact info: add existing info to resulting modal:
  $('isChecked-true').attr('checked', true);
  $('isChecked-false').attr('checked', false);

  //Client details view: select appropriate tab on load:
  var queryString = window.location.href.split('?')[1];
  $('#' + queryString + '-tab').tab('show');
});

},{}],26:[function(require,module,exports){
'use strict';

$(document).ready(function () {

  //validate client add/edit forms
  $('form').on('submit', function (e) {
    $('.form-group').removeClass('has-warning');
    $('.form-group>div.help-block').remove();

    var userInput = this.elements;
    for (var i = 0; i < userInput.length; i++) {

      //check that required fields aren't empty
      if (userInput[i].required && !userInput[i].value) {
        e.preventDefault();
        showWarning(userInput[i], 'Required field.');
      }

      //check that phone numbers are either blank or have 10 digits
      if (userInput[i].name === 'phoneNumber') {
        if (userInput[i].value.length > 0 && userInput[i].value.length < 14) {
          e.preventDefault();
          showWarning(userInput[i], 'Phone numbers must have a full 10 digits.');
        }
      }

      if ($(userInput[i]).hasClass('date-input')) {
        var dateString = userInput[i].value;
        if (dateString.length > 0) {

          //check that the date string is either blank or has a full 10 characters
          if (dateString.length < 10) {
            e.preventDefault();
            showWarning(userInput[i], 'Date inputs must have the form YYYY-MM-DD.');
          }

          //check that a date object can be produced. (this checks against e.g. 1980-44-44)
          else if (isNaN(Date.parse(dateString))) {
              e.preventDefault();
              showWarning(userInput[i], 'Not a valid date. Date inputs have the form YYYY-MM-DD.');
            }
        }
      }
    }

    function showWarning(input, message) {
      $(input).closest('.form-group').addClass('has-warning');

      var $messageBlock = $('<div>', {
        class: 'help-block',
        text: message
      });
      $(input).parent().append($messageBlock);
    }
  });
});

},{}]},{},[5,6,17,24,25,26]);
