// next steps:
// 'return to today' button
// fix bug for displaying full month names


$(document).ready(function(){
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var today = new Date();
	var targetDate = new Date();
	function findWeek(date){
		var week = {};
	    var dayNumber = date.getDay();
	    var start = date.setDate(date.getDate()-dayNumber);
	    week.sunday = new Date(start);
	    var sat = date.setDate(date.getDate()+6);
	    week.saturday = new Date(sat);
	    return(week);
	}

	function prettyDate(date){
	    var pretty = months[date.getMonth()]+" "+date.getDate();
	    return pretty;
	}

	function updateDateRange(date){
		var week = findWeek(date);
		var sunday = prettyDate(week.sunday);
		var saturday = prettyDate(week.saturday);
		if (sunday.substring(0,3)===saturday.substring(0,3)){
			saturday = saturday.substring(3);
		}
		var weekString = sunday+" - "+saturday;
		$('#date-range').text(weekString);
	}

	if($('#history').length){
		$('#next-week').hide();
		updateDateRange(targetDate);
		$('#prev-week').click(function(){
			targetDate.setDate(targetDate.getDate()-7);
			updateDateRange(targetDate);
			$('#next-week').show();
		})
		$('#next-week').click(function(){
			targetDate.setDate(targetDate.getDate()+7);
			updateDateRange(targetDate);	
			if(targetDate>=today){
				$('#next-week').hide();
			}	
		})
	} else {
		console.log('no');
	}
})

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(function(){
	drawLineGraph(fudgeData());
});


function fudgeData(){
	var outputArray = [];
	var dateArray = [];
	var today = new Date(2016, 4, 6);
	for (var i = 0; i<7; i++){
		var x;
		x = today.setDate(today.getDate()-1);
		dateArray.push(x);
	}
	for (var i = 0; i<7; i++){
		var x = [new Date(dateArray[i]),Math.min(i+6,10),10,7-i,Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1)];
		outputArray.push(x);
	}
	return outputArray;
}

function drawLineGraph(dataArray) {
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'X');
	data.addColumn('number', 'Cravings');
	data.addColumn('number', 'Sleep');
	data.addColumn('number', 'Stress');
	data.addColumn('number', 'Mood');
	data.addColumn('number', 'Energy');
	data.addColumn('number', 'Goals');

	data.addRows(dataArray);

	var options = {
		hAxis: {
		  format: 'EEE, MMM d'
		  // gridlines: {count:15}
		},
		vAxis: {
		  gridlines: {count: 6},
		  viewWindowMode: 'pretty'
		},
		// title: 'Daily Check-In Results',
		titleTextStyle: {
			fontName: 'Droid Serif',
			fontSize: 24
		},
		legend: {
			position: 'right',
			alignment: 'center'
		},
		height: 500,
		lineWidth: 3,
		focusTarget: 'datum',
		pointSize: 10,
		// backgroundColor: 'grey',
		animation: {
			startup: true,
			duration: 500,
			easing: 'out'
		},
		aggregationTarget: 'category',
		chartArea:{
			height:'80%', 
			top: 50,
			left: 50,
			width: '75%'
		},
		fontSize: 18,
		fontName: 'Droid Sans'
	};

	var chart = new google.visualization.LineChart(document.getElementById('line-chart'));
	chart.draw(data,options);
}