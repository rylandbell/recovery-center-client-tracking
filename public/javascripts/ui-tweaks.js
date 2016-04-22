$('.glyphicon').tooltip();

$('.glyphicon-pencil').on('click',function(){
	window.document.location='/edit-patient';
})

$('tr').on('click',function(){
	window.document.location='/dashboard';
})

