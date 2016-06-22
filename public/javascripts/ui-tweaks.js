$(document).ready(function () {

  //initialize Bootstrap features:
  $('.glyphicon').tooltip();
  $('.dead-link').tooltip();
  $('tr[data-tooltip="true"]').tooltip();

  $('.nav-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $('#client-table tbody tr').on('click', function (e) {
    var clientId = this.id.substring(7);
    window.document.location = '/client-details/' + clientId;
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

  //mark current page as active in sidebar:
  var url = window.location.pathname.split('/')[1];
  $('#' + url).addClass('active-sidebar');

  //mask phone number input fields
  if ($('input[type=phone]').mask) {
    $('input[type=phone]').mask('(999) 999-9999', { placeholder: '(___) ___-____' });
  }

  //mask date input fields
  if ($('.date-input').mask) {
    $('.date-input').mask('99/99/9999', { placeholder: 'mm/dd/yyyy' });
  }
});
