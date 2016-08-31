//---------Collects helper functions - only pure, no side effects, don't need access to global variables

//Transform a fullcalendar event object to a Google calendar event object
module.exports.translateFcToGoog = function (fullCalEvent, userTimezone) {
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
    recurrence: fullCalEvent.recurrence,
    transparency: 'transparent'
  };
  if (fullCalEvent.googleId) {
    preppedEvent.googleId = fullCalEvent.googleId;
  }

  return [preppedEvent, fullCalEvent._id];
};

module.exports.translateGoogToFc = function (event) {
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

  if (event.recurringEventId) {
    transformedEvent.editable = false;
    transformedEvent.recurring = true;
  }

  return transformedEvent;
};

//return an ISO string for x days from now, used to create timeMin/timeMax for pulling calendar data from Google
module.exports.nDaysFromToday = function (days) {
  var today = new Date();
  today.setDate(today.getDate() + days);
  return today.toISOString();
};

