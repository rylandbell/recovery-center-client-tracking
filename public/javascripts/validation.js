$(document).ready(function () {

  //validate Add Client form
  $('form').on('submit', function (e) {
    $('.form-group').removeClass('has-warning');
    $('.form-group .help-block').addClass('hidden');

    var userInput = this.elements;
    for (var i = 0; i < userInput.length; i++) {

      //check that required fields aren't empty
      if (userInput[i].required && userInput[i].value.length === 0) {
        e.preventDefault();
        showWarning(userInput[i]);
      }

      //check that phone numbers are either blank or have 10 digits
      if (userInput[i].name === 'phoneNumber') {
        if (userInput[i].value.length > 0 && userInput[i].value.length < 14) {
          e.preventDefault();
          showWarning(userInput[i]);
        }
      }
    }

    function showWarning(input) {
      $(input).parent().addClass('has-warning');
      $(input).parent().children('.hidden').removeClass('hidden');
    }
  });
});
