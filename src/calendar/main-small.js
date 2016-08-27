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
    dayClick: function (event, jsEvent) {
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
    goog.getEventsList(helper.nDaysFromToday(-60),
      function (list) {
        catchRecurringEvents(list.items, updateCalendarDisplay.bind(this, {}));
      },

      dom.showError.bind(this, 'Unable to download calendar data from Google.')
    );
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
