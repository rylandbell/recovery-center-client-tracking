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
  // The callback function should be a hub for the app to handle the result, with a Boolean 'authorized' parameter
  exports.handleAuthResult = function (authResult, callback) {
    if (authResult && !authResult.error) {
      this.loadCalendarApi(callback.bind(this, true));
    } else {
      callback(false);
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

  exports.getCalendarObject = function (successCallback, failureCallback) {
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
        failureCallback(e);
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
        failureCallback(e);
      }
    });
  };

  return exports;
}

//calls to fullCalendar library:
function talkToFullCalendar() {
  var exports = {};

  //Draw a calendar with fullcalendar.js:
  exports.draw = function (customOptions, callbacks, colors) {
    var key;

    // Default options object:
    var options = {
      defaultView: 'agendaWeek',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,fourDay,agendaDay'
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
      editable: false,
      eventLimit: true, // allow "more" link when too many events
      droppable: true,
      eventBackgroundColor: colors.bgDefault,
      eventBorderColor: colors.border,
      eventTextColor: colors.text,
      eventOverlap: false
    };

    //add customOptions, like the events array and user-specific settings:
    for (key in customOptions) {
      if (customOptions.hasOwnProperty(key)) {
        options[key] = customOptions [key];
      }
    }

    //add the callback functions specific to this app:
    for (key in callbacks) {
      if (callbacks.hasOwnProperty(key)) {
        options[key] = callbacks [key];
      }
    }

    $('#calendar').fullCalendar(options);
  };

  exports.deleteEvent = function (id) {
    $('#calendar').fullCalendar('removeEvents', id);
  };

  exports.addGoogleEventId = function (localEventId, googEvent) {
    $('#calendar').fullCalendar('clientEvents', localEventId)[0].googleId = googEvent.id;
  };

  exports.destroy = function () {
    $('#calendar').fullCalendar('destroy');
  };

  return exports;
}

function domManipulation() {
  var exports = {};

  exports.authorization = function (authorized) {
    $('.auth-waiting').hide();
    if (authorized) {
      $('.auth-view').hide();
      $('.cal-loading').show();
      $('.cal-view').show();
    } else {
      $('.auth-view').show();
      $('.cal-view').hide();
    }
  };

  exports.showEventPopover = function (event, jsEvent) {
    $(jsEvent.currentTarget)
      .popover({
        html: true,
        content: '<p>(Clicking Edit will take you to this event\'s page on Googles Calendar.)</p><p><button class="btn btn-danger delete-event" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>&nbsp;<a href="' + event.htmlLink + '" target="_blank"><button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Edit</button></a></p>',
        placement: 'bottom',
        trigger: 'manual',
        container: '.fc-scroller'
      })
      .popover('toggle');
  };

  exports.clearPopovers = function () {
    $('.popover').remove();
  };

  exports.showMessage = function (message, fade) {
    $('#message-box')
      .show()
      .text(message)
      .delay(3000);
    if (fade) {
      $('#message-box').fadeOut(1000);
    }
  };

  exports.showError = function () {
    $('#message-box').text('');
    $('.error-box').show();
  };

  return exports;
}

$(document).ready(function () {

  //app modules:
  var goog = talkToGoogleApi();
  var fullCal = talkToFullCalendar();
  var dom = domManipulation();

  //global variables:
  var ycbmTitle = 'Available for client appointments';
  var colors = {
    bgDefault: 'lightgrey',
    border: 'black',
    text: 'black',
    bgHighlight: ['#62c66c', '#7c95ee']
  };
  var fcCallbacks = {
    eventReceive: function (event) {
      dom.showMessage('Sending updates to Google...', false);
      goog.addEvent(makeGoogleEventObject(event)[0], successfulAdd.bind(this, event._id), dom.showError);
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

  function manageAuthResult(authorized) {
    dom.authorization(authorized);
    if (authorized) {
      updateCalendarDisplay({});
    }
  }

  // --------Authorization handling------------

  //check auth on load:
  $(window).load(function () {
    if (typeof gapi !== 'undefined') {
      goog.checkAuth(true, manageAuthResult);
    } else {
      dom.showError();
    }
  });

  // initiates authorization process at user request
  $('#begin-auth').on('click', function () {
    $('.auth-waiting').show();
    goog.checkAuth(false, manageAuthResult);
  });

  // -------Calendar drawing------------------

  function updateCalendarDisplay(customOptions) {

    //update the actual calendar
    goog.getEventsList(function (list) {
      customOptions.events = transformEventsList(list);
      fullCal.draw(customOptions, fcCallbacks, colors);
      $('.cal-loading').hide();
    }, dom.showError);

    //display correct calendar name in sidebar:
    goog.getCalendarObject(function (calendar) {
      $('#cal-name').text('Active calendar: ' + calendar.id);
    }, dom.showError);
  }

  // convert event list from Google's format to the format used by fullCalendar
  function transformEventsList(list) {
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

        if (event.summary === ycbmTitle) {
          transformedEvent.backgroundColor = colors.bgHighlight[0];
          transformedEvent.editable = true;
        }

        if (event.summary.substring(0, 7) === 'booked:') {
          transformedEvent.color = colors.bgHighlight[1];
        }

        displayedEvents.push(transformedEvent);
      }
    });

    return displayedEvents;
  }

  //----------Adding events:--------------

  //Prep the draggable event to be received by fullCalendar
  $('.draggable')
    .draggable({
      revert: true,
      revertDuration: 0,
      helper: 'clone',
      opacity: 0.5,
      cursor: 'pointer',
      cursorAt: { top: 33, left: 70 }
    })
    .data('duration', '01:00')
    .data('event', {
      title: ycbmTitle,
      backgroundColor: colors.bgHighlight[0],
      editable: true
    });

  //Transform a fullcalendar event object to a Google calendar event object
  function makeGoogleEventObject(fullCalEvent) {
    var preppedEvent = {
      summary: fullCalEvent.title,
      start: {
        dateTime: fullCalEvent.start._d.toISOString()
      },
      end: {
        dateTime: fullCalEvent.end._d.toISOString()
      }
    };
    if (fullCalEvent.googleId) {
      preppedEvent.googleId = fullCalEvent.googleId;
    }

    return [preppedEvent, fullCalEvent._id];
  }

  //callback for goog.addEvent:
  function successfulAdd(localEventId, googEvent) {

    //need to tag new local event with Google's ID for the event:
    fullCal.addGoogleEventId(localEventId, googEvent);
    dom.showMessage('Event successfully added to your Google calendar.', true);
  }

  //---------------Change an existing event---------------
  function handleEventChange(event) {
    if (event.googleId) {
      dom.showMessage('Sending updates to Google...', false);
      goog.updateEvent(makeGoogleEventObject(event), dom.showMessage.bind(this, 'Event time successfully updated.', true), dom.showError);
    } else {
      dom.showError();
    }
  }

  //------------Delete an event------------
  $('#calendar').on('click', '.delete-event', function (e) {
    var $target = $(e.target);
    var googleId = $target.attr('data-googleId');
    var localId = $target.attr('data-id');
    fullCal.deleteEvent(localId);
    goog.deleteEvent(googleId, dom.showMessage.bind(this, 'Event successfully deleted.', true), dom.showError);
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
