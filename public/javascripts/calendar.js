$(document).ready(function () {
  var ycbmTitle = 'Available for client appointments';
  var goog = talkToGoogleApi();

  //All communication with Google servers should be in this module:
  function talkToGoogleApi() {
    var exports = {};

    // Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '4139562567-omh3t9ktrc2hmsf9j34tb0k9h2m41pi6.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/calendar'];

    // Ask server if app is authorized to modify calendar
    exports.checkAuth = function (immediate, callback) {
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
    exports.handleAuthResult = function (authResult, callback) {

      if (authResult && !authResult.error) {
        this.loadCalendarApi(callback);
        updateAuthDisplay(true);
      } else {
        updateAuthDisplay(false);
      }
    };

    //Load Google Calendar client library.
    exports.loadCalendarApi = function (callback) {
      gapi.client.load('calendar', 'v3', callback);
    };

    //Load calendar events (currently gets ALL of user's events):
    exports.getEventsList = function (successCallback, failureCallback) {
      var request = gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: '2016-05-01T00:00:00.000Z'
      });
      request.execute(function (e) {
        if (e) {
          successCallback(e);
        } else {
          failureCallback(e);
        }
      });
    };

    exports.getCalendarName = function (successCallback, failureCallback) {
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

    //Add event to calendar
    exports.addEvent = function (localEvent, successCallback, failureCallback) {
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
    exports.updateEvent = function (event, successCallback, failureCallback) {
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
          console.log(e);

          // failureCallback(e);
        }
      });
    };

    //Delete an event
    exports.deleteEvent = function (googleId, successCallback, failureCallback) {
      var request = gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: googleId,
      });
      request.execute(function (e) {
        if (e && !e.error) {
          successCallback();
        } else {
          console.log(e);

          // failureCallback(e);
        }
      });
    };

    return exports;
  }

  //Show appropriate UI elements, depending on authorized status
  function updateAuthDisplay(authorized) {
    $('.auth-waiting').hide();
    if (authorized) {
      $('.auth-view').hide();
      $('.cal-loading').show();
      $('.cal-view').show();
    } else {
      $('.auth-view').show();
      $('.cal-view').hide();
    }
  }

  //failure callback, which just displays generic error message for now
  function showError() {
    console.log('error');
    $('#message-box').text('');
    $('.error-box').show();
  }

  function showMessage(message, fade) {
    $('#message-box')
      .show()
      .text(message)
      .delay(3000);
    if (fade) {
      $('#message-box').fadeOut(1000);
    }
  }

  // --------Authorization handling------------

  //check auth on load:
  $(window).load(function () {
    if (typeof gapi !== 'undefined') {
      goog.checkAuth(true, updateCalendarDisplay.bind(this, {}));
    } else {
      showError();
    }
  });

  // initiates authorization process at user request
  $('#begin-auth').on('click', function () {
    $('.auth-waiting').show();
    goog.checkAuth(false, updateCalendarDisplay.bind(this, {}));
  });

  // -------Calendar drawing------------------

  function updateCalendarDisplay(customOptions) {

    //update the actual calendar
    goog.getEventsList(function (list) {
      customOptions.events = transformEventsList(list);
      drawCalendar(customOptions);
      $('.cal-loading').hide();
    }, showError);

    //display correct calendar name in sidebar:
    goog.getCalendarName(function (calendar) {
      $('#cal-name').text('Active calendar: ' + calendar.id);
    }, showError);
  }

  // convert event list from Google's format to the format used by fullCalendar
  function transformEventsList(list) {
    console.log(list.items.length + ' events returned.');
    var transformedEvent;
    var googleEvents = list.items;
    var displayedEvents = [];

    googleEvents.forEach(function (event) {
      transformedEvent = {};

      //don't include events without both a start and end time (excludes all-day events, others?)
      if (event.end.dateTime && event.start.dateTime) {
        transformedEvent.googleId = event.id;
        transformedEvent.htmlLink = event.htmlLink;
        transformedEvent.title = event.summary;
        transformedEvent.start = event.start.dateTime;
        transformedEvent.end = event.end.dateTime;
        if (event.summary.substring(0, 7) === 'booked:') {
          transformedEvent.color = '#7c95ee';
          transformedEvent.textColor = 'black';
          transformedEvent.borderColor = 'black';
        }

        if (event.summary === ycbmTitle) {
          transformedEvent.backgroundColor = '#62c66c';
          transformedEvent.textColor = 'black';
          transformedEvent.borderColor = 'black';
          transformedEvent.editable = true;
        }

        displayedEvents.push(transformedEvent);
      }
    });

    return displayedEvents;
  }

  //Draw a calendar with fullcalendar.js:
  function drawCalendar(customOptions) {

    // Default options object:
    var options = {
      defaultView: 'agendaWeek',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      views: {
        custom: {
          type: 'agenda',
          weekends: false,
          duration: { days: 7 },
          buttonText: 'custom'
        }
      },
      minTime: '07:00',
      maxTime: '21:00',
      timezone: 'local',
      weekends: true,
      scrollTime: '08:00',
      editable: false,
      eventLimit: true, // allow "more" link when too many events
      droppable: true,
      eventBackgroundColor: 'lightgrey',
      eventBorderColor: 'black',
      eventTextColor: 'black',
      eventOverlap: false,
      eventReceive: function (event) {
        showMessage('Sending updates to Google...', false);
        goog.addEvent(makeGoogleEvent(event)[0], successfulAdd.bind(this, event._id), showError);
      },

      eventDrop: function (event) {
        handleEventChange(event);
      },

      eventResize: function (event) {
        handleEventChange(event);
      },

      eventClick: function (event, jsEvent) {
        handleClick(event, jsEvent);
      },

      //kill all popovers when click on calendar background:
      dayClick: function (event, jsEvent) {
        clearPopovers();
      }
    };

    //add customOptions, like the events array and user-specific settings:
    for (var key in customOptions) {
      if (customOptions.hasOwnProperty(key)) {
        options[key] = customOptions [key];
      }
    }

    $('#calendar').fullCalendar(options);
  }

  //----------Adding events:--------------

  //Prep the draggable event to be received by fullCalendar
  $('.draggable')
    .draggable({
      revert: true,      // immediately snap back to original position
      revertDuration: 0,
      helper: 'clone',
      opacity: 0.5,
      cursor: 'pointer',
      cursorAt: { top: 33, left: 70 }
    })
    .data('duration', '01:00')
    .data('event', {
      title: ycbmTitle,
      backgroundColor: '#62c66c',
      borderColor: 'black',
      editable: true
    });

  //Transform a fullcalendar event object to a Google calendar event object
  function makeGoogleEvent(event) {
    var preppedEvent = {
      summary: event.title,
      start: {
        dateTime: event.start._d.toISOString()
      },
      end: {
        dateTime: event.end._d.toISOString()
      }
    };
    if (event.googleId) {
      preppedEvent.googleId = event.googleId;
    }

    return [preppedEvent, event._id];
  }

  //callbacks for goog.addEvent:
  function successfulAdd(localEventId, googEvent) {

    //need to tag new local event with Google's ID for the event:
    addGoogleEventId(localEventId, googEvent);
    showMessage('Event successfully added to your Google calendar.', true);
  }

  function addGoogleEventId(localEventId, googEvent) {
    $('#calendar').fullCalendar('clientEvents', localEventId)[0].googleId = googEvent.id;
  }

  //---------------Change an existing event---------------
  function handleEventChange(event) {
    if (event.googleId) {
      showMessage('Sending updates to Google...', false);
      goog.updateEvent(makeGoogleEvent(event), showMessage.bind(this, 'Event time successfully updated.', true));
    } else {
      console.log('can\'t be moved');
    }
  }

  //---------------Manage popovers--------------
  function handleClick(event, jsEvent) {
    clearPopovers();
    $(jsEvent.currentTarget)
      .popover({
        html: true,
        content: '<p>(Clicking Edit will take you to this event\'s page on Googles Calendar.)</p><p><button class="btn btn-danger delete-event" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>&nbsp;<a href="' + event.htmlLink + '" target="_blank"><button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Edit</button></a></p>',
        placement: 'bottom',
        trigger: 'manual',
        container: '.fc-scroller'
      })
      .popover('toggle');
  }

  function clearPopovers() {
    $('.popover').remove();
  }

  //------------Delete an event------------
  $('#calendar').on('click', '.delete-event', function (e) {
    var $target = $(e.target);
    var googleId = $target.attr('data-googleId');
    var localId = $target.attr('data-id');
    deleteLocal(localId);
    showMessage('Sending updates to Google...', false);
    goog.deleteEvent(googleId, showMessage.bind(this, 'Event successfully deleted.', true));
    clearPopovers();
  });

  function deleteLocal(id) {
    $('#calendar').fullCalendar('removeEvents', id);
  }

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
    $('#calendar').fullCalendar('destroy');
    updateCalendarDisplay(customOptions);
  });

});
