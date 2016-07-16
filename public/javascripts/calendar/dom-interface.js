define(function(){
  var exports = {};

  exports.authCheckDisplay = function (authorized) {
    $('.auth-waiting').hide();
    if (authorized) {
      $('.auth-view').hide();
      $('.cal-view').show();
    } else {
      $('.auth-view').show();
      $('.cal-view').hide();
    }
  };

  exports.showCalName = function (calendarObject) {
    $('#cal-name').text('Active calendar: ' + calendarObject.id);
  };

  exports.showEventPopover = function (event, jsEvent) {
    $(jsEvent.currentTarget)
      .popover({
        html: true,
        content: '<p>(Clicking Details will take you to this event\'s page on Googles Calendar.)</p><p><button class="btn btn-danger delete-event" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>&nbsp;<a href="' + event.htmlLink + '" target="_blank"><button class="btn btn-primary pull-right" data-googleId="' + event.googleId + '" data-id="' + event._id + '"><span class="glyphicon glyphicon-edit"></span>&nbsp;Details</button></a></p>',
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

  exports.showError = function (message) {
    $('#error-message').text(message);
    $('.cal-view').show();
    $('#error-container').show();
    $('#message-box').hide();
    $('#calendar')
      .find('*')
      .not('#error-container')
      .off()
      .fadeTo(1000, 0.9);
    $('.sidebar')
      .find('*')
      .hide();
  };

  exports.showLoadingMessage = function (loading) {
    if (loading) {
      $('.cal-loading').show();
    } else {
      $('.cal-loading').hide();
    }
  };

  exports.showAuthWaitingMessage = function (loading) {
    if (loading) {
      $('.auth-waiting').show();
    } else {
      $('.auth-waiting').hide();
    }
  };

  return exports;
});