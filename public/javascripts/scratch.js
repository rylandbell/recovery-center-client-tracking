$(document).ready(function(){
	google.charts.load('current', {'packages':['controls']});
	google.charts.setOnLoadCallback(drawDashboard);

	function drawDashboard() {
	    var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard-div'));

	}

	var visibleTasks = new google.visualization.ControlWrapper({
	    'controlType': 'CategoryFilter',
	    'containerId': 'filter-div',
	    'options': {
	      'filterColumnLabel': 'Visible Response Categories'
	    }
	 });

	var myChart = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart-div',
    'options': {
      'width': 300,
      'height': 300
    }
  });


	// google.charts.load('current', {packages: ['corechart', 'line']});
	// google.charts.setOnLoadCallback(function(){
	// 	drawLineGraph(fudgeData(7),options);
	// });

	// function fudgeData(days){
	// 	var outputArray = [];
	// 	var dateArray = [];
	// 	var today = new Date(2016, 4, 6);
	// 	for (var i = 0; i<days; i++){
	// 		var x;
	// 		x = today.setDate(today.getDate()-1);
	// 		dateArray.push(x);
	// 	}
	// 	for (var i = 0; i<days; i++){
	// 		var x = [new Date(dateArray[i]),Math.min(i+6,10),10,Math.max(7-i,0),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1)];
	// 		outputArray.push(x);
	// 	}
	// 	return outputArray;
	// }

	// var options = {
	// 	hAxis: {
	// 	  format: 'EEE, MMM d'
	// 	},
	// 	vAxis: {
	// 	  gridlines: {count: 6},
	// 	  viewWindowMode: 'pretty',
	// 	},
	// 	// title: 'Daily Check-In Results',
	// 	titleTextStyle: {
	// 		fontName: 'Droid Serif',
	// 		fontSize: 24
	// 	},
	// 	legend: {
	// 		position: 'top',
	// 		alignment: 'center',
	// 	},
	// 	height: 400,
	// 	lineWidth: 3,
	// 	focusTarget: 'datum',
	// 	pointSize: 7,
	// 	// backgroundColor: 'grey',
	// 	animation: {
	// 		startup: true,
	// 		duration: 500,
	// 		easing: 'out'
	// 	},
	// 	chartArea:{
	// 		height:'70%', 
	// 		top: 50,
	// 		left: 50,
	// 		width: '90%'
	// 	},
	// 	fontSize: 18,
	// 	fontName: 'Droid Sans'
	// };

	// function drawLineGraph(dataArray,options) {
	// 	var data = new google.visualization.DataTable();
	// 	data.addColumn('date', 'X');
	// 	data.addColumn('number', 'Cravings');
	// 	data.addColumn('number', 'Sleep');
	// 	data.addColumn('number', 'Stress');
	// 	data.addColumn('number', 'Mood');
	// 	data.addColumn('number', 'Energy');
	// 	data.addColumn('number', 'Goals');

	// 	data.addRows(dataArray);

		

	// 	var chart = new google.visualization.LineChart(document.getElementById('line-chart'));
	// 	chart.draw(data,options);
	// }







})
