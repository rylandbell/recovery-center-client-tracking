// Main app - contains:
// -functions that tie together functionality found in multiple other modules
// -event handlers and associated callbacks
// -global variables
// -helper functions that require access to global variables

requirejs(['goog','helper','fullcal-interface','dom-interface','ui-components'], function(goog,helper,fullCal,dom,ui){
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

    //check auth on load:
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
      dom.showMessage('Authorization successful. Waiting for calendar to load...', false);
      if (authorizedStatus) {
        updateCalendarDisplay({});
      }
    }

    // -------Calendar drawing------------------

    function updateCalendarDisplay(customOptions) {

      //update the displayed calendar
      goog.getEventsList(helper.nDaysFromToday(-60),
        function (list) {
          list = catchRecurringEvents(list.items);
          customOptions.events = translateEventsList(list);
          fullCal.draw(customOptions, fcCallbacks, colors);
          dom.showMessage('');
          goog.getTimezone(function (response) {
            userTimezone = response.value;
          });
        },

        dom.showError.bind(this, 'Unable to download calendar data from Google.')
      );

      //display correct calendar name in sidebar:
      goog.getCalendarObject(dom.showCalName, dom.showError.bind(this, 'Unable to load calendar name.'));
    }

    //
    function catchRecurringEvents(list) {
      var requestObject = {
        timeMin: helper.nDaysFromToday(-60),
        timeMax: helper.nDaysFromToday(180),
        calendarId: 'primary'
      };
      var fullList = [];
      list.forEach(function (event) {
        if (event.recurrence) {
          requestObject.eventId = event.id;
          goog.getRecurringInstances(requestObject, function (instances) {
            instances.items.forEach(function (instance) {
              fullList.push(instance);
            });
          });
        } else {
          fullList.push(event);
        }
      });

      // need to add promises so the function waits for all the API calls above to return
      return fullList;
    }

    // convert event list from Google's format to the format used by fullCalendar
    function translateEventsList(list) {
      var transformedEvent;
      var googleEvents = list;
      var fcEvents = [];

      googleEvents.forEach(function (event) {
        transformedEvent = helper.translateGoogToFc(event);
        transformedEvent = paintSpecialEvents(transformedEvent);
        fcEvents.push(transformedEvent);
      });

      return fcEvents;
    }

    // add color/custom options for
    function paintSpecialEvents(event) {

      //Catch events previously added by this app:
      presetEventTitles.forEach(function (presetTitle, j) {
        if (event.title === presetTitle) {
          event.backgroundColor = colors.bgHighlight[j % colors.bgHighlight.length];
          event.editable = true;
        }
      });

      //Catch YCBM appointments:
      if (event.title && event.title.substring(0, 7) === 'booked:') {
        event.backgroundColor = colors.bgHighlight[1];
      }

      return event;
    }

    //------------Adding events-------------------

    // create draggable elements for availability-slot events (currently only one element in this array)
    for (var i = 0; i < presetEventTitles.length; i++) {
      new ui.Draggable('.draggable-events', {
        title: presetEventTitles[i],
        backgroundColor: colors.bgHighlight[i % colors.bgHighlight.length]
      });
    }

    // creates a draggable element for the first event, set to repeat weekly forever
    new ui.Draggable('.draggable-events', {
      title: presetEventTitles[0],
      backgroundColor: 'red',
      recurrence: ['RRULE:FREQ=WEEKLY']
    });

    //callback for goog.addEvent:
    function successfulAdd(localEventId, googEvent) {

      //need to tag new local event with Google's ID for the event:
      fullCal.addGoogleEventId(localEventId, googEvent);
      dom.showMessage('Event successfully added to your Google calendar.', true);
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
