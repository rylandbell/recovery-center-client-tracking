$(document).ready(function () {

  //initialize Bootstrap features:
  $('.glyphicon').tooltip();
  $('.dead-link').tooltip();

  //make nav for current page active in top navbar
  var url = window.location.pathname;
  if (url === '/') {
    url = '/client-list';
  }

  //highlight appropriate nav in single-client view sidebar
  url = url.split('/')[1];
  $('#' + url + '-nav').addClass('active');

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
  var currentPage = window.location.pathname.split('/')[1];
  var target = 'li#' + currentPage + '-nav';
  $(target).addClass('active-sidebar');

  //mask phone number input fields
  if ($('input[type=phone]').mask) {
    $('input[type=phone]').mask('(999) 999-9999', { placeholder: '(___) ___-____' });
  }

  //mask date input fields
  if ($('.date-input').mask) {
    $('.date-input').mask('9999-99-99', { placeholder: 'yyyy-mm-dd' });
  }

  //DataTables:
  $('.dynamic-table').show();
  $('.dynamic-table').DataTable();
  $('.partial-dynamic-table').DataTable({
    paging: false,
    searching: false,
    info: false
  });

  //Edit contact info: add existing info to resulting modal:
  $('isChecked-true').attr('checked',true);
  $('isChecked-false').attr('checked',false);

  //Client details view: select appropriate tab on load:
  var queryString=window.location.href.split('?')[1];
  $('#'+queryString+'-tab').tab('show');

});
