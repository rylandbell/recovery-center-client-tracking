// Main app - contains:
// -functions that tie together functionality found in multiple other modules
// -event handlers and associated callbacks
// -global variables
// -helper functions that require access to global variables

requirejs(['goog', 'helper', 'fullcal-interface', 'dom-interface', 'ui-components', '../../vendor/require/domReady'], function (goog, helper, fullCal, dom, ui, domReady) {
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
      eventReceive: function (event) {
        dom.showMessage('Sending updates to Google...', false);
        goog.addEvent(helper.translateFcToGoog(event, userTimezone)[0], successfulAdd.bind(this, event._id), dom.showError.bind(this, 'Failed to add new event.'));
      },

      eventDrop: function (event) {
        handleEventChange(event);
      },

      eventResize: function (event) {
        handleEventChange(event);
      },

      eventClick: function (event, jsEvent) {
        dom.clearPopovers();
        dom.showEventPopover(event, jsEvent);
      },

      //kill all popovers when click on calendar background:
      dayClick: function (event, jsEvent) {
        dom.clearPopovers();
      }
    };

    // --------Authorization handling------------

    //use domReady instead of window.load because RequireJS loads scripts aynchronously, which may or may not complete before window.load is called
    domReady(function () {
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
        fullCal.draw({}, fcCallbacks, colors);

        //add events to calendar:
        getAndDisplayEvents();

        //set correct timezone for adding events:
        goog.getTimezone(function (response) {
          userTimezone = response.value;
        });

        //display correct calendar name in sidebar:
        goog.getCalendarObject(dom.showCalName, dom.showError.bind(this, 'Unable to load calendar name.'));
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

    // add color/custom options for events created in this app, including before current session
    function paintSpecialEvents(event) {

      //Catch events previously added by this app:
      presetEventTitles.forEach(function (presetTitle, j) {
        if (event.title === presetTitle) {
          event.backgroundColor = colors.bgHighlight[j % colors.bgHighlight.length];
        }
      });

      //Catch YCBM appointments:
      if (event.title && event.title.substring(0, 7) === 'booked:') {
        event.backgroundColor = colors.bgHighlight[1];
      }

      //Catch recurring appointments:
      if (event.recurring && event.title === presetEventTitles[0]) {
        event.backgroundColor = 'rgb(98, 198, 109)';
      }

      return event;
    }

    //------------Adding events-------------------

    // create draggable elements for availability-slot events (currently only one element in this array)
    for (var i = 0; i < presetEventTitles.length; i++) {
      new ui.Draggable('#draggable-events', {
        title: presetEventTitles[i],
        backgroundColor: colors.bgHighlight[i % colors.bgHighlight.length]
      });
    }

    // creates a draggable element for the first event, set to repeat weekly forever
    new ui.Draggable('#draggable-events-recurring', {
      title: presetEventTitles[0],

      // hacky solution to set border type inside fullCalendar, without altering vendor code
      // (sets slightly different color for style selector in CSS to catch)
      backgroundColor: 'rgb(98, 198, 109)',
      recurrence: ['RRULE:FREQ=WEEKLY']
    });

    //callback for goog.addEvent:
    function successfulAdd(localEventId, googEvent) {

      //need to tag new local event with Google's ID and URL for the event:
      fullCal.addGoogleEventData(localEventId, googEvent);
      dom.showMessage('Event successfully added to your Google calendar.', true);

      if (googEvent.recurrence) {
        getAndDisplayEvents();
      }
    }

    //---------------Edit or delete events---------------
    function handleEventChange(event) {
      if (event.googleId) {
        dom.showMessage('Sending updates to Google...', false);
        goog.updateEvent(helper.translateFcToGoog(event, userTimezone), dom.showMessage.bind(this, 'Event time successfully updated.', true), dom.showError.bind(this, 'Failed to update event time.'));
      } else {
        dom.showError('Failed to update event time: no Google Event ID found');
      }
    }

    $('#calendar').on('click', '.delete-event', function (e) {
      var $target = $(e.target);
      var googleId = $target.attr('data-googleId');
      var localId = $target.attr('data-id');
      fullCal.deleteEvent(localId);
      goog.deleteEvent(googleId, dom.showMessage.bind(this, 'Event successfully deleted.', true), dom.showError.bind(this, 'Failed to delete event.'));
      dom.showMessage('Sending updates to Google...', false);
      dom.clearPopovers();
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
      fullCal.destroy();
      updateCalendarDisplay(customOptions);
    });

  });
});
