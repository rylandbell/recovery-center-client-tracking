$('.glyphicon').tooltip();
$('.dead-link').tooltip();

$('.glyphicon-pencil').on('click', function () {
  window.document.location = '/edit-patient';
});

$('tbody tr').on('click', function () {
  window.document.location = '/check-in-history';
});
