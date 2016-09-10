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

module.exports.showCalendarList = function (activeCalendar, calListObject) {
  var $calSelect = $('<select id="cal-selector">');
  var $nextOption;
  calListObject.items.forEach(function (item) {

    //Don't show default birthday or holiday calendars:
    if (item.id === '#contacts@group.v.calendar.google.com' || item.id === 'en.usa#holiday@group.v.calendar.google.com') {
      return;
    }

    $nextOption = $('<option>');
    $nextOption.append(item.summary);
    $nextOption.attr('value', item.id);
    if (item.id === activeCalendar) {
      $nextOption.attr('selected', 'selected');
    }

    $calSelect.append($nextOption);
  });

  $('#cal-list').empty().append($calSelect);
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
  var activeCalendar = 'primary';
  var userTimezone = '';
  var fcCallbacks = {
    eventReceive: function eventReceive(event) {
      Dom.showMessage('Sending updates to Google...', false);
      Goog.addEvent(activeCalendar, Helper.translateFcToGoog(event, userTimezone)[0], successfulAdd.bind(this, event._id), Dom.showError.bind(this, 'Failed to add new event.'));
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

      //display selectable list of calendar names:
      Goog.getCalendarList(Dom.showCalendarList.bind(this, activeCalendar), Dom.showError.bind(this, 'Unable to load calendar list.'));
    }
  }

  // -------Calendar drawing------------------

  //passes a list of event instances (including recurring events) to the updateCalendarDisplay function
  function getAndDisplayEvents() {
    Goog.getEventsList(activeCalendar, Helper.nDaysFromToday(-60), function (list) {
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
      calendarId: activeCalendar
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
      Goog.updateEvent(activeCalendar, Helper.translateFcToGoog(event, userTimezone), Dom.showMessage.bind(this, 'Event time successfully updated.', true), Dom.showError.bind(this, 'Failed to update event time.'));
    } else {
      Dom.showError('Failed to update event time: no Google Event ID found');
    }
  }

  $('#calendar').on('click', '.delete-event', function (e) {
    var $target = $(e.target);
    var googleId = $target.attr('data-googleId');
    var localId = $target.attr('data-id');
    FullCal.deleteEvent(localId);
    Goog.deleteEvent(activeCalendar, googleId, Dom.showMessage.bind(this, 'Event successfully deleted.', true), Dom.showError.bind(this, 'Failed to delete event.'));
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

  //----------Handle changes to visible calendar selector----------
  $('#cal-list').on('change', '#cal-selector', function (e) {
    activeCalendar = e.target.value;
    FullCal.destroy();
    manageAuthResult(true);
  });
});

},{"./dom-interface.js":1,"./fullcal-interface.js":2,"./goog.js":3,"./helper.js":4,"./ui-components.js":6}],6:[function(require,module,exports){
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

},{}]},{},[5]);
