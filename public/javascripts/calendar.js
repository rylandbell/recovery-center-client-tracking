$(document).ready(function () {
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
    goog.getEventsList(function (list) {
      drawCalendar(transformEventsList (list));
    });
  }

  // convert event list from Google's format to the format used by fullCalendar
  function transformEventsList(list) {
    console.log(list.items.length);
    var transformedEvent
    var googleEvents = list.items;
    var displayedEvents = [];

    googleEvents.forEach(function(event){
      transformedEvent = {};

      //don't include events without both a start and end time (excludes all-day events, others?)   
      if(event.end.dateTime && event.start.dateTime){
        transformedEvent.title = event.summary;
        transformedEvent.start = event.start.dateTime;
        transformedEvent.end = event.end.dateTime;
        displayedEvents.push(transformedEvent);
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
        right: 'month,agendaWeek,agendaDay'
      },
      minTime: '07:00',
      maxTime: '21:00',
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: eventsList
    });
  }

});
