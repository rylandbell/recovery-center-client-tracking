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
    eventReceive: function (event) {
      Dom.showMessage('Sending updates to Google...', false);
      Goog.addEvent(activeCalendar, Helper.translateFcToGoog(event, userTimezone)[0], successfulAdd.bind(this, event._id), Dom.showError.bind(this, 'Failed to add new event.'));
    },

    eventDrop: function (event) {
      handleEventChange(event);
    },

    eventResize: function (event) {
      handleEventChange(event);
    },

    eventClick: function (event, jsEvent) {
      Dom.clearPopovers();
      Dom.showEventPopover(event, jsEvent);
    },

    //kill all popovers when click on calendar background:
    dayClick: function (event, jsEvent) {
      Dom.clearPopovers();
    }
  };

  // --------Authorization handling------------

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
    Goog.getEventsList(activeCalendar, Helper.nDaysFromToday(-60),
      function (list) {
        catchRecurringEvents(list.items, updateCalendarDisplay.bind(this, {}));
      },

      Dom.showError.bind(this, 'Unable to download calendar data from Google.')
    );
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
