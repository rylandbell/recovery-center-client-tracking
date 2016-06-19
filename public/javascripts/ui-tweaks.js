$(document).ready(function () {

  //initialize Bootstrap features:
  $('.glyphicon').tooltip();
  $('.dead-link').tooltip();

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

  //mark current page as active in navbar:
  var url = window.location.pathname.split('/')[1];
  $('#' + url).addClass('active-sidebar');

  //mask phone number input field
  $('#phone').mask('(999) 999-9999', { placeholder: '(___) ___-____' });
});
