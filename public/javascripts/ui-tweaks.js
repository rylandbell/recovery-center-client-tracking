$('.glyphicon').tooltip();
$('.dead-link').tooltip();

$('.glyphicon-pencil').on('click', function () {
  window.document.location = '/edit-patient';
});

$('#client-table tbody tr').on('click', function () {
  window.document.location = '/check-in-history';
});
