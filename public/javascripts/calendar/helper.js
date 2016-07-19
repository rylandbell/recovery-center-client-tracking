//---------Collects helper functions - only pure, no side effects, don't need access to global variables

define(function(){
  var exports = {};

  //Transform a fullcalendar event object to a Google calendar event object
  exports.translateFcToGoog = function (fullCalEvent, userTimezone) {
    var preppedEvent = {
      summary: fullCalEvent.title,
      start: {
        dateTime: fullCalEvent.start._d.toISOString(),
        timeZone: userTimezone
      },
      end: {
        dateTime: fullCalEvent.end._d.toISOString(),
        timeZone: userTimezone
      },
      recurrence: fullCalEvent.recurrence
    };
    if (fullCalEvent.googleId) {
      preppedEvent.googleId = fullCalEvent.googleId;
    }

    return [preppedEvent, fullCalEvent._id];
  };

  exports.translateGoogToFc = function (event) {
    console.log(event);
    var transformedEvent = {};
    transformedEvent.googleId = event.id;
    transformedEvent.htmlLink = event.htmlLink;
    transformedEvent.title = event.summary;

    //handle regular (not full-day) events
    if (event.end.dateTime && event.start.dateTime) {
      transformedEvent.start = event.start.dateTime;
      transformedEvent.end = event.end.dateTime;

    //handle full-day events
    } else if (event.end.date && event.start.date) {
      transformedEvent.start = event.start.date;
      transformedEvent.end = event.end.date;
      transformedEvent.allDay = true;
    }

    if(event.recurringEventId){
      console.log('hi');
      transformedEvent.editable = false;
    }

    return transformedEvent;
  };

  //return an ISO string for x days from now, used to create timeMin/timeMax for pulling calendar data from Google
  exports.nDaysFromToday = function (days) {
    var today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString();
  };

  return exports;
});