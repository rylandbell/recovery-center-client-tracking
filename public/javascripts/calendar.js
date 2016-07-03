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
      request.execute(function (e) {
        if (e) {
          successCallback(e.id);
        } else {
          failureCallback();
        }
      });
    };

    //Add event to calendar
    exports.addEvent = function (event, successCallback, failureCallback) {
      var request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      request.execute(function (e) {
        if (e && e.status === 'confirmed') {
          successCallback(e);
        } else {
          failureCallback(e);
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

  // --------Authorization handling------------

  //check auth on load:
  $(window).load(function () {
    goog.checkAuth(true, updateCalendarDisplay);
  });

  // initiates authorization process at user request
  $('#begin-auth').on('click', function () {
    $('.auth-waiting').show();
    goog.checkAuth(false, updateCalendarDisplay);
  });

  // -------Calendar drawing------------------

  function updateCalendarDisplay() {

    //update the actual calendar
    goog.getEventsList(function (list) {
      drawCalendar(transformEventsList(list));
      $('.cal-loading').hide();
    });

    //display correct calendar name in sidebar:
    goog.getCalendarName(function (id) {
      $('#cal-name').text('Displaying calendar: ' + id);
    });
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
        transformedEvent.title = event.summary;
        transformedEvent.start = event.start.dateTime;
        transformedEvent.end = event.end.dateTime;
        displayedEvents.push(transformedEvent);
        if (event.summary === ycbmTitle) {
          transformedEvent.color = 'green';
          transformedEvent.editable = true;
        }
      }
    });

    return displayedEvents;
  }

  //Draw a calendar with fullcalendar.js:
  function drawCalendar(eventsList) {
    $('#calendar').fullCalendar({
      defaultView: 'agendaWeek',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'custom month,agendaWeek,agendaDay'
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
      scrollTime: '08:00',
      editable: false,
      eventLimit: true, // allow "more" link when too many events
      events: eventsList,
      droppable: true,
      eventReceive: function (event) {
        goog.addEvent(makeGoogleEvent(event), successfulAdd, failedAdd);
      },

      eventColor: 'black',
      eventOverlap: false
    });
  }

  //Prep the draggable event to be received by fullCalendar
  $('.draggable')
    .draggable({
      revert: true,      // immediately snap back to original position
      revertDuration: 0,  //
    })
    .data('duration', '01:00')
    .data('event', {
      title: ycbmTitle,
      backgroundColor: 'darkgreen',
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
    return preppedEvent;
  }

  //callbacks for goog.addEvent:
  function successfulAdd(e) {

    // $('.add-view').hide();
    // $('.success-view').show();
    // $('#event-link').attr('href', e.htmlLink);
    console.log('Successfully added: ' + e);
  }

  function failedAdd(e) {

    // $('#fail-message').removeClass('invisible');
    // $('#error-message').text('\"' + e.message + '\"');
    console.log('Failed to add: ' + e);
  }

});
