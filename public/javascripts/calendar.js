var fakeEvents = [
  {
    title: 'All Day Event',
    start: '2016-07-01'
  },
  {
    title: 'Long Event',
    start: '2016-05-07',
    end: '2016-05-10'
  },
  {
    id: 999,
    title: 'Repeating Event',
    start: '2016-05-09T16:00:00'
  },
  {
    id: 999,
    title: 'Repeating Event',
    start: '2016-05-16T16:00:00'
  },
  {
    title: 'Conference',
    start: '2016-05-11',
    end: '2016-05-13'
  },
  {
    title: 'Meeting',
    start: '2016-05-12T10:30:00',
    end: '2016-05-12T12:30:00'
  },
  {
    title: 'Lunch',
    start: '2016-05-12T12:00:00'
  },
  {
    title: 'Meeting',
    start: '2016-05-12T14:30:00'
  },
  {
    title: 'Happy Hour',
    start: '2016-05-12T17:30:00'
  },
  {
    title: 'Dinner',
    start: '2016-05-12T20:00:00'
  },
  {
    title: 'Birthday Party',
    start: '2016-05-13T07:00:00'
  },
  {
    title: 'Click for Google',
    url: 'http://google.com/',
    start: '2016-05-28'
  }
];

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
    exports.listEvents = function (successCallback, failureCallback) {
      var request = gapi.client.calendar.events.list({
        calendarId: 'primary',
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

  function getEvents() {
    goog.listEvents(function (list) {
      console.log(list);
    });

    drawCalendar(fakeEvents);
  }

  //check auth on load:
  $(window).load(function () {
    goog.checkAuth(true, getEvents);
  });

  // initiates authorization process at user request
  $('#begin-auth').on('click', function () {
    $('.auth-waiting').show();
    goog.checkAuth(false, getEvents);
  });

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

      // defaultDate: '2016-05-12',
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: eventsList
    });
  }

});
