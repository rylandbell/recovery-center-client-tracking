$(document).ready(function () {
  $('form').on('submit', function (e) {
    $('.form-group').removeClass('has-warning');
    $('.form-group .help-block').addClass('hidden');

    var userInput = $(this).serializeArray();

    userInput.forEach(function (field) {

      //check that required fields aren't empty
      if (field.name === 'lastName' && field.value.length === 0) {
        $('#last-name-group').addClass('has-warning');
        $('#last-name-group>.hidden').removeClass('hidden');
        e.preventDefault();
      }

      if (field.name === 'firstName' && field.value.length === 0) {
        $('#first-name-group').addClass('has-warning');
        $('#first-name-group>.hidden').removeClass('hidden');
        e.preventDefault();
      }

      if (field.name === 'username' && field.value.length === 0) {
        $('#username-group').addClass('has-warning');
        $('#username-group>.hidden').removeClass('hidden');
        e.preventDefault();
      }

      if (field.name === 'password' && field.value.length === 0) {
        $('#password-group').addClass('has-warning');
        $('#password-group>.hidden').removeClass('hidden');
        e.preventDefault();
      }

      //check that phone numbers are either blank or have 10 digits
      if (field.name === 'phoneNumber') {
        if (field.value.length > 0 && field.value.length < 14) {
          $('#phone-number-group').addClass('has-warning');
          $('#phone-number-group>.hidden').removeClass('hidden');
          e.preventDefault();
        }
      }
    });
  });
});
