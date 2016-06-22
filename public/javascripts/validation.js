$(document).ready(function () {

  //validate client add/edit forms
  $('form').on('submit', function (e) {
    e.preventDefault();
    $('.form-group').removeClass('has-warning');
    $('.form-group>div.help-block').remove();

    var userInput = this.elements;
    for (var i = 0; i < userInput.length; i++) {

      //check that required fields aren't empty
      if (userInput[i].required && !userInput[i].value) {
        e.preventDefault();
        showWarning(userInput[i], 'Required field.');
      }

      //check that phone numbers are either blank or have 10 digits
      if (userInput[i].name === 'phoneNumber') {
        if (userInput[i].value.length > 0 && userInput[i].value.length < 14) {
          e.preventDefault();
          showWarning(userInput[i], 'Phone numbers must have a full 10 digits.');
        }
      }

      if ($(userInput[i]).hasClass('date-input')) {
        var dateString = userInput[i].value;
        if (dateString.length > 0) {

          //check that the date string is either blank or has a full 10 characters
          if (dateString.length < 10) {
            e.preventDefault();
            showWarning(userInput[i], 'Date inputs must have the form MM/DD/YYYY.');
          }

          //check that a date object can be produced. (this checks against e.g. 25/25/1900)
          else if (isNaN(Date.parse(dateString))) {
            e.preventDefault();
            showWarning(userInput[i], 'Not a valid date. Date inputs have the form MM/DD/YYYY.');
          }
        }
      }
    }

    function showWarning(input, message) {
      $(input).closest('.form-group').addClass('has-warning');

      var $messageBlock = $('<div>',
        {
          class: 'help-block',
          text: message
        }
      );
      $(input).parent().append($messageBlock);
    }
  });
});
