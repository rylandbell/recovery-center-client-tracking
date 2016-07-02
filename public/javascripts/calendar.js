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
    exports.checkAuth = function (immediate) {
      var _this = this;
      gapi.auth.authorize(
        {
          client_id: CLIENT_ID,
          scope: SCOPES.join(' '),
          immediate: immediate,
        }, function (token) {
          _this.handleAuthResult.apply(_this, [token]);
        });
    };

    // Handle response from authorization server
    exports.handleAuthResult = function (authResult) {
      if (authResult && !authResult.error) {
        this.loadCalendarApi();
        updateAuthDisplay(true);
      } else {
        updateAuthDisplay(false);
      }
    };

    //Load Google Calendar client library.
    exports.loadCalendarApi = function () {
      gapi.client.load('calendar', 'v3');
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

  //check authorization when user initiates calendar add process
  $('#begin-auth').on('click', function () {
    $('.auth-waiting').show();
    goog.checkAuth(false);
  });

  $(window).load(function () {
    goog.checkAuth(true);
  });

  // //Draw a calendar with fullcalendar.js:
  // $('#calendar').fullCalendar({
  //   defaultView: 'agendaWeek',
  //   header: {
  //     left: 'prev,next today',
  //     center: 'title',
  //     right: 'month,agendaWeek,agendaDay'
  //   },
  //   minTime: '07:00',
  //   maxTime: '21:00',
  //   // defaultDate: '2016-05-12',
  //   editable: true,
  //   eventLimit: true, // allow "more" link when too many events
  //   events: [
  //     {
  //       title: 'All Day Event',
  //       start: '2016-05-01'
  //     },
  //     {
  //       title: 'Long Event',
  //       start: '2016-05-07',
  //       end: '2016-05-10'
  //     },
  //     {
  //       id: 999,
  //       title: 'Repeating Event',
  //       start: '2016-05-09T16:00:00'
  //     },
  //     {
  //       id: 999,
  //       title: 'Repeating Event',
  //       start: '2016-05-16T16:00:00'
  //     },
  //     {
  //       title: 'Conference',
  //       start: '2016-05-11',
  //       end: '2016-05-13'
  //     },
  //     {
  //       title: 'Meeting',
  //       start: '2016-05-12T10:30:00',
  //       end: '2016-05-12T12:30:00'
  //     },
  //     {
  //       title: 'Lunch',
  //       start: '2016-05-12T12:00:00'
  //     },
  //     {
  //       title: 'Meeting',
  //       start: '2016-05-12T14:30:00'
  //     },
  //     {
  //       title: 'Happy Hour',
  //       start: '2016-05-12T17:30:00'
  //     },
  //     {
  //       title: 'Dinner',
  //       start: '2016-05-12T20:00:00'
  //     },
  //     {
  //       title: 'Birthday Party',
  //       start: '2016-05-13T07:00:00'
  //     },
  //     {
  //       title: 'Click for Google',
  //       url: 'http://google.com/',
  //       start: '2016-05-28'
  //     }
  //   ]
  // });

});
