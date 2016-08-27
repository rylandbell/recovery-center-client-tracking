//Draw a calendar with fullcalendar.js:
module.exports.draw = function (targetDivId, customOptions, callbacks, colors) {

  // Default options object:
  var defaultOptions = {
    defaultView: 'agendaWeek',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
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
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    droppable: true,
    eventBackgroundColor: colors.bgDefault,
    eventBorderColor: colors.border,
    eventTextColor: colors.text,
    eventOverlap: false,
    allDayDefault: false,
    defaultAllDayEventDuration: { days: 1 },
    nowIndicator: true
  };

  //add customOptions and callbacks, like the events array and user-specific settings:
  var options = Object.assign({}, defaultOptions, customOptions, callbacks);

  $('#' + targetDivId).fullCalendar(options);
};

module.exports.deleteEvent = function (id) {
  $('#calendar').fullCalendar('removeEvents', id);
};

module.exports.addGoogleEventData = function (localEventId, googEvent) {
  $('#calendar').fullCalendar('clientEvents', localEventId)[0].googleId = googEvent.id;
  $('#calendar').fullCalendar('clientEvents', localEventId)[0].htmlLink = googEvent.htmlLink;
};

module.exports.destroy = function () {
  $('#calendar').fullCalendar('destroy');
};

module.exports.refreshEvents = function (targetDivId, eventSource) {
  $('#' + targetDivId).fullCalendar('removeEvents');
  $('#' + targetDivId).fullCalendar('addEventSource', eventSource);
};
