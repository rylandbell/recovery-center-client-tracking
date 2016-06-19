$(document).ready(function () {

  //validate Add Client form
  $('#add-client-form').on('submit', function (e) {
    $('.form-group').removeClass('has-warning');
    $('.form-group .help-block').addClass('hidden');

    var userInput = this.elements;
    for (var i = 0; i < userInput.length; i++) {

      //check that required fields aren't empty
      if (userInput[i].required && userInput[i].value.length === 0) {
        e.preventDefault();
        showWarning(userInput[i].name);
      }

      //check that phone numbers are either blank or have 10 digits
      if (userInput[i].name === 'phoneNumber') {
        if (userInput[i].value.length > 0 && userInput[i].value.length < 14) {
          e.preventDefault();
          showWarning(userInput[i].name);
        }
      }
    }

    function showWarning(input) {

      //Select the input's parent form-group, not the input itself
      var formGroup = '#' + input + '-group';
      $(formGroup).addClass('has-warning');
      $(formGroup + '>.hidden').removeClass('hidden');
    }
  });
});
